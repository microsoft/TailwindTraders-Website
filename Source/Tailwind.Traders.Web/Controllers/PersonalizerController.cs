using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.CognitiveServices.Personalizer;
using Microsoft.Azure.CognitiveServices.Personalizer.Models;
using System;
using System.Collections.Generic;

namespace Tailwind.Traders.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonalizerController : Controller
    {
        private PersonalizerClient _personalizerClient;
        private static readonly string ApiKey = Environment.GetEnvironmentVariable("PERSONALIZER_RESOURCE_KEY");
        private static readonly string ServiceEndpoint = Environment.GetEnvironmentVariable("PERSONALIZER_RESOURCE_ENDPOINT");

        public PersonalizerController()
        {
            _personalizerClient = GetPersonalizerClient(ServiceEndpoint);
        }

        [HttpGet("Rank")]
        public IActionResult Get()
        {
            RankRequest request = GetRankRequest();
            RankResponse response = _personalizerClient.Rank(request);
            return Ok(response);
        }

        private PersonalizerClient GetPersonalizerClient(string url)
        {
            PersonalizerClient client;
            try
            {
                var credentials = new ApiKeyServiceClientCredentials(ApiKey);
                client = new PersonalizerClient(new ApiKeyServiceClientCredentials(ApiKey))
                {
                    Endpoint = url
                };
            }
            catch
            {
                client = null;
            }
            return client;
        }

        private RankRequest GetRankRequest()
        {
            string timeOfDay = DateTime.Now.Hour.ToString();
            string dayOfWeek = DateTime.Now.DayOfWeek.ToString();
            string userAgent = Request.Headers["User-Agent"].ToString();
            string osInfo = userAgent.Substring(userAgent.IndexOf("(") + 1, userAgent.IndexOf(")"));

            IList<object> currentContext = new List<object>()
            {
                new { time = timeOfDay },
                new { weekday = dayOfWeek },
                new { userOS = osInfo }
            };

            string eventId = Guid.NewGuid().ToString();

            IList<object> gardenCenterFeatures = new List<object>()
            {
                new { avgPrice = 10 },
                new { categorySize = 50 }
            };

            IList<object> powerToolsFeatures = new List<object>()
            {
                new { avgPrice = 20 },
                new { categorySize = 100 },
                new { childproof = false }
            };
            IList<object> plumbingFeatures = new List<object>()
            {
                new { avgPrice = 30 },
                new { categorySize = 150 }
            };
            IList<object> electricalFeatures = new List<object>()
            {
                new { avgPrice = 40 },
                new { categorySize = 200 }
            };

            IList<RankableAction> actions = new List<RankableAction>()
            {
                new RankableAction("Garden Center", gardenCenterFeatures),
                new RankableAction("Power Tools", powerToolsFeatures),
                new RankableAction("Electrical", electricalFeatures),
                new RankableAction("Plumbing", plumbingFeatures),
            };

            return new RankRequest(actions, currentContext, eventId: eventId);
        }
    }
}
