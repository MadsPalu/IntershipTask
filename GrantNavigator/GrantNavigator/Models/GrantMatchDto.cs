namespace GrantNavigator.Models;

public class GrantMatchDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal? MaxAmount { get; set; }
    public DateTime? Deadline { get; set; }
    public string? DirectLink { get; set; }
    public string MatchLevel { get; set; } = "General"; // "High Match", "Medium Match", "General"
    public int MatchScore { get; set; }                // e.g., 100, 85, 70
}