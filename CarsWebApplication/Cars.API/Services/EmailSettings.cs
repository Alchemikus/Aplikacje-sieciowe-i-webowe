namespace Cars.API.Services
{
    public class EmailSettings
    {
        public string ApiUrl { get; set; } = string.Empty;
        public string ApiToken { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = string.Empty;
    }
}
