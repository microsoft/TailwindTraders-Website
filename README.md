# Tailwind Traders Website

![Tailwind Traders Website](Documents/Images/Website.png)

[![Build status](https://dev.azure.com/TailwindTraders/Website/_apis/build/status/Website-CI)](https://dev.azure.com/TailwindTraders/Website/_build?definitionId=22)

You can take a look at our live running website following this address: [https://tailwindtraders.com](https://tailwindtraders.com)

# Repositories

For this demo reference, we built several consumer and line-of-business applications and a set of backend services. You can find all repositories in the following locations:

- [Tailwind Traders](https://github.com/Microsoft/TailwindTraders)
- [Backend (AKS)](https://github.com/Microsoft/TailwindTraders-Backend)
- [Website (ASP.NET & React)](https://github.com/Microsoft/TailwindTraders-Website)
- [Desktop (WinForms & WPF -.NET Core)](https://github.com/Microsoft/TailwindTraders-Desktop)
- [Rewards (ASP.NET Framework)](https://github.com/Microsoft/TailwindTraders-Rewards)
- [Mobile (Xamarin Forms 4.0)](https://github.com/Microsoft/TailwindTraders-Mobile)

# Deploy to Azure

With the following ARM template you can automate the creation of the resources for this website.

[![Deploy to Azure](Documents/Images/deploy-to-azure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2FTailwindTraders-Website%2Fmaster%2FDeploy%2Fdeployment.json)

When you deploy this website to Azure you can define the [Backend](https://github.com/Microsoft/TailwindTraders-Backend) you want to use in case you have deploy your own backend. By defaults it is configured the public Backend environment provided by Microsoft.

> Note: you can change the InstrumentationKey of the **Application Insight** that is configured by default.

If you want to update the application to use your own [backend](https://github.com/Microsoft/TailwindTraders-Backend), set `apiBaseUrl` parameter on the ARM template provided to the url where your aks is configured.

e.g. In order to know your AKS route you could run the following command:

```bash
az aks show -n <aks-name> -g <resource-group> --query "addonProfiles.httpApplicationRouting.config.HTTPApplicationRoutingZoneName"
```

And it will return your base [TailwindTraders-Backend](https://github.com/Microsoft/TailwindTraders-Backend) url. Note that this will work only if your Backend is configured with the `addon-http-application-routing` ingress class (as it's by default).

# Setting up Azure Communication Services

Please follow these steps to setup the web to enable customer support chat and audio/video call flow.

## Pre-Requisites:
1. **You must have Azure Communication Services resource and  also the logic app setup.** Please follow the instructions on [Tailwind Traders Logic App](../TailwindTradersLogicApp) to deploy the logic app.
2. A Microsoft Teams subscription to allow teams interoperability with Azure Communication Services.

## Add config variables:
Edit the following variables in the [appsettings.json](TailwindTraders.Website/Source/Tailwind.Traders.Web/appsettings.json) file.

```
{
  connectionString: <ACS_CONNECTION_STRING>,
  acsResource: <ACS_RESOURCE_URL>,
  logicAppUrl: <LOGIC_APP_URL>,
  email: <SUPPORT_EMAIL>,
}
```
> Support email is the account which will receive a Flow bot message with the meeting details on Microsoft Teams.

# Deploy as part of AKS (Azure Kubernetes Service)

Please follow these steps to deploy the web in the same AKS where Backend is running instead of deploying to an App Service.

**Note**: Website supports [Devspaces deployment](./Documents/Devspaces.md).

## Pre-Requisites:

1. **You must have an AKS with all the Tailwind Traders Backend Up & Running**. Please follow the instructions on [Tailwind Traders Backend repo](https://github.com/Microsoft/TailwindTraders-Backend/) to deploy the backend on AKS.

1. **You can't install the web on a AKS Before installing the Backend on it**. This is because some configuration steps that are done when installing the Backend are needed.

> Note: This document assumes you have the backend installed on an AKS and the `kubectl` is configured against this cluster.

## Build and push the docker image

You need to build & push the docker image for the web. You can use `docker-compose` for this task. You **must set two environment variables** before launching compose:

- `TAG`: Tag to use for the generated docker image.
- `REGISTRY`: Must be the login server of the ACR where Backend is installed.

Then you need to login into the ACR by typing: `docker login -u <username> -p <password> <acr-login-server>` where `<username>` and `<password>` are the ACR credentials.

Once logged in ACR you can build the web:

```
docker-compose build
```

And then you can push the images in ACR:

```
docker-compose push
```

## Deploy the image on the cluster using Helm

To deploy the web on the AKS you can use the `DeployWebAKS.ps1` script in `/Deploy` folder. This script have following parameters:

- `-aksName`: Name of the AKS (same AKS where Backend is)
- `-resourceGroup`: Resource group of the AKS
- `-acrName`: ACR where image is pushed. Has to be the same ACR where Backend images are.
- `-tag`: Tag to use for the Docker image of the Web
- `-valueSFile`: YAML files containing the values. Defaults to `gvalues.yaml`. You can use the provided `gvalues.yaml` as-is, so don't need to specify this parameter.
- `-b2cValuesFile`: YAML file with the B2C configuration values. Defaults to `values.b2c.yaml`. If B2C login is needed, you must fill the values in the file in order to configure it.
- `-tlsEnv`: TLS environment (staging or prod) that is installed in the cluster. Refer to the Backend repo for more information.
- `-appInsightsName`: Application Insights' name for monitoring purposes. 
  > **Note** The DeployWebAKS.ps1 uses, only if -appInsightsName is paseed, the _application-insights_ CLI extension to find the application insights id. Install it with `az extension add --name application-insights` if you pass it.
- `-acsConnectionString`: Acs connection string.
- `-acsResource`: Acs endpoint.
- `-logicAppUrl`: Logic app trigger url.
- `-acsEmail`: Support email account which will receive a Flow bot message.

To install the web in AKS my-aks using production TLS certificates, located in resource group my-rg and using an ACR named `my-acr` you can type:

```
.\DeployWebAKS.ps1 -aksName my-aks -resourceGroup my-rg -acrName my-acr -tag latest -tlsEnv prod -acsResource <my-acs> -acsConnectionString <acs-connection-string> -acsEmail <acs-email> -logicAppUrl <logic-app-url>
```

# How to use the customer support chat and audio/video call

To use the customer support chat/call experience click on the chat bubble on the homepage and select the type of interaction.

![Homepage chat bubble](Documents/Images/Docs/homepage-chat-bubble.png)

After being redirected to the call/chat page as per your selection enter your name and then click on Done once the chat/join meeting option is enabled click to join the conversation.

![Enter name](Documents/Images/Docs/meeting-enter-name.png)

![Join meeting](Documents/Images/Docs/meeting-join.png)

At this moment you're in the lobby once the meeting organizer lets you in the chat/call is accessible.

![Meeting](Documents/Images/Docs/meeting-in-call.png)

![Meeting](Documents/Images/Docs/chat.png)


After joining in via chat/call the user is also provided with the option to switch from chat-to-call and vice-versa.

![Switch to chat](Documents/Images/Docs/call-switch.png)![Switch to call](Documents/Images/Docs/chat-switch.png)




# How to use the product search by photo

To use the product search, we need to upload a photo, the website redirects to suggested products showing 3 products or less, except if only suggest 1 product. When you have only 1 suggested product, the website redirects to detail of product.

Steps to search:

1. In home of the website, click in the "Start smart shopping" button.

![Start Smart Shopping Button](Documents/Images/Docs/Start_Smart_Shopping_Button.PNG)

2. Select a photo to upload and send it.
   - If website has more than 1 suggested products
     - Website redirect to suggested products.
   - If website has only a one suggested product.
     - Website redirects to details of product.

To use this search, you can use the images in:

- [Documents/Images/TestImages](Documents/Images/TestImages)

### Rechargable screwdriver sample

If you select the [Electric Screwdriver](Documents/Images/TestImages/electric_screwdriver.jpg) should be appears 3 suggested products similar to:

![Rechargeable Screwdriver Suggested Products](Documents/Images/Docs/rechargeable_Screwdriver_Suggested_Products.PNG)

### Multi-tool plier sample

If you select the [Multi-Tool Plier](Documents/Images/TestImages/multi-tool_plier.jpg) should be appears 3 suggested products similar to:

![Multi-Tool Plier Suggested Products](Documents/Images/Docs/multi-tool_plier_Suggested_Products.PNG)

### Hard hat sample

If you select the [Hard Hat](Documents/Images/TestImages/hard_hat.jpg) should be redirect to product detail, beacuse only have a 1 suggested product:

![Hard Hat Suggested Product Detail](Documents/Images/Docs/hard_Hat_Suggested_Product_Detail.PNG)

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.