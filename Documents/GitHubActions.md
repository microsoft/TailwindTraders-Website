# Devspaces Support

TailwindTraders Website has two workflows on GitHub Actions to build and deploy the website upon these environments:
- Azure App Service
- Containerized Azure App Service

## Azure App Service
### Requirements
- A created Azure App Service
### Secrets
You must set the following secrets on your GitHub TailwindTraders Website repository:
- *WEBAPP_APPSERVICE_NAME* -> The App Service's name you want to deploy the website.
- *AZURE_CREDENTIALS* An object with the Azure credentials you want to use:
```
{
   "clientId":,
   "clientSecret":,
   "subscriptionId": ,
   "tenantId":
}
```
- *WEBAPP_APP_SETTINGS* -> It's an array containing the following information:
```json
[
  {
    "name": "ApiUrlShoppingCart",
    "value": "http://the-backend/the-cart-shopping", // set the Api Url Shopping cart you want to point
    "slotSetting": true
  },
  {
    "name": "ApiUrl",
    "value": "http://the-backend/the-cart-shopping", // set the Webbff's Api Url you want to point
    "slotSetting": true
  }
]
```

## Containerized Azure App Service
### Requirements
- A created Azure App Service, for publishing Linux containers
- A DockerHub repository you can push images
### Secrets
You must set the following secrets on your GitHub TailwindTraders Website repository:
- *CONTAINER_APPSERVICE_NAME* -> The App Service's name you want to deploy the website.
- *AZURE_CREDENTIALS* An object with the Azure credentials you want to use:
```
{
   "clientId":,
   "clientSecret":,
   "subscriptionId": ,
   "tenantId":
}
```
- *DOCKERHUB_USERNAME*
- *DOCKERHUB_PASSWORD*
- *CONTAINER_APP_SETTINGS* -> It's an array containing the following information:
```json
[
  {
    "name": "ApiUrlShoppingCart",
    "value": "http://the-backend/the-cart-shopping", // set the Api Url Shopping cart you want to point
    "slotSetting": true
  },
  {
    "name": "ApiUrl",
    "value": "http://the-backend/the-cart-shopping", // set the Webbff's Api Url you want to point
    "slotSetting": true
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_USERNAME",
    "value": "", // DockerHub username
    "slotSetting": true
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
    "value": "", // DockerHub password
    "slotSetting": true
  }
]
```
