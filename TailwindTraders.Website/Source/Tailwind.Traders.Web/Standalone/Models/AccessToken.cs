using Newtonsoft.Json;

namespace Tailwind.Traders.Web.Standalone.Models
{
    public class AccessToken
    {
        [JsonProperty(PropertyName = "token")]
        public string Token { get; set; }

        [JsonProperty(PropertyName = "token_type")]
        public string TokenType { get; set; }

        [JsonProperty(PropertyName = "expires_in")]
        public int ExpiresIn { get; set; }
    }
}