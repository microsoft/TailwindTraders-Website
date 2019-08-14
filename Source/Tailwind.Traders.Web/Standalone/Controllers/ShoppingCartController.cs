using Microsoft.AspNetCore.Mvc;

namespace Tailwind.Traders.Web.Standalone.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ShoppingCartController: Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new object[]{});
        }
    }
}