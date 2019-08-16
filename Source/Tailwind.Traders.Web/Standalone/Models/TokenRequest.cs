using Newtonsoft.Json;

namespace Tailwind.Traders.Web.Standalone.Models
{
    public class TokenRequest
    {
        public string Username { get; set; }

        public string Password { get; set; }
        
        [JsonProperty(PropertyName = "grant_type")]
        public string GrantType { get; set; }
    }
}