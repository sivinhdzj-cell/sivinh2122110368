# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY sivinh_2122110368.csproj ./
RUN dotnet restore "./sivinh_2122110368.csproj"

COPY . .
RUN dotnet publish "sivinh_2122110368.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Final
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS final
WORKDIR /app

# Cài đặt thư viện xử lý ngôn ngữ (Fix lỗi CultureNotFound)
RUN apt-get update && apt-get install -y icu-devtools libicu-dev
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "sivinh_2122110368.dll"]
