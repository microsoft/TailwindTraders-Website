using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Text.RegularExpressions;

namespace Tailwind.Traders.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly Settings _settings;
        public SettingsController(IOptionsSnapshot<Settings> settings, IConfiguration config)
        {
            _settings = settings.Value;
            if (!string.IsNullOrEmpty(_settings.SqlConnectionString))
            {
                var match = Regex.Match(_settings.SqlConnectionString, @"Server=(tcp:)?(?<servername>[^,;]+)");
                _settings.DebugInformation.SqlServerName = match.Groups["servername"].Value;
            }
            if (!string.IsNullOrEmpty(_settings.MongoConnectionString))
            {
                var match = Regex.Match(_settings.MongoConnectionString, @"//([^:]+:[^:]+@)?(?<servername>[^:/]+)");
                _settings.DebugInformation.MongoServerName = match.Groups["servername"].Value;
            }
            if (string.IsNullOrEmpty(_settings.ApplicationInsights.InstrumentationKey))
            {
                _settings.ApplicationInsights.InstrumentationKey = config["APPINSIGHTS_INSTRUMENTATIONKEY"];
            }
        }

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
