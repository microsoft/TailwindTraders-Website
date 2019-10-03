using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone
{
    public interface IImageSearchService
    {
        Task<ImageSearchResult> GetProducts(Stream imageStream);
    }
}