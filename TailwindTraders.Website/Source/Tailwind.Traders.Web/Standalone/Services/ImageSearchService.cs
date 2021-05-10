using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Services
{
    public class ImageSearchService : IImageSearchService
    {
        private readonly IImageSearchTermPredictor predictor;
        private readonly IProductService productService;

        public ImageSearchService(
            IImageSearchTermPredictor predictor, IProductService productService)
        {
            this.predictor = predictor;
            this.productService = productService;
        }

        public async Task<ImageSearchResult> GetProducts(Stream imageStream)
        {
            var searchTerm = await predictor.PredictSearchTerm(imageStream);

            var result = new ImageSearchResult {
                PredictedSearchTerm = searchTerm
            };

            var products = await productService.GetProducts(searchTerm: searchTerm);

            var searchResults = products.Select(p => new SearchProductItem
            {
                Id = p.Id,
                ImageUrl = p.ImageUrl,
                Name = p.Name,
                Price = (float)p.Price
            });
            result.SearchResults = searchResults;

            return result;
        }
    }
}