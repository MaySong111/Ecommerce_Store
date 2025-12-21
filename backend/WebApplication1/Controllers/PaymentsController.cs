using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Core.AppContext;
using WebApplication1.Core.Dtos;
using WebApplication1.Core.Entities;
using WebApplication1.Core.Service;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController(PaymentsService paymentsService, StoreContext context, IMapper mapper) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await GetBasket();
            if (basket == null)
            {
                return BadRequest(new { Message = "Basket not found" });
            }

            var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);
            if (intent == null)
            {
                return BadRequest(new { Message = "Problem with your payment intent" });
            }
            basket.PaymentIntentId ??= intent.Id;
            basket.ClientSecret ??= intent.ClientSecret;

            await context.SaveChangesAsync();

            var basketDto = mapper.Map<Basket, BasketDto>(basket);
            return Ok(basketDto);
        }


        private async Task<Basket?> GetBasket()
        {
            var basket = await context.Baskets
                .Include(b => b.BasketItems)
                .ThenInclude(item => item.Product)
                .FirstOrDefaultAsync(b => b.BasketPublicId == Request.Cookies["basketPublicId"]);
            if (basket == null) return null;
            return basket;
        }
    }
}