using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Tailwind.Traders.Web.Legacy.Models;

namespace Tailwind.Traders.Web.Legacy.Controllers
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
    }
}