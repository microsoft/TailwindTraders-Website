 # Run the web locally

 ## Build Docker image

The web runs as a Docker image. To build it just type `docker-compose build` from a terminal located in `./Source` folder.

 ## Run the Web

 Web uses some environment variables for its settings:

 * `Auth`: Is the fake authorization email of the logged user.
 * `UserId`: Is the fake ID of the logged user
 * `ApiUrl`: Is the URL of the API gateway
 * `ApiUrlShoppingCart`: Is the URL of the API used by the shopping cart


To **run the web locally you must edit the `.env` file and provide the requested values**. Once `.env` file is edited you can run the web by just typing `docker-compose up` (from `./Source` folder)

Entries of the `.env` file are:

* `TT_WEB_APIURL`: Value of the `ApiUrl` variable
* `TT_WEB_AUTH`: Value of the `Auth` variable
* `TT_WEB_USERID`: Value of the `UserId` variable
* `TT_WEB_APISHOPPINGCART`: Value of the `ApiUrlShoppingCart` variable

### Default values for the .env file

Currently Microsoft is providing a test Backend server. Please, note that this is a **test environment** with no up-time and data guarantee. But using it, will allow to run the web without any other dependency. To use this environment use following configuration in the `.env` file:

* `TT_WEB_APIURL`: http://81649b4bff174fb6b0d3.westus2.aksapp.io/webbff/v1
* `TT_WEB_APISHOPPINGCART`: http://81649b4bff174fb6b0d3.westus2.aksapp.io/cart-api

Read the `.env` file for valid values of `TT_WEB_AUTH` and `TT_WEB_USERID`.

## Run the web using VS

You can run the web locally using Visual Studio. Only update the `appsettings.Development.json` and adding the following block:

```json
  "ApiUrl": "URL OF API GATEWAY",
  "ApiUrlShoppingCart": "URL OF SHOPPING CART API",
  "Auth": "AUTH EMAIL",
  "UserId": "AUTH ID",
```