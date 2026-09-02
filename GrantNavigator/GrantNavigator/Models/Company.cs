namespace GrantNavigator.Models;

public class Company
{
    public int Id { get; set; }
    public string CvrNumber { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string? IndustryCode { get; set; }
    public string? IndustryText { get; set; }
    public string? City { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}