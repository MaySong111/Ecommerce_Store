using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Core.AppContext;
using WebApplication1.Core.Entities;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]    // https://localhost:7207/api/products
    public class ProductsController : ControllerBase
    {
        private readonly StoreContext _context;
        public ProductsController(StoreContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? search, [FromQuery] string? sortBy, [FromQuery] string? brands,
            [FromQuery] string? types,
            [FromQuery] int pageSize = 6, [FromQuery] int currentPage = 1)
        {
            // frontend send: pageSize,CurrentPage,search,sortBy,brands
            // total items = count(items matching filter or no filter)
            // total pages = ceil(total items / pageSize)

            var query = _context.Products.AsQueryable();

            //1. filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy == "price")
                {
                    query = query.OrderBy(p => p.Price);
                }
                else if (sortBy == "pricedesc")
                {
                    query = query.OrderByDescending(p => p.Price);
                }
                else
                {
                    query = query.OrderBy(p => p.Name);
                }

            }
            if (!string.IsNullOrEmpty(brands))
            {
                var brandList = brands.Split(',').ToList();
                query = query.Where(p => brandList.Contains(p.Brand));
            }
            if (!string.IsNullOrEmpty(types))
            {
                var typeList = types.Split(',').ToList();
                query = query.Where(p => typeList.Contains(p.Type));
            }


            //2. pagination
            var totalItems = await query.CountAsync();
            // Console.WriteLine($"Total items: {totalItems}");
            query = query.Skip((currentPage - 1) * pageSize).Take(pageSize);

            var products = await query.ToListAsync();
            return Ok(new { products, totalItems });
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(string id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            return Ok(product);
        }
    }
}