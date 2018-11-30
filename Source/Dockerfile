FROM node:10-alpine as build-node
ENV TT_PATH="Tailwind.Traders.Web"
WORKDIR /ClientApp
COPY ${TT_PATH}/ClientApp/package.json .
COPY ${TT_PATH}/ClientApp/package-lock.json .
RUN npm install
COPY ${TT_PATH}/ClientApp/ . 
RUN npm run build

FROM microsoft/dotnet:2.2.100-preview3-sdk-stretch as build-net
ENV TT_PATH="Tailwind.Traders.Web"
ENV BuildingDocker true
WORKDIR /app
COPY ${TT_PATH}/*.csproj .
RUN dotnet restore
COPY ${TT_PATH}/ .
RUN dotnet build
RUN dotnet publish -o /ttweb

FROM microsoft/dotnet:2.1-aspnetcore-runtime as runtime
WORKDIR /web
COPY --from=build-net /ttweb .
COPY --from=build-node /ClientApp/build ./ClientApp/build
ENTRYPOINT [ "dotnet","Tailwind.Traders.Web.dll" ]
