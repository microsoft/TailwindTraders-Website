using System.Collections.Generic;

namespace Tailwind.Traders.Web.Standalone.Models
{
    public class ImageSearchResult
    {
        public IEnumerable<SearchProductItem> SearchResults { get; set; }
        public string PredictedSearchTerm { get; set; }
    }
}