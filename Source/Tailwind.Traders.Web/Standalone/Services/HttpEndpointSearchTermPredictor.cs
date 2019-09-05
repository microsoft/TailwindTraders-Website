using System.IO;
using System.Threading.Tasks;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using Microsoft.Extensions.Configuration;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using System;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using Microsoft.Extensions.Logging;

namespace Tailwind.Traders.Web.Standalone.Services
{
    public class HttpEndpointSearchTermPredictor : IImageSearchTermPredictor
    {
        private readonly ILogger<HttpEndpointSearchTermPredictor> logger;
        private readonly string imageEndpoint;
        private readonly CloudStorageAccount storageAccount;

        public HttpEndpointSearchTermPredictor(IConfiguration config, ILogger<HttpEndpointSearchTermPredictor> logger)
        {
            this.logger = logger;
            this.imageEndpoint = config["ImagePredictorEndpoint"];
            if (!CloudStorageAccount.TryParse(config["StorageConnectionString"], out this.storageAccount)) {
                throw new ArgumentException("No 'StorageConnectionString' setting has been configured");
            }
        }

        async Task<string> IImageSearchTermPredictor.PredictSearchTerm(Stream imageStream)
        {
            var eventId = new EventId();
            IImageFormat imageFormat;
            var image = Image.Load(imageStream, out imageFormat);

            // resize image constraining it to 500px in any dimension
            var resizedImage = image.Clone(
                ctx => ctx.Resize(new ResizeOptions {
                    Size = new Size(500,500),
                    Mode = ResizeMode.Max
                }));
            
            // upload the file
            var cloudBlobClient = storageAccount.CreateCloudBlobClient();
            var cloudBlobContainer = cloudBlobClient.GetContainerReference("website-uploads");
            var filename = Guid.NewGuid().ToString() + ".jpg";
            var cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(filename);
            var blobStream = new MemoryStream();
            resizedImage.SaveAsJpeg(blobStream);
            blobStream.Seek(0,SeekOrigin.Begin);
            await cloudBlockBlob.UploadFromStreamAsync(blobStream);

            logger.LogInformation(eventId, "Image uploaded to {StorageUrl}", cloudBlockBlob.Uri.AbsoluteUri);

            // pass the file to the endpoint
            var fullEndpoint = imageEndpoint + cloudBlockBlob.Uri.AbsoluteUri;
            HttpClient client = new HttpClient();
            var response = await client.GetAsync(fullEndpoint);
            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStreamAsync();

            var serializer = new DataContractJsonSerializer(typeof(ImageRecognitionResult));
            var resultObject = (ImageRecognitionResult)serializer.ReadObject(responseBody);

            logger.LogInformation(eventId, "Result prediction: {prediction} with confidence - hammer: {hammerconf}, wrench: {wrenchconf}", 
                resultObject.prediction, resultObject.scores.hammer, resultObject.scores.wrench);

            return await Task.FromResult(resultObject.prediction);;
        }
    }

    [DataContract]
    public class ImageRecognitionResult {
        [DataMember]
        public string time { get; set; }
        [DataMember]
        public string prediction { get; set; }
        [DataMember]
        public PredictionScores scores { get; set; }
    }

    [DataContract]
    public class PredictionScores {
        [DataMember]
        public decimal hammer { get; set; }
        [DataMember]
        public decimal wrench { get; set; }
    }
}
