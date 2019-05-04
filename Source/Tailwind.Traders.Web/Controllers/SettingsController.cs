using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Tailwind.Traders.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly Settings _settings;
        public SettingsController(IOptions<Settings> settings) => _settings = settings.Value;

        [HttpGet()]
        public ActionResult<Settings> GetSettings()
        {
            return _settings;
        }
    }
}
