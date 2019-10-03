using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProductsController : Controller
    {
        private readonly IProductService productService;

        public ProductsController(
            IProductService productService)
        {
            this.productService = productService;
        }

        [HttpGet("{id}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetProductDetails([FromRoute] int id)
        {
            var product = await productService.GetProduct(id);
            return Ok(product);
        }

        [HttpGet()]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetProducts([FromQuery] int[] brand = null, [FromQuery] string[] type = null)
        {
            var products = await productService.GetProducts(brand, type);
            var types = await productService.GetTypes();
            var brands = await productService.GetBrands();

            return Ok(new ProductList
            {
                Brands = brands,
                Types = types,
                Products = products
            });
        }

        [HttpGet("landing")]
        public IActionResult GetPopularProducts()
        {
            return Ok(new object[] {});
        }
    }
}