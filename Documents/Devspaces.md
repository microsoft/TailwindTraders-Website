# Devspaces Support

Tailwind Traders Website supports Azure Dev Spaces deployment. 

## Requeriments

* AKS cluster **with the Backend deployed in a Dev Space**. Please follow the [Dev Spaces Backend documentation](https://github.com/Microsoft/TailwindTraders-Backend/blob/master/Documents/Devspaces.md). The website **must be deployed in a Dev Space that has the backend deployed or in a child one**.

## Deploying the web

Just ensure that you are located in a Dev Space that has (or is child of one that has) backend installed. Then just go to `./Source` and type `azds up -d -v`. That will deploy the website in the Devspace.

The web is deployed using a configuration file stored in `/Deploy/helm/gvalues.azds.yaml`. The file contains the needed values for the default setup to work.

## Website and devspaces routing

The web expects configuration variable (named `ApiUrl`) that has the base address of the backend services (Web expect all backend services in the same base address). By default the web is connected against a backend deployed in the same devspace.

By default the base URL of all backend services is `<devspace-name>.tt.<guid>.<region>.azds.io`. If you deploy the web in a parent devspace named "dev" the base URL of the backend services will be like `dev.tt.xxxxxxxxxx.weu.azds.io` and this is the value that will be passed to the web, when the web is deployed in the same devspace.

If you deploy the web in a devspace child of the "dev", the URL of the web will be like `<child-devspace-name>.s.<parent-devspace-name>.ttweb.<guid>.<region>.azds.io` and the web in this namespace will be configured to use a backend in the base URL `<child-devspace-name>.s.<parent-devspace-name>.tt.<guid>.<region>.azds.io`. Even though the backend is not deployed in the child devspace, as the devspace is child of "dev", those URLs for the child devspace exists (child devspace inherits all URLs of their parent one). This ensures the web uses their version of Backend if installed.
