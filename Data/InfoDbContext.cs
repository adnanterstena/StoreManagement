using Microsoft.EntityFrameworkCore;
using StoreManagement.Models;

namespace StoreManagement.Data
{
    public class InfoDbContext : DbContext
    {
        public DbSet<tblinfoPage> tblinfoPage { get; set; }
        public DbSet<tblresetPassword> tblresetPassword { get; set; }

        public InfoDbContext(DbContextOptions<InfoDbContext> options) : base(options)
        {
        }
    }
}
