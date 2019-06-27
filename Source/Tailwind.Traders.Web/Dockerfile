FROM node:10-alpine as build-node
WORKDIR /ClientApp
COPY ClientApp/package.json .
COPY ClientApp/package-lock.json .
RUN npm install
COPY ClientApp/ . 
RUN npm run build

FROM microsoft/dotnet:2.2.100-preview3-sdk-stretch as build-net
ENV BuildingDocker true
ENV ASPNETCORE_ENVIRONMENT=Development
WORKDIR /app
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet build
RUN dotnet publish -o /ttweb

FROM microsoft/dotnet:2.1-aspnetcore-runtime as runtime
WORKDIR /web
COPY --from=build-net /ttweb .
COPY --from=build-node /ClientApp/build ./ClientApp/build
ENTRYPOINT [ "dotnet","Tailwind.Traders.Web.dll" ]
