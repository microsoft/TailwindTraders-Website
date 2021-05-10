using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Advanced;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;

namespace Tailwind.Traders.Web.Standalone.Services
{
    public class OnnxImageSearchTermPredictor : IImageSearchTermPredictor
    {
        private readonly ILogger<OnnxImageSearchTermPredictor> logger;
        private readonly InferenceSession session;

        public OnnxImageSearchTermPredictor(IWebHostEnvironment environment, ILogger<OnnxImageSearchTermPredictor> logger)
        {
            this.logger = logger;
            var filePath = Path.Combine(environment.ContentRootPath, "Standalone/OnnxModels/products.onnx");
            //var file = System.IO.File.ReadAllBytes(filePath);
            session = new InferenceSession(filePath);
        }

        public Task<string> PredictSearchTerm(Stream imageStream)
        {
            DenseTensor<float> data = ConvertImageToTensor(imageStream);
            var input = NamedOnnxValue.CreateFromTensor<float>("data", data);
            using var output = session.Run(new[] { input });
            var prediction = output.First(i => i.Name == "classLabel").AsEnumerable<string>().First();
            return Task.FromResult(prediction);
        }

        private DenseTensor<float> ConvertImageToTensor(Stream imageStream)
        {
            var data = new DenseTensor<float>(new[] { 1, 3, 224, 224 });
            using (var image = Image.Load(imageStream))
            {
                image.Mutate(ctx => ctx.Resize(new ResizeOptions
                {
                    Size = new Size(224, 224),
                    Mode = ResizeMode.Stretch
                }));
                for (var x = 0; x < image.Width; x++)
                {
                    for (var y = 0; y < image.Height; y++)
                    {
                        var color = image.GetPixelRowSpan(y)[x];
                        data[0, 0, x, y] = color.B;
                        data[0, 1, x, y] = color.G;
                        data[0, 2, x, y] = color.R;
                    }
                }
            }
            return data;
        }
    }
}