param webAppName string = 'mywebapp'
param location string = 'centralus'
param appServicePlanTier string = 'Standard'
param appServicePlanSku string = 'S1'
param dockerRegistryHost string = 'yourregistry.azurecr.io'
param dockerRegistryServerUsername string = 'yourregistry'
param dockerRegistryServerPassword string = 'somepassword'
param dockerImage string = 'DOCKER|yourregistry.azurecr.io/imagename'


var appServicePlanName = toLower('appsvc-${webAppName}')
var webSiteName = toLower('${webAppName}')
var apiBaseUrl = 'https://backend.tailwindtraders.com'

resource appServicePlan 'Microsoft.Web/serverfarms@2020-06-01' = {
  name: appServicePlanName
  location: location
  properties: {
    reserved: true
  }
  sku: {
    tier: appServicePlanTier
    name: appServicePlanSku
  }
  kind: 'linux'
}

resource appService 'Microsoft.Web/sites@2020-06-01' = {
  name: webSiteName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      alwaysOn: true
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'ApiUrl'
          value: '${apiBaseUrl}/webbff/v1'
        }
        {
          name: 'ApiUrlShoppingCart'
          value: '${apiBaseUrl}/cart-api'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${dockerRegistryHost}'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: dockerRegistryServerUsername
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: dockerRegistryServerPassword
        }
      ]
      linuxFxVersion: dockerImage
    }
  }
}
