using Microsoft.EntityFrameworkCore;
using GrantNavigator.Models;

namespace GrantNavigator.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Grant> Grants => Set<Grant>();
    public DbSet<CompanyGrant> CompanyGrants => Set<CompanyGrant>();
}