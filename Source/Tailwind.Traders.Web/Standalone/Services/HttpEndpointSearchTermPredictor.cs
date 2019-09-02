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

namespace Tailwind.Traders.Web.Standalone.Services
{
    public class HttpEndpointSearchTermPredictor : IImageSearchTermPredictor
    {
        private readonly IConfiguration config;
        private readonly string imageEndpoint;
        private readonly CloudStorageAccount storageAccount;

        public HttpEndpointSearchTermPredictor(IConfiguration config)
        {
            this.config = config;
            this.imageEndpoint = config["ImagePredictorEndpoint"];
            if (!CloudStorageAccount.TryParse(config["StorageConnectionString"], out this.storageAccount)) {
                throw new ArgumentException("No 'StorageConnectionString' setting has been configured");
            }
        }

        public string PredictSearchTerm(Stream imageStream)
        {
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
            cloudBlockBlob.UploadFromStream(blobStream);

            // pass the file to the endpoint
            var fullEndpoint = imageEndpoint + "?image=" + cloudBlockBlob.Uri;

            return fullEndpoint;
        }

        Task<string> IImageSearchTermPredictor.PredictSearchTerm(Stream imageStream)
        {
            throw new System.NotImplementedException();
        }
    }
}
