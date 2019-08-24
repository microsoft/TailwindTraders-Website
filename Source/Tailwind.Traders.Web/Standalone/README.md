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

> Deploy to Azure button coming

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
