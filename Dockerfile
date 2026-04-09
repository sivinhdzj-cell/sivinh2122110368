# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy file .csproj và restore (thay tên file nếu cần)
COPY *.csproj ./
RUN dotnet restore

# Copy code và publish
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Final
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS final
WORKDIR /app

# Cài đặt gói ngôn ngữ (Fix lỗi Culture en-us)
RUN apt-get update && apt-get install -y icu-devtools libicu-dev
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=build /app/publish .

# Cấu hình Port 10000 cho Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# ĐẢM BẢO TÊN FILE DLL DƯỚI ĐÂY CHÍNH XÁC VỚI DỰ ÁN CỦA BẠN
ENTRYPOINT ["dotnet", "sivinh_2122110368.dll"]
