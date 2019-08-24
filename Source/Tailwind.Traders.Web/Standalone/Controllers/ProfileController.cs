using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProfilesController: Controller
    {
        [Authorize]
        [HttpGet("navbar/me")]
        public IActionResult GetMe()
        {
            var userId = User.Identity.Name;
            return Ok(new
            {
                Profile = new Profile
                {
                    Email = userId,
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