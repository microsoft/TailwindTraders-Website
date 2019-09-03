using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics.Tensors;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms.Onnx;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Advanced;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;

namespace Tailwind.Traders.Web.Standalone.Services
{
    public class OnnxImageSearchTermPredictor : IImageSearchTermPredictor
    {
        private readonly PredictionEngine<ImageInput, ImagePrediction> engine;
        private readonly ILogger<OnnxImageSearchTermPredictor> logger;

        public OnnxImageSearchTermPredictor(IHostingEnvironment environment, ILogger<OnnxImageSearchTermPredictor> logger)
        {
            this.logger = logger;
            logger.LogInformation("ctor");
            engine = LoadModel(
                Path.Combine(environment.ContentRootPath, "Standalone/OnnxModels/products.onnx"));
        }

        public Task<string> PredictSearchTerm(Stream imageStream)
        {
            DenseTensor<float> data = ConvertImageToTensor(imageStream);
            var input = new ImageInput { Data = data.ToArray() };
            ImagePrediction output;

            logger.LogInformation("predict");
            // TODO: Figure out if Predict is thread-safe
            lock (engine)
            {
                output = engine.Predict(input);
            }
            var prediction = output.Prediction.FirstOrDefault();
            logger.LogInformation(prediction);
            return Task.FromResult(prediction);
        }

        private DenseTensor<float> ConvertImageToTensor(Stream imageStream)
        {
            logger.LogInformation("ConvertImageToTensor");
            var data = new DenseTensor<float>(new[] { 3, 224, 224 });
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
                        data[0, x, y] = color.B;
                        data[1, x, y] = color.G;
                        data[2, x, y] = color.R;
                    }
                }
            }

            return data;
        }

        private PredictionEngine<ImageInput, ImagePrediction> LoadModel(string onnxModelFilePath)
        {
            var ctx = new MLContext();
            var dataView = ctx.Data.LoadFromEnumerable(new List<ImageInput>());
            var pipeline = ctx.Transforms.ApplyOnnxModel(
                modelFile: onnxModelFilePath, 
                outputColumnNames: new[] { "classLabel", "loss" }, inputColumnNames: new[] { "data" });

            var model = pipeline.Fit(dataView);
            return ctx.Model.CreatePredictionEngine<ImageInput, ImagePrediction>(model);
        }
    }

    public class ImagePrediction
    {
        [ColumnName("classLabel")]
        [VectorType]
        public string[] Prediction;

        [OnnxSequenceType(typeof(IDictionary<string, float>))]
        public IEnumerable<IDictionary<string, float>> loss;
    }

    public class ImageInput
    {
        [VectorType(3, 224, 224)]
        [ColumnName("data")]
        public float[] Data { get; set; }
    }
}