# Sử dụng Alpine để tiết kiệm RAM (Chỉ ~100MB thay vì 600MB)
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY . .
# Restore và Publish
RUN dotnet restore "sivinh_2122110368.csproj"
RUN dotnet publish "sivinh_2122110368.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render yêu cầu cổng 10000 hoặc biến $PORT
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "sivinh_2122110368.dll"]
