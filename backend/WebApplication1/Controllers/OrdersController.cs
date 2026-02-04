using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Core.AppContext;
using WebApplication1.Core.Dtos;
using WebApplication1.Core.Entities;

namespace WebApplication1.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController(StoreContext _context, IMapper _mapper) : ControllerBase
    {
        // get all orders for a user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var orders = await _context.Orders.
            Include(o => o.OrderItems).
            Where(o => o.BuyerEmail == User.FindFirstValue(ClaimTypes.Email)).ToListAsync();

            var ordersDto = _mapper.Map<List<OrderDto>>(orders);
            return Ok(ordersDto);
        }

        // get order by id
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var order = await _context.Orders.
            Include(o => o.OrderItems).
            FirstOrDefaultAsync(o => o.Id == id && o.BuyerEmail == User.FindFirstValue(ClaimTypes.Email));
            if (order == null)
            {
                return NotFound();
            }
            var orderDto = _mapper.Map<OrderDto>(order);
            return Ok(orderDto);
        }


        private async Task<Basket?> GetBasket()
        {
            var basket = await _context.Baskets
                .Include(b => b.BasketItems)
                .ThenInclude(item => item.Product)
                .FirstOrDefaultAsync(b => b.BasketPublicId == Request.Cookies["basketPublicId"]);
            if (basket == null) return null;
            return basket;
        }
    }
}