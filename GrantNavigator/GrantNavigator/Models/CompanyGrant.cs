namespace GrantNavigator.Models;

public class CompanyGrant
{
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public int GrantId { get; set; }
    public string Status { get; set; } = "Saved";
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public Company? Company { get; set; }
    public Grant? Grant { get; set; }
}