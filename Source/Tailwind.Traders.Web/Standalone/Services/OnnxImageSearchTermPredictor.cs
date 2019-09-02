using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms.Image;
using Microsoft.ML.Transforms.Onnx;

namespace Tailwind.Traders.Web.Standalone.Services
{
    public class OnnxImageSearchTermPredictor : IImageSearchTermPredictor
    {
        private readonly PredictionEngine<ImageInput, ImagePrediction> engine;

        public OnnxImageSearchTermPredictor(IHostingEnvironment environment)
        {
            engine = LoadModel(
                Path.Combine(environment.ContentRootPath, "Standalone/OnnxModels/products.onnx"));
        }

        public Task<string> PredictSearchTerm(Stream imageStream)
        {
            var input = new ImageInput { Image = (Bitmap)Image.FromStream(imageStream) };
            ImagePrediction output;
            // TODO: Figure out if Predict is thread-safe
            lock(engine)
            {
                output = engine.Predict(input);
            }
            var prediction = output.Prediction.FirstOrDefault();
            return Task.FromResult(prediction);
        }

        private PredictionEngine<ImageInput, ImagePrediction> LoadModel(string onnxModelFilePath)
        {
            var ctx = new MLContext();
            var dataView = ctx.Data.LoadFromEnumerable(new List<ImageInput>());

            var pipeline = ctx.Transforms.ResizeImages(
                                resizing: ImageResizingEstimator.ResizingKind.Fill, 
                                outputColumnName: "data", 
                                imageWidth: 224, 
                                imageHeight: 224, 
                                inputColumnName: nameof(ImageInput.Image))
                            .Append(ctx.Transforms.ExtractPixels(outputColumnName: "data"))
                            .Append(ctx.Transforms.ApplyOnnxModel(
                                modelFile: onnxModelFilePath, 
                                outputColumnNames: new[] { "classLabel", "loss" }, inputColumnNames: new[] { "data" }));

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
        [ImageType(224, 224)]
        public Bitmap Image { get; set; }
    }
}