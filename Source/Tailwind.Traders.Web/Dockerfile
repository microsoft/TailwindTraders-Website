ARG sdkTag=5.0
ARG runtimeTag=5.0
ARG image=mcr.microsoft.com/dotnet/aspnet
ARG sdkImage=mcr.microsoft.com/dotnet/sdk

FROM node:10-alpine as build-node
WORKDIR /ClientApp
COPY ClientApp/package.json .
COPY ClientApp/package-lock.json .
RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*
RUN npm install
COPY ClientApp/ .
RUN npm run build

FROM ${sdkImage}:${sdkTag} as build-net
ENV BuildingDocker true
ENV ASPNETCORE_ENVIRONMENT=Development
WORKDIR /app
COPY *.csproj .
RUN dotnet restore
COPY . .
RUN dotnet build
RUN dotnet publish -o /ttweb

FROM ${image}:${runtimeTag} as runtime
WORKDIR /web
COPY --from=build-net /ttweb .
COPY --from=build-node /ClientApp/build ./ClientApp/build
ENTRYPOINT [ "dotnet","Tailwind.Traders.Web.dll" ]
