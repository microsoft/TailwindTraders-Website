using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Services
{
    public class OnnxImageSearchService : IImageSearchService
    {
        private readonly OnnxImagePredictor onnxPredictor;
        private readonly IProductService productService;

        public OnnxImageSearchService(
            OnnxImagePredictor onnxPredictor, IProductService productService)
        {
            this.onnxPredictor = onnxPredictor;
            this.productService = productService;
        }

        public async Task<IEnumerable<SearchProductItem>> GetProducts(Stream imageStream)
        {
            var searchTerm = onnxPredictor.PredictSearchTerm(imageStream);

            if (string.IsNullOrEmpty(searchTerm))
            {
                return new List<SearchProductItem>();
            }
            else
            {
                var products = await productService.GetProducts(searchTerm: searchTerm);

                var searchResults = products.Select(p => new SearchProductItem
                {
                    Id = p.Id,
                    ImageUrl = p.ImageUrl,
                    Name = p.Name,
                    Price = (float)p.Price
                });
                return searchResults;
            }
        }
    }
}