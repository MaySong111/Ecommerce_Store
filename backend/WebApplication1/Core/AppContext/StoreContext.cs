using Microsoft.EntityFrameworkCore;
using WebApplication1.Core.Entities;

namespace WebApplication1.Core.AppContext
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

    }
}