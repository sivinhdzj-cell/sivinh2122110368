# ... các phần build bên trên giữ nguyên ...

FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS final
WORKDIR /app

# --- THÊM ĐOẠN NÀY ĐỂ FIX LỖI CULTURE ---
RUN apt-get update && apt-get install -y icu-devtools
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
# ---------------------------------------

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000
ENTRYPOINT ["dotnet", "sivinh_2122110368.dll"]
