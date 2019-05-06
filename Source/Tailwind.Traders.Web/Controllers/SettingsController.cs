using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Tailwind.Traders.Web.Controllers
{
    [Route("api/[controller]")]
    public class SettingsController : Controller
    {
        private readonly Settings _settings;
        public SettingsController(IOptions<Settings> settings) => _settings = settings.Value;

        [HttpGet()]
        public IActionResult GetSettings()
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
