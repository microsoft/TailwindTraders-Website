namespace Tailwind.Traders.Recommendations.Models
{
    internal class ShoppingCart
    {
        public string id { get; set; }
        public int qty { get; set; }
        public ShoppingDetailProduct detailProduct { get; set; }
    }
}
