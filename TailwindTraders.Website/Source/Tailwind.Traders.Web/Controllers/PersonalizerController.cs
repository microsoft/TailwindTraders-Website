using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.CognitiveServices.Personalizer;
using Microsoft.Azure.CognitiveServices.Personalizer.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Tailwind.Traders.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonalizerController : Controller
    {
        private const string powerTools = "Power Tools";
        private const string gardenCenter = "Garden Center";
        private const string electrical = "Electrical";
        private const string plumbing = "Plumbing";
        private PersonalizerClient personalizerClient;
        Dictionary<string, IList<object>> featureMap;

        public PersonalizerController(IOptionsSnapshot<Settings> settings)
        {
            personalizerClient = CreatePersonalizerClient(settings.Value.Personalizer.ApiKey, settings.Value.Personalizer.Endpoint);
            featureMap = new Dictionary<string, IList<object>>();

            IList<object> gardenCenterFeatures = new List<object>()
            {
                new { avgPrice = 10 },
                new { categorySize = 50 },
                new { location = "outdoors" }
            };

            IList<object> powerToolsFeatures = new List<object>()
            {
                new { avgPrice = 20 },
                new { categorySize = 100 },
                new { childproof = false },
                new { location = "indoors" }
            };
            IList<object> plumbingFeatures = new List<object>()
            {
                new { avgPrice = 30 },
                new { categorySize = 150 },
                new { location = "indoors" }
            };
            IList<object> electricalFeatures = new List<object>()
            {
                new { avgPrice = 40 },
                new { categorySize = 200 },
                new { location = "indoors" }
            };

            featureMap.Add(powerTools, powerToolsFeatures);
            featureMap.Add(gardenCenter, gardenCenterFeatures);
            featureMap.Add(electrical, electricalFeatures);
            featureMap.Add(plumbing, plumbingFeatures);
        }

        [HttpPost("Rank")]
        public IActionResult PostRank([FromBody]RankCategories rankCategories)
        {
            RankRequest request = CreateRankRequest(rankCategories);
            RankResponse response;
            try
            {
                response = personalizerClient?.Rank(request);
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("Reward/{eventId}")]
        public IActionResult PostReward([FromRoute]string eventId, [FromBody]RewardRequest reward)
        {
            try
            {
                personalizerClient?.Reward(eventId, reward);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private PersonalizerClient CreatePersonalizerClient(string apiKey, string url)
        {
            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(url))
            {
                return null;
            }

            return new PersonalizerClient(new ApiKeyServiceClientCredentials(apiKey))
            {
                Endpoint = url
            };
        }

        private RankRequest CreateRankRequest(RankCategories rankCategories)
        {
            string timeOfDay = DateTime.Now.Hour.ToString();
            string dayOfWeek = DateTime.Now.DayOfWeek.ToString();
            string userAgent = Request.Headers["User-Agent"].ToString();
            Regex osRegex = new Regex(@"\(([^\)]*)\)");
            string osInfo = osRegex.Match(userAgent).Groups[1].Value;

            IList<object> currentContext = new List<object>()
            {
                new { time = timeOfDay },
                new { weekday = dayOfWeek },
                new { userOS = osInfo }
            };

            IList<RankableAction> actions = rankCategories.Categories.Select(category =>
             {
                 return new RankableAction(category, featureMap.GetValueOrDefault(category, new List<object>()));
             }).ToList();

            return new RankRequest(actions, currentContext);
        }
    }

    public class RankCategories
    {
        public IList<string> Categories;
    }
}
