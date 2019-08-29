using System.Collections.Generic;
using System.Threading.Tasks;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone
{
    public interface IProductService
    {
        Task<Product> GetProduct(int id);
        Task<IEnumerable<Product>> GetProducts(int[] brandIds = null, string[] typeCodes = null, string searchTerm = "");
        Task<IEnumerable<ProductBrand>> GetBrands();
        Task<IEnumerable<ProductType>> GetTypes();
    }
}