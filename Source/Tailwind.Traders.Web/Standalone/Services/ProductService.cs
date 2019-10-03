using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Options;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Services
{
    public class ProductService : IProductService
    {
        private readonly SqlConnection sqlConnection;
        private readonly string productImagesUrl;

        public ProductService(SqlConnection sqlConnection, IOptions<Settings> settings)
        {
            this.sqlConnection = sqlConnection;
            
            var basePath = settings.Value.ProductImagesUrl;
            productImagesUrl = string.IsNullOrEmpty(basePath) ? 
                "https://tailwindtraders.blob.core.windows.net/product-detail" :
                basePath;
        }

        public async Task<IEnumerable<ProductBrand>> GetBrands()
        {
            await OpenConnection();
            var brands = await sqlConnection.QueryAsync<ProductBrand>(@"
                SELECT 
                    b.Id
                    ,b.Name
                FROM Brands as b
            ");
            return brands;
        }

        public async Task<Product> GetProduct(int id)
        {
            await OpenConnection();
            var results = await sqlConnection.QueryAsync<Product, ProductBrand, ProductType, Product>(@"
                SELECT p.Id
                    ,p.Name
                    ,Price
                    ,ImageName as ImageUrl
                    ,BrandId
                    ,TypeId
                    ,TagId
                    ,b.Id
                    ,b.Name
                    ,t.Id
                    ,t.Code
                    ,t.Name
                FROM Products as p
                INNER JOIN Brands as b ON p.BrandId = b.Id
                INNER JOIN Types as t ON p.TypeId = t.Id
                WHERE p.Id = @Id
            ", (p, b, t) =>
            {
                p.Brand = b;
                p.Type = t;
                p.ImageUrl = $"{productImagesUrl}/{p.ImageUrl}";
                return p;
            }, new { Id = id });

            var product = results.FirstOrDefault();

            if (product != null)
            {
                product.Features = await sqlConnection.QueryAsync<ProductFeature>(@"
                    SELECT * FROM Features WHERE ProductItemId = @Id
                ", new { Id = id });
            }

            return product;
        }

        public async Task<IEnumerable<Product>> GetProducts(int[] brandIds = null, string[] typeCodes = null, string searchTerm = "")
        {
            await OpenConnection();
            var products = await sqlConnection.QueryAsync<Product, ProductBrand, ProductType, Product>(@"
                SELECT p.Id
                    ,p.Name
                    ,Price
                    ,ImageName as ImageUrl
                    ,BrandId
                    ,TypeId
                    ,TagId
                    ,b.Id
                    ,b.Name
                    ,t.Id
                    ,t.Code
                    ,t.Name
                FROM Products as p
                INNER JOIN Brands as b ON p.BrandId = b.Id
                INNER JOIN Types as t ON p.TypeId = t.Id
                WHERE
                    t.Code IN @TypeCodes OR 
                    b.Id IN @BrandIds OR
                    p.Name LIKE @SearchKeyword
            ", (p, b, t) =>
            {
                p.Brand = b;
                p.Type = t;
                p.ImageUrl = $"{productImagesUrl}/{p.ImageUrl}";
                return p;
            }, new
            {
                TypeCodes = typeCodes,
                BrandIds = brandIds,
                SearchKeyword = string.IsNullOrEmpty(searchTerm) ? null : $"%{searchTerm}%"
            });

            return products;
        }

        public async Task<IEnumerable<ProductType>> GetTypes()
        {
            await OpenConnection();
            var types = await sqlConnection.QueryAsync<ProductType>(@"
                SELECT 
                    t.Id
                    ,t.Code
                    ,t.Name
                FROM Types as t
            ");
            return types;
        }

        private async Task OpenConnection()
        {
            try
            {
                await sqlConnection.OpenAsync();
            }
            catch {}
        }
    }
}