using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GrantNavigator.Data;
using GrantNavigator.Models;

namespace GrantNavigator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SavedGrantsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SavedGrantsController(AppDbContext db)
    {
        _db = db;
    }

    // POST: api/SavedGrants/save
    [HttpPost("save")]
    public async Task<IActionResult> SaveGrant([FromBody] SaveGrantDto dto)
    {
        var company = await _db.Companies.FirstOrDefaultAsync(c => c.CvrNumber == dto.CvrNumber);
        if (company == null)
        {
            return NotFound("Virksomheden blev ikke fundet.");
        }

        var grantExists = await _db.Grants.AnyAsync(g => g.Id == dto.GrantId);
        if (!grantExists)
        {
            return NotFound("Fonden blev ikke fundet.");
        }

        var existingRecord = await _db.CompanyGrants
            .FirstOrDefaultAsync(cg => cg.CompanyId == company.Id && cg.GrantId == dto.GrantId);

        if (existingRecord != null)
        {
            if (existingRecord.Status == "Saved")
            {
                return BadRequest("Fonden er allerede gemt.");
            }

            existingRecord.Status = "Saved";
            existingRecord.UpdatedAt = DateTime.Now;
        }
        else
        {
            var companyGrant = new CompanyGrant
            {
                CompanyId = company.Id,
                GrantId = dto.GrantId,
                Status = "Saved",
                UpdatedAt = DateTime.Now
            };

            _db.CompanyGrants.Add(companyGrant);
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Fond gemt!" });
    }

    // DELETE: api/SavedGrants/unsave/{cvrNumber}/{grantId}
    [HttpDelete("unsave/{cvrNumber}/{grantId}")]
    public async Task<IActionResult> UnsaveGrant(string cvrNumber, int grantId)
    {
        var company = await _db.Companies.FirstOrDefaultAsync(c => c.CvrNumber == cvrNumber);
        if (company == null)
        {
            return NotFound("Virksomheden blev ikke fundet.");
        }

        var record = await _db.CompanyGrants
            .FirstOrDefaultAsync(cg => cg.CompanyId == company.Id && cg.GrantId == grantId);

        if (record == null)
        {
            return NotFound("Den gemte fond blev ikke fundet.");
        }

        _db.CompanyGrants.Remove(record);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Fond fjernet fra gemte." });
    }

    // GET: api/SavedGrants/{cvrNumber}
    [HttpGet("{cvrNumber}")]
    public async Task<IActionResult> GetSavedGrants(string cvrNumber)
    {
        var company = await _db.Companies.FirstOrDefaultAsync(c => c.CvrNumber == cvrNumber);
        if (company == null)
        {
            return NotFound("Virksomheden blev ikke fundet.");
        }

        var savedGrants = await _db.CompanyGrants
            .Where(cg => cg.CompanyId == company.Id && cg.Status == "Saved")
            .Include(cg => cg.Grant)
            .OrderByDescending(cg => cg.UpdatedAt)
            .ToListAsync();

        return Ok(savedGrants);
    }
}

public class SaveGrantDto
{
    public string CvrNumber { get; set; } = string.Empty;
    public int GrantId { get; set; }
}