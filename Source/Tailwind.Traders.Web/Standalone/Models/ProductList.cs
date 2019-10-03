using System.Collections.Generic;

namespace Tailwind.Traders.Web.Standalone.Models
{
    public class ProductList
    {
        public IEnumerable<Product> Products { get; set; }
        public IEnumerable<ProductBrand> Brands { get; set; }
        public IEnumerable<ProductType> Types { get; set; }
    }
}