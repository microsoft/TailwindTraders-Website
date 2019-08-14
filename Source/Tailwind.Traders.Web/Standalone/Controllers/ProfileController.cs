using Microsoft.AspNetCore.Mvc;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProfilesController: Controller
    {
        [HttpGet("navbar/me")]
        public IActionResult GetMe()
        {
            return Ok(new
            {
                Profile = new Profile
                {
                    Email = "test@test.com",
                    Address = "7711 W. Pawnee Ave. Beachwood, OH 44122",
                    Name = "Test Tester",
                    PhoneNumber = "+1-202-555-0155",
                    Id = 0,
                    ImageUrlMedium = "defaultImage-m.jpg",
                    ImageUrlSmall = "defaultImage-s.jpg"
                }
            });
        }
    }
}