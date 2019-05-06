FROM node:10-alpine as build-node
WORKDIR /ClientApp
COPY ClientApp/package.json .
COPY ClientApp/package-lock.json .
RUN npm install
COPY ClientApp/ . 
RUN npm run build

FROM mcr.microsoft.com/dotnet/core/sdk:2.1
ENV BuildingDocker true
ARG BUILD_CONFIGURATION=Debug
ENV ASPNETCORE_ENVIRONMENT=Development
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
EXPOSE 80

WORKDIR /src
COPY ["Tailwind.Traders.Web.csproj", "./"]
RUN dotnet restore "Tailwind.Traders.Web.csproj"
COPY . .
RUN dotnet build --no-restore -c $BUILD_CONFIGURATION
COPY --from=build-node /ClientApp/build ./ClientApp/build
RUN echo "exec dotnet run --no-build --no-launch-profile -c $BUILD_CONFIGURATION -- \"\$@\"" > /entrypoint.sh

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]