using System.Text.Json;
using System.Text.Json.Serialization;

namespace GrantNavigator.Services;

public class CvrService
{
    private readonly HttpClient _httpClient;

    public CvrService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "GrantNavigator-StudentProject");
    }

    public async Task<CvrResponseDto?> GetCompanyByCvrAsync(string cvr)
    {
        var url = $"https://cvrapi.dk/api?search={cvr}&country=dk";
        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            return null;

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<CvrResponseDto>(json);
    }
}

public class CvrResponseDto
{
    [JsonPropertyName("vat")]
    public int Vat { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("city")]
    public string City { get; set; } = string.Empty;

    [JsonPropertyName("industrycode")]
    public int IndustryCode { get; set; }

    [JsonPropertyName("industrydesc")]
    public string IndustryDesc { get; set; } = string.Empty;
}