using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProductsController : Controller
    {
        private readonly SqlConnection sqlConnection;

        public ProductsController(SqlConnection sqlConnection)
        {
            this.sqlConnection = sqlConnection;
        }

        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetProductDetails([FromRoute] int id)
        {
            await sqlConnection.OpenAsync();
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
                p.ImageUrl = "https://tailwindtraders.blob.core.windows.net/product-detail/" + p.ImageUrl;
                return p;
            }, new { Id = id });

            var product = results.FirstOrDefault();

            if (product != null)
            {
                product.Features = await sqlConnection.QueryAsync<ProductFeature>(@"
                    SELECT * FROM Features WHERE ProductItemId = @Id
                ", new { Id = id });
            }

            return Ok(product);
        }

        [HttpGet()]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetProducts([FromQuery] int[] brand = null, [FromQuery] string[] type = null)
        {
            await sqlConnection.OpenAsync();
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
                WHERE t.Code IN @TypeCodes OR b.Id IN @BrandIds
            ", (p, b, t) =>
            {
                p.Brand = b;
                p.Type = t;
                p.ImageUrl = "https://tailwindtraders.blob.core.windows.net/product-detail/" + p.ImageUrl;
                return p;
            }, new
            {
                TypeCodes = type,
                BrandIds = brand
            });

            var brands = await sqlConnection.QueryAsync<ProductBrand>(@"
                SELECT 
                    b.Id
                    ,b.Name
                FROM Brands as b
            ");

            var types = await sqlConnection.QueryAsync<ProductType>(@"
                SELECT 
                    t.Id
                    ,t.Code
                    ,t.Name
                FROM Types as t
            ");

            return Ok(new
            {
                brands,
                types,
                products
            });
        }
    }
}