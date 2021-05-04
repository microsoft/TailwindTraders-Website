using System.IO;
using System.Threading.Tasks;

namespace Tailwind.Traders.Web.Standalone
{
    public interface IImageSearchTermPredictor
    {
        Task<string> PredictSearchTerm(Stream imageStream);
    }
}