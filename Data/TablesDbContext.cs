using Microsoft.EntityFrameworkCore;
using StoreManagement.Models;

namespace StoreManagement.Data
{
    public class TablesDbContext : DbContext
    {
        public DbSet<tblFirma> tblFirma { get; set; }
        
        public DbSet<tblKategorite> tblKategorite { get; set; }
        public DbSet<tblPorosite> tblPorosite { get; set; }
        public DbSet<tblProduktet> tblProduktet { get; set; }
        public DbSet<tblScannerAndThermal> tblScannerAndThermal { get; set; }

        public TablesDbContext(DbContextOptions<TablesDbContext> options) : base(options)
        {
        }
    }
}
