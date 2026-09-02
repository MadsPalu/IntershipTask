using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GrantNavigator.Data;
using GrantNavigator.Models;

namespace GrantNavigator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GrantController : ControllerBase
{
    private readonly AppDbContext _db;

    public GrantController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/grant/matched/37793132
    [HttpGet("matched/{cvrNumber}")]
    public async Task<IActionResult> GetMatchedGrants(string cvrNumber)
    {
        // 1. Hent virksomheden fra databasen
        var company = await _db.Companies
            .FirstOrDefaultAsync(c => c.CvrNumber == cvrNumber);

        if (company == null)
        {
            return NotFound("Virksomheden blev ikke fundet i databasen. Kør et CVR lookup først.");
        }

        // 2. Hent alle fonde, hvor fristen ikke er overskredet
        var activeGrants = await _db.Grants
            .Where(g => g.Deadline == null || g.Deadline >= DateTime.Now)
            .ToListAsync();

        var matchedGrants = new List<GrantMatchDto>();

        // 3. Beregn match for hver fond
        foreach (var grant in activeGrants)
        {
            var (isMatch, level, score) = CalculateMatch(company.IndustryCode, grant.IndustryCodes);

            if (isMatch)
            {
                matchedGrants.Add(new GrantMatchDto
                {
                    Id = grant.Id,
                    Title = grant.Title,
                    Provider = grant.Provider,
                    Description = grant.Description,
                    MaxAmount = grant.MaxAmount,
                    Deadline = grant.Deadline,
                    DirectLink = grant.DirectLink,
                    MatchLevel = level,
                    MatchScore = score
                });
            }
        }

        // 4. Sorter så de bedste og mest specifikke matches ligger øverst
        var sortedResults = matchedGrants
            .OrderByDescending(m => m.MatchScore)
            .ToList();

        return Ok(sortedResults);
    }

    private (bool IsMatch, string Level, int Score) CalculateMatch(string? companyCode, string? grantCodes)
    {
        // Hvis fonden gælder alle brancher (ALL)
        if (string.IsNullOrEmpty(grantCodes) || grantCodes.Contains("ALL", StringComparison.OrdinalIgnoreCase))
        {
            return (true, "General", 70);
        }

        if (string.IsNullOrEmpty(companyCode))
        {
            return (false, "None", 0);
        }

        var codes = grantCodes.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

        // 1. Præcist branchematch (f.eks. "620100")
        if (codes.Contains(companyCode))
        {
            return (true, "High Match", 100);
        }

        // 2. Branchegruppe-match (f.eks. de første 2 cifre "62")
        var companySector = companyCode.Length >= 2 ? companyCode.Substring(0, 2) : companyCode;
        foreach (var code in codes)
        {
            var grantSector = code.Length >= 2 ? code.Substring(0, 2) : code;
            if (companySector == grantSector)
            {
                return (true, "Medium Match", 85);
            }
        }

        return (false, "None", 0);
    }
}