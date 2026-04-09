# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy và restore
COPY *.csproj ./
RUN dotnet restore

# Build dự án
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS final
WORKDIR /app

# Cài đặt thư viện xử lý ngôn ngữ để fix lỗi "en-us" culture
RUN apt-get update && apt-get install -y icu-devtools libicu-dev
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=build /app/publish .

# Cấu hình Port cho Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Đảm bảo tên file .dll trùng với tên project của bạn
ENTRYPOINT ["dotnet", "sivinh_2122110368.dll"]
