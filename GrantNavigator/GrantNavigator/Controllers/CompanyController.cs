using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GrantNavigator.Data;
using GrantNavigator.Models;
using GrantNavigator.Services;

namespace GrantNavigator.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompanyController : ControllerBase
{
    private readonly CvrService _cvrService;
    private readonly AppDbContext _db;

    public CompanyController(CvrService cvrService, AppDbContext db)
    {
        _cvrService = cvrService;
        _db = db;
    }

    [HttpPost("lookup/{cvrNumber}")]
    public async Task<IActionResult> LookupAndSaveCompany(string cvrNumber)
    {
        // 1. Tjek om virksomheden allerede findes i databasen
        var existingCompany = await _db.Companies
            .FirstOrDefaultAsync(c => c.CvrNumber == cvrNumber);

        if (existingCompany != null)
        {
            return Ok(existingCompany);
        }

        // 2. Hent data fra apicvr.dk
        var dto = await _cvrService.GetCompanyByCvrAsync(cvrNumber);
        if (dto == null)
        {
            return NotFound("Virksomheden blev ikke fundet hos CVR.");
        }

        // 3. Gem virksomheden i SQL-databasen
        var newCompany = new Company
        {
            CvrNumber = dto.Vat.ToString(),
            CompanyName = dto.Name,
            IndustryCode = dto.IndustryCode.ToString(),
            IndustryText = dto.IndustryDesc,
            City = dto.City
        };

        _db.Companies.Add(newCompany);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCompany), new { cvrNumber = newCompany.CvrNumber }, newCompany);
    }

    [HttpGet("{cvrNumber}")]
    public async Task<IActionResult> GetCompany(string cvrNumber)
    {
        var company = await _db.Companies
            .FirstOrDefaultAsync(c => c.CvrNumber == cvrNumber);

        return company != null ? Ok(company) : NotFound();
    }
}