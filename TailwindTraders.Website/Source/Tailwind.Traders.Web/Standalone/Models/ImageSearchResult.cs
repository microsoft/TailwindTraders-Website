using System.Collections.Generic;

namespace Tailwind.Traders.Web.Standalone.Models
{
    public class ImageSearchResult
    {
        public IEnumerable<SearchProductItem> SearchResults { get; set; } = new List<SearchProductItem>();
        public string PredictedSearchTerm { get; set; }
    }
}