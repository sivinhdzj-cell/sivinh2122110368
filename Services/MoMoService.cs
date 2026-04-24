using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace sivinh_2122110368.Services
{
    public interface IMoMoService
    {
        Task<string> CreatePaymentAsync(string orderId, string orderInfo, decimal amount);
    }

    public class MoMoService : IMoMoService
    {
        private readonly string _partnerCode = "MOMO5RGX20191128";
        private readonly string _accessKey = "M8brj9K6E22vXoDB";
        private readonly string _secretKey = "nqQiVSgDMy809JoPF6OzP5OdBUB550Y4";
        private readonly string _endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        
        // Return URL is the React Frontend page that handles the redirect after Momo payment
        private readonly string _returnUrl = "http://localhost:5173/payment/result"; 
        
        // Notify URL is normally a webhook to backend, but local PC can't receive it, we rely on returnUrl logic
        private readonly string _notifyUrl = "http://localhost:5173/api/booking/momo-ipn"; 
        
        private readonly HttpClient _httpClient;

        public MoMoService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> CreatePaymentAsync(string orderId, string orderInfo, decimal amount)
        {
            var requestId = Guid.NewGuid().ToString();
            var extraData = ""; // Có thể chứa thông tin thêm
            
            // 1. Tạo chuỗi ký tự để ký tên (Raw Signature) theo đúng thứ tự MoMo yêu cầu
            string rawSignature = $"accessKey={_accessKey}&amount={amount}&extraData={extraData}&ipnUrl={_notifyUrl}" +
                                  $"&orderId={orderId}&orderInfo={orderInfo}&partnerCode={_partnerCode}" +
                                  $"&redirectUrl={_returnUrl}&requestId={requestId}&requestType=captureWallet";

            string signature = ComputeHmacSha256(rawSignature, _secretKey);

            // 2. Tạo body cho request
            var requestBody = new
            {
                partnerCode = _partnerCode,
                requestId = requestId,
                amount = (long)amount,
                orderId = orderId,
                orderInfo = orderInfo,
                redirectUrl = _returnUrl,
                ipnUrl = _notifyUrl,
                extraData = extraData,
                requestType = "captureWallet",
                signature = signature,
                lang = "vi"
            };

            // 3. Gửi POST request đến MoMo
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(_endpoint, content);
            var responseContent = await response.Content.ReadAsStringAsync();
            
            var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
            if (result.TryGetProperty("payUrl", out var payUrl))
            {
                return payUrl.GetString() ?? "";
            }

            throw new Exception($"MoMo Error: {responseContent}");
        }

        private string ComputeHmacSha256(string message, string secretKey)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var messageBytes = Encoding.UTF8.GetBytes(message);

            byte[] hashBytes;

            using (var hmac = new HMACSHA256(keyBytes))
            {
                hashBytes = hmac.ComputeHash(messageBytes);
            }

            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
