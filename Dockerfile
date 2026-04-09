FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY sivinh_2122110368.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS final
WORKDIR /app
# Fix lỗi Culture en-us
RUN apt-get update && apt-get install -y icu-devtools libicu-dev
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000
ENTRYPOINT ["dotnet", "sivinh_2122110368.dll"]
