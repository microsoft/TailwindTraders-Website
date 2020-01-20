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

### Deploy to Azure App Service (automatic deployment)

Click this button to deploy the application in "Standalone" or "Frontend Only" mode.

[![Deploy to Azure](https://azuredeploy.net/deploybutton.svg)](https://portal.azure.com/?feature.customportal=false#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2FTailwindTraders-Website%2Fmaster%2Fazuredeploy.json)

#### Standalone

This method deploys the Tailwind Traders website with a SQL DB and Cosmos DB, and does not depend on backend microservices.

- Select `standalone`
- Ensure you select a region where you're allowed to deploy SQL Databases and App Services, each of those services have restrictions for internal subscriptions (`eastus` seems to work).
- Use a short name (< 20 characters), that name is used to generate resource names. Each resource has different naming restrictions. Stick to lower case characters, numbers, and dashes.
- Enter a strong password for SQL, but do NOT use `;` (this is a separator in SQL connection strings)

#### Frontend Only

This method deploys the Tailwind Traders website and calls backend services hosted somewhere else.

- Select `frontendOnly`
- You can leave the SQL login information blank

### Deploy to Azure App Service (manual deployment)

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

You can select the correct implementation for your needs by setting the `ImagePredictorEndpoint` app setting:
- **HTTP Endpoint** - set `ImagePredictorEndpoint` with the correct endpoint URL
- **Embedded ONNX model** - do not set `ImagePredictorEndpoint` or set it to an empty string

Depending on the setting, the application will use `HttpEndpointSearchTermPredictor` or `OnnxImageSearchTermPredictor`.

`HttpEndpointSearchTermPredictor` is the Http endpoint implementation and it uses the `ImagePredictorEndpoint` configuration setting. It also saves files in a `website-uploads` container of an Azure Blob Storage account. The connection string needs to be set in a `StorageConnectionString` configuration file.

`OnnxImageSearchTermPredictor` is the implementation that uses an ONNX model. It expects a model file to be present at `Standalone/OnnxModels/products.onnx`.