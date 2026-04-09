# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy file dự án và restore
COPY sivinh_2122110368.csproj ./
RUN dotnet restore "./sivinh_2122110368.csproj"

# Copy toàn bộ code và xuất bản (publish)
COPY . .
RUN dotnet publish "sivinh_2122110368.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Final
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS final
WORKDIR /app

# Cài đặt gói ngôn ngữ để fix lỗi "en-us invalid culture"
RUN apt-get update && apt-get install -y icu-devtools
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

# Copy dữ liệu đã build từ Stage 1
COPY --from=build /app/publish .

# Cấu hình Port cho Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "sivinh_2122110368.dll"]
