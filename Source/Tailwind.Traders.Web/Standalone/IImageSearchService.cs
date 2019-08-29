using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone
{
    public interface IImageSearchService
    {
        Task<IEnumerable<SearchProductItem>> GetProducts(Stream imageStream);
    }
}