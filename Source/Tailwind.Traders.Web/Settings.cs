using Newtonsoft.Json;

namespace Tailwind.Traders.Web
{
    public class Settings 
    {
        public Settings()
        {
            DevspacesName = string.Empty;
        }
        public string Auth  {get; set;}
        public string ApiUrl {get; set;}
        public string ApiUrlShoppingCart {get; set;}
        public bool UseB2C { get; set; }
        [JsonIgnore]
        public string SqlConnectionString { get; set; }
        [JsonIgnore]
        public string MongoConnectionString { get; set; }

        public B2CAuth B2CAuth { get; set; }
        public CartSettings Cart {get; set;}
        public ApplicationInsightsSettings ApplicationInsights { get; set; }
            = new ApplicationInsightsSettings();

        public DebugInformationSettings DebugInformation { get; set; }
            = new DebugInformationSettings();

        public bool ByPassShoppingCartApi {get; set;}

        // This is set by the SettingsController, do not set via config because will be overriden
        public string DevspacesName {get; private set;}

        public string ProductImagesUrl { get; set; }

        public void UseDevspacesName(string devspacesName) => DevspacesName = devspacesName;

        public PersonalizerSettings Personalizer { get; set; }

        public Settings Clone()
        {
            var clone = new Settings() 
            {
                ApiUrl = ApiUrl,
                Auth = Auth,
                ApiUrlShoppingCart = ApiUrlShoppingCart,
                ByPassShoppingCartApi = ByPassShoppingCartApi,
                UseB2C = UseB2C
            };

            if (Cart != null) 
            {
                clone.Cart = new CartSettings() 
                {
                    AuthKey = Cart?.AuthKey,
                    ContainerId = Cart?.ContainerId,
                    DatabaseId = Cart?.ContainerId,
                    Host = Cart?.Host,
                };
            }

            return clone;
        }
    }

    public class CartSettings {
        public string AuthKey {get; set;}
        public string ContainerId {get; set;}
        public string DatabaseId {get; set;}
        public string Host {get; set;}
    }
    public class B2CAuth
    {
        public string ClientId { get; set; }
        public string Authority { get; set; }
        public string Scopes { get; set; }
    }

    public class ApplicationInsightsSettings
    {
        public string InstrumentationKey { get; set; } = "";
    }

    public class DebugInformationSettings
    {
        public string SqlServerName { get; set; }
        public string MongoServerName { get; set; }
        public string CustomText { get; set; }
        public bool ShowDebug { get; set; }
    }

    public class PersonalizerSettings
    {
        public string ApiKey { get; set; }
        public string Endpoint { get; set; }
    }
}