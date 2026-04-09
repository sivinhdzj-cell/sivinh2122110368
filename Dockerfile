# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj và restore trước để tận dụng cache
COPY ["sivinh_2122110368.csproj", "./"]
RUN dotnet restore "./sivinh_2122110368.csproj"

# Copy toàn bộ code và publish
COPY . .
RUN dotnet publish "sivinh_2122110368.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Final (Dùng bản slim để tránh lỗi thư viện hệ thống)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render yêu cầu lắng nghe cổng 10000
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "sivinh_2122110368.dll"]
