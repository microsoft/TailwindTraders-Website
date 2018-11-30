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
            return Ok(_settings);
        }

     }
}
