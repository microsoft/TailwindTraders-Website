# Deploy the web on AKS

Please follow these steps to deploy the web in the same AKS where Backend is running instead of deploying in a App Service. This can be useful in some scenarios.

## Pre-Requisites

**You must have an AKS with all the Tailwind Traders Backend up & running**. Please follow the instructions on [Tailwind Traders Backend repo](https://github.com/Microsoft/TailwindTraders-Backend/) to deploy the backend on AKS

**You can't install the web on a AKS BEFORE installing the Backend on it**. This is because some configuration steps that are done when installing the Backend are needed.

This document assumes you have the backend installed on an AKS and the `kubectl` is configured against this cluster.

## Build and push the docker image

You need to build & push the docker image for the web. You can use `docker-compose` for this task. You **must set two environment variables** before launching compose:

* `TAG`: Tag to use for the generated docker image
* `REPOSITORY`: Must be the login server of the ACR where Backend is installed

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

To deploy the web on the AKS you can use the `Deploy-Web-Aks.ps1` script in `/Deploy` folder. This script have following parameters:

* `-aksName`: Name of the AKS (same AKS where Backend is)
* `-resourceGroup`: Resource group of the AKS
* `-acrName`: ACR where image is pushed. Has to be the same ACR where Backend images are.
* `-tag`: Tag to use for the Docker image of the Web
* `-valueSFile`: YAML files containing the values. Defaults to `gvalues.yaml`. You can use the provided `gvalues.yaml` as-is, so don't need to specify this parameter.
* `-tlsEnv`: TLS environment (staging or prod) that is installed in the cluster. Refer to the Backend repo for more information.
* `-webAuth`: Email of the logged user of the web. This is mandatory
* `-webUserId`: Id of the user logged in the web. This is mandatory

To install the web in AKS my-aks using production TLS certificates, located in resource group my-rg and using an ACR named `my-acr` you can type:

```
.\Deploy-Images-Aks.ps1 -aksName my-aks -resourceGroup my-rg -acrName my-acr -tag latest -tlsEnv prod -webAuth rimman@microsoft.com -webUserId 2
```

This also sets the logged user email as `rimman@microsoft.com` and the ID of this user as `2` (ID of the user is needed to allow view its profile and photo).

## Why ACR has to be the same where Backend images are?

During the process of Backend installation in AKS, a secret that allows AKS to access the ACR is installed. This secret is used through a Kubernetes service account. The web is installed using the same service account, so if the web were stored in another ACR, the AKS would not be able to pull the image.

