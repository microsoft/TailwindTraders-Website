using System;

namespace Tailwind.Traders.Web
{
    public class Settings 
    {
        public string Auth  {get; set;}
        public string ApiUrl {get; set;}
        public string ApiUrlShoppingCart {get; set;}
        
        public CartSettings Cart {get; set;}

        public bool ByPassShoppingCartApi {get; set;}
    }

    public class CartSettings {
        public string AuthKey {get; set;}
        public string ContainerId {get; set;}
        public string DatabaseId {get; set;}
        public string Host {get; set;}
    }
}