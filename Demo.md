# Apps 30 Demo Commands

### Environment Variables Used

```
resourceGroup=live-igniteapps30
location=eastus
subName="Ignite The Tour"
cosmosDBName=liveapps30twtnosqlge
sqlDBName=liveapps30twtsql
webappName=liveigniteapps30
acrName=liveigniteapps30acr
adminUser=twtadmin
adminPassword=twtapps30pD
```

### Resource Group Creation

`az group create --subscription "$subName" --name $resourceGroup --location $location`

### VNet Creation

`az network vnet create --name igniteapps30vnet --subscription "$subName" --resource-group $resourceGroup --subnet-name default`

### CosmosDB Creation

`az cosmosdb create --name $cosmosDBName --resource-group $resourceGroup --kind MongoDB --subscription "$subName"`

# SQL Server Creation

`az sql server create --location $location --resource-group $resourceGroup --name $sqlDBName --admin-user $adminUser --admin-password $adminPassword --subscription "$subName"`

# SQL Server Firewall Rule

`az sql server firewall-rule create --resource-group $resourceGroup --server $sqlDBName --name azure --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0 --subscription "$subName"`

# SQL Server DB Creation

`az sql db create --resource-group $resourceGroup --server $sqlDBName --name tailwind --subscription "$subName"`

# Azure Container Registry Creation

`az acr create --resource-group $resourceGroup --name $acrName --sku Basic --subscription "$subName" --admin-enabled true`

`az appservice plan create -g $resourceGroup -n $webappName --is-linux --sku S1`

# Build our image

```
cd igniteapps30/TailwindTraders-Website/Source/Tailwind.Traders.Web/
az acr build --subscription  "Ignite The Tour" --registry $acrName --image $webappName .
```

# Create our App Service Service Plan

`az appservice plan create -g $resourceGroup -n $webappName --is-linux --sku S1`

# Create our App Service Container Web App

`az webapp create --resource-group $resourceGroup --plan $webappName --name $webappName --deployment-container-image-name $acrName.azurecr.io/$webappName:ca1`

# Configure loggin on our web app

`az webapp log config -n $webappName -g $resourceGroup --web-server-logging filesystem`

# Speficy which image to use for our web app

`REGISTRY_PASSWORD=$(az acr credential show -n $acrName -o tsv --query 'passwords[0].value')`

`az webapp config container set --name $webappName --resource-group $resourceGroup --docker-custom-image-name liveigniteapps30acr.azurecr.io/$webappName:ca1 --docker-registry-server-url https://liveigniteapps30acr.azurecr.io --docker-registry-server-user liveigniteapps30acr --docker-registry-server-password $REGISTRY_PASSWORD`

# Get our Cosmos and SQL Connection strings

`cosmosConnectionString=$(az cosmosdb list-connection-strings --name $cosmosDBName --resource-group $resourceGroup --query 'connectionStrings[0].connectionString' -o tsv --subscription "$subName")`

`sqlConnectionString=$(az sql db show-connection-string --server $sqlDBName --name tailwind -c ado.net --subscription "$subName" | jq -r .)`

**Note:** Be sure to update the sqlConnection String with your

# Configure environment variables for our webapp to work properly

`az webapp config appsettings set --resource-group $resourceGroup --name $webappName --settings apiUrl=/api/v1 ApiUrlShoppingCart=/api/v1 productImagesUrl=https://raw.githubusercontent.com/microsoft/TailwindTraders-Backend/master/Deploy/tailwindtraders-images/product-detail SqlConnectionString="sqlConnectionString" MongoConnectionString="$cosmosConnectionString"`
