# Tailwind Traders Website

![](Documents/Images/Website.png)

[![Build status](https://dev.azure.com/TailwindTraders/Website/_apis/build/status/Website-CI)](https://dev.azure.com/TailwindTraders/Website/_build/latest?definitionId=-1)

# Repositories

For this demo reference, we built several consumer and line-of-business applications and a set of backend services. You can find all repositories in the following locations:

* [Tailwind Traders](https://github.com/Microsoft/TailwindTraders)
* [Backend (AKS)](https://github.com/Microsoft/TailwindTraders-Backend)
* [Website (ASP.NET & React)](https://github.com/Microsoft/TailwindTraders-Website)
* [Desktop (WinForms & WPF -.NET Core)](https://github.com/Microsoft/TailwindTraders-Desktop)
* [Rewards (ASP.NET Framework)](https://github.com/Microsoft/TailwindTraders-Rewards)
* [Mobile (Xamarin Forms 4.0)](https://github.com/Microsoft/TailwindTraders-Mobile)

# Deploy to Azure

With the following ARM template you can automate the creation of the resources for this website.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2FTailwindTraders-Website%2Fmaster%2FDeploy%2Fdeployment.json"><img src="/Documents/Images/deploy-to-azure.png" alt="Deploy to Azure"/></a>

When you deploy this website to Azure you can define the [Backend](https://github.com/Microsoft/TailwindTraders-Backend) you want to use in case you have deploy your own backend. By defaults it is configured the public Backend environment provided by Microsoft.

> Note: you can change the InstrumentationKey of the **Application Insight** that is configured by default.

# Deploy as part of AKS (Azure Kubernetes Service)

Please follow these steps to deploy the web in the same AKS where Backend is running instead of deploying to an App Service.

## Pre-Requisites:

1. **You must have an AKS with all the Tailwind Traders Backend Up & Running**. Please follow the instructions on [Tailwind Traders Backend repo](https://github.com/Microsoft/TailwindTraders-Backend/) to deploy the backend on AKS.

1. **You can't install the web on a AKS Before installing the Backend on it**. This is because some configuration steps that are done when installing the Backend are needed.

> Note: This document assumes you have the backend installed on an AKS and the `kubectl` is configured against this cluster.

## Build and push the docker image

You need to build & push the docker image for the web. You can use `docker-compose` for this task. You **must set two environment variables** before launching compose:

* `TAG`: Tag to use for the generated docker image.
* `REPOSITORY`: Must be the login server of the ACR where Backend is installed.

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

* `-aksName`: Name of the AKS (same AKS where Backend is)
* `-resourceGroup`: Resource group of the AKS
* `-acrName`: ACR where image is pushed. Has to be the same ACR where Backend images are.
* `-tag`: Tag to use for the Docker image of the Web
* `-valueSFile`: YAML files containing the values. Defaults to `gvalues.yaml`. You can use the provided `gvalues.yaml` as-is, so don't need to specify this parameter.
* `-tlsEnv`: TLS environment (staging or prod) that is installed in the cluster. Refer to the Backend repo for more information.

To install the web in AKS my-aks using production TLS certificates, located in resource group my-rg and using an ACR named `my-acr` you can type:

```
.\DeployImagesAKS.ps1 -aksName my-aks -resourceGroup my-rg -acrName my-acr -tag latest -tlsEnv prod
```

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
