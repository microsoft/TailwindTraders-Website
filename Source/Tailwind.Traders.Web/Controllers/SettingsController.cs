using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Linq;

namespace Tailwind.Traders.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly Settings _settings;
        public SettingsController(IOptionsSnapshot<Settings> settings) => _settings = settings.Value;

        [HttpGet()]
        public ActionResult<Settings> GetSettings()
        {
            var settings = _settings;
            if (Request.Headers.TryGetValue("azds-route-as", out var devspaceName)) 
            {
                settings = _settings.Clone();
                settings.UseDevspacesName(devspaceName.FirstOrDefault() ?? string.Empty);
            }
            return Ok(settings);
        }

     }
}
