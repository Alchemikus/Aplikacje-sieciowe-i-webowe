using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace Cars.API.Services
{
    public class EmailService(IOptions<EmailSettings> options, HttpClient httpClient) : IEmailService
    {
        private readonly EmailSettings _settings = options.Value;

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE0037:Użyj nazwy wywnioskowanego elementu członkowskiego", Justification = "<Oczekujące>")]
        public async Task SendAsync(string to, string subject, string htmlBody)
        {

            var emailPayload = new
            {
                from = new { email = _settings.FromEmail, name = _settings.FromName },
                to = new[] { new { email = to } },
                subject = subject,
                html = htmlBody
            };

            var jsonPayload = JsonSerializer.Serialize(emailPayload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, _settings.ApiUrl)
            {
                Content = content
            };

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiToken);

            var response = await httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorInfo = await response.Content.ReadAsStringAsync();
                throw new Exception($"Błąd wysyłki e-maila: {response.StatusCode}. Szczegóły: {errorInfo}");
            }
        }
    }
}