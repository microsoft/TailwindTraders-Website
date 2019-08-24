using System.Collections.Generic;

namespace Tailwind.Traders.Web.Standalone.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public ProductBrand Brand { get; set; }
        public ProductType Type { get; set; }
        public IEnumerable<ProductFeature> Features { get; set; }
        public int StockUnits { get; set; } = 100;
    }
}