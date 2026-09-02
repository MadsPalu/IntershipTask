namespace GrantNavigator.Models;

public class Grant
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? MaxAmount { get; set; }
    public string? IndustryCodes { get; set; }
    public DateTime? Deadline { get; set; }
    public string? DirectLink { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}