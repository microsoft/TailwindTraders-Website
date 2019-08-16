namespace Tailwind.Traders.Web.Standalone.Models
{
    public class ShoppingCartItemRequest
    {
        public ShoppingCartItem DetailProduct { get; set; }
        public int Qty { get; set; }
    }
    
    public class ShoppingCartItem
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public decimal Price { get; set; }
    }
}