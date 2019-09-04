# Standalone deployment

This app can be deployed in standalone mode that uses its own databases, rather than calling out to backend microservices hosted elsewhere.

## Databases

The standalone version requires a couple of databases:

1. SQL Database
    - Run SQL Server locally on a VM or in a container
    - Create a SQL Database in Azure, ensuring the firewall rules are properly configured for the IP that your app is running at (select allow Azure resources if deploying the app to Azure)

1. MongoDB
    - Run MongoDB locally on a VM or in a container
    - Create an Azure Cosmos DB account with the MongoDB API

## Running the app

### Local

1. The app requires .NET Core SDK 2.1 or later

1. Publish the app (by default, it goes into `bin/Release/netcoreapp2.1/publish`)
    ```bash
    dotnet publish -c Release
    ```

1. Configure these environment variables
    - Configure the frontend to call APIs on this app
        - `apiUrl`: `/api/v1`
        - `ApiUrlShoppingCart`: `/api/v1`
    - Database connection strings
        - `SqlConnectionString`: SQL Database connection string
        - `MongoConnectionString`: MongoDB connection string

1. Run the app
    ```bash
    dotnet bin/Release/netcoreapp2.1/publish/Tailwind.Traders.Web.dll
    ```

### Deploy to Azure App Service

> **Deploy to Azure button** - Go to [this page](https://gist.github.com/anthonychu/9ab34d2991fb5c1c0c29faeebbe43a51#file-tailwind-deployments-md) for the latest deploy button(s)

1. Create a Web App (tested with Windows, but Linux should work too). If you need to select a stack, select ASP.NET Core 2.1. For the build to go faster, select at least an S1, ideally a Premium SKU.

1. Configure these app settings (place all of them in the Application Settings section, *not* Connection Strings)
    - Configure the frontend to call APIs on this app
        - `apiUrl`: `/api/v1`
        - `ApiUrlShoppingCart`: `/api/v1`
    - Database connection strings
        - `SqlConnectionString`: SQL Database connection string
        - `MongoConnectionString`: MongoDB connection string
    - Set the Node version if on Windows (needs 10+ to build and run)
        - `WEBSITE_NODE_DEFAULT_VERSION`: `10.15.2`

1. Fork this repo, and use the App Service Deployment Center to select your fork and the proper branch. Start the deployment and get a cup of coffee. ☕️

## Data

### SQL Database

On application startup, if `SqlConnectionString` is set, it will check if that database has tables. If not, it will create tables and seed them with data from CSV files downloaded from [here](https://github.com/microsoft/TailwindTraders-Backend/tree/master/Source/Services/Tailwind.Traders.Product.Api/Setup).

To reseed the database, you'll need to drop all tables in the DB and run the app again.

### MongoDB

It will create and use a database named `tailwind` and a collection named `cart` to store cart information. There's no seeding required.

## Demo-specific information

### Changing the image base URL

This allows you to change the base URL that is returned by the standalone product API.

Additionally, you can serve product images from the standalone app. This can be used to demo migrating product images hosted in the app to Blob Storage and CDN.

- To change the product images base URL, set the environment variable `ProductImagesUrl`
- To serve product images from the app itself:
    - Create a folder named `app_data/productimages`
    - Upload these images to the folder (use Kudu debug console)
    - Set `ProductImagesUrl` to `/productimages`

### Adding debug info to the page

You can add a debug header to the page. The header displays database server information, as well as a short custom text. Examples of how this can be used:

- Display which databases the app is using during a database migration demo
- Use the custom text to display the region name for an Azure Front Door region failover demo

To enable the debug header, set `DebugInformation__ShowDebug` to `true`.

To add custom text, set `DebugInformation__CustomText`.

### Changing the Image Search feature

There are two implementations of the image search. One that uses an embedded ONNX model, and one that calls an HTTP Endpoint taking an image URL in the querystring.

You can select the correct implementation for your needs using the `ConfigExtensions.cs` file by editing the dependency injection:

```services.AddSingleton<IImageSearchTermPredictor, HttpEndpointSearchTermPredictor>();```

`HttpEndpointSearchTermPredictor` is the Http endpoint implementation and it uses the `ImagePredictorEndpoint` configuration setting. It also saves files in a `website-uploads` container of an Azure Blob Storage account. The connection string needs to be set in a `StorageConnectionString` configuration file.

`OnnxImageSearchTermPredictor` is the implementation that uses an ONNX model. It expects a model file to be present at `Standalone/OnnxModels/products.onnx`.