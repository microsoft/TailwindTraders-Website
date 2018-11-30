using System.Collections.Generic;

namespace Tailwind.Traders.Recommendations.Models
{
    public class ShoppingCartRecommendation
    {
        public string email { get; set; }
        public int typeid { get; set; }
        public List<ShoppingDetailProduct> recommendations { get; set; } = new List<ShoppingDetailProduct>();
    }
}
