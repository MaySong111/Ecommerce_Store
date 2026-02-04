using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using WebApplication1.Core.AppContext;
using WebApplication1.Core.Contants;
using WebApplication1.Core.Dtos;
using WebApplication1.Core.Entities;
using WebApplication1.Core.Service;

namespace WebApplication1.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController(PaymentsService paymentsService, StoreContext context, IMapper mapper, IConfiguration configuration) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {

            Console.WriteLine("Claims count: " + User.Claims.Count());
            var basket = await GetBasket();
            if (basket == null)
            {
                return BadRequest(new { Message = "Basket not found" });
            }
            // Console.WriteLine("ClaimTypes.Email Creating or updating payment intent for basket: " + User.FindFirstValue("email"));
            Console.WriteLine("ClaimTypes.Email Creating or updating payment intent for basket: " + User.FindFirstValue(ClaimTypes.Email));

            // foreach (var claim in User.Claims)
            // {
            //     Console.WriteLine($"Claim type-test User: [{claim.Type}], value: [{claim.Value}]");
            // }

            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            // 3.backend calls Stripe api to create or update payment intent
            var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket, userEmail);
            if (intent == null)
            {
                return BadRequest(new { Message = "Problem with your payment intent" });
            }
            basket.PaymentIntentId ??= intent.Id;
            basket.ClientSecret ??= intent.ClientSecret;

            await context.SaveChangesAsync();

            var basketDto = mapper.Map<BasketDto>(basket);
            return Ok(basketDto);
        }


        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> StripeWebhook()
        {
            Console.WriteLine("Received Stripe webhook");

            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var signature = Request.Headers["Stripe-Signature"];
            var webhookSecret = configuration["StripeSettings:WebhookSecret"];

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json, signature, webhookSecret);

                if (stripeEvent.Type == "payment_intent.succeeded")
                {

                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    // Console.WriteLine($"received PaymentIntent.Id: {paymentIntent.Id}");
                    Console.WriteLine("Processing payment_intent.succeeded webhook for PaymentIntent email : " + paymentIntent.ReceiptEmail);
                    var basket = await context.Baskets
                        .Include(b => b.BasketItems)
                        .ThenInclude(i => i.Product)
                        .FirstOrDefaultAsync(b => b.PaymentIntentId == paymentIntent.Id);

                    if (basket == null) return BadRequest("Basket not found");

                    var existingOrder = await context.Orders
                        .FirstOrDefaultAsync(o => o.PaymentIntentId == paymentIntent.Id);

                    if (existingOrder != null) return Ok();

                    var shippingAddress = "Address not provided";
                    if (paymentIntent.Shipping != null && paymentIntent.Shipping.Address != null)
                    {
                        shippingAddress = $"{paymentIntent.Shipping.Name}, {paymentIntent.Shipping.Address.Line1}, {paymentIntent.Shipping.Address.City}, {paymentIntent.Shipping.Address.PostalCode}, {paymentIntent.Shipping.Address.Country}";
                    }

                    var order = new Order
                    {
                        BuyerEmail = paymentIntent.ReceiptEmail,
                        ShippingAddress = shippingAddress,
                        OrderDate = DateTime.UtcNow,
                        Subtotal = basket.BasketItems.Sum(i => i.Quantity * i.Product.Price),
                        DeliveryFee = basket.BasketItems.Sum(i => i.Quantity * i.Product.Price) >= 50000 ? 0 : 500,
                        PaymentIntentId = paymentIntent.Id,
                        OrderStatus = OrderStatus.PaymentReceived,
                        OrderItems = basket.BasketItems.Select(item => new OrderItem
                        {
                            ProductId = item.ProductId,
                            ProductName = item.Product.Name,
                            PictureUrl = item.Product.PictureUrl,
                            Price = item.Product.Price,
                            Quantity = item.Quantity
                        }).ToList()
                    };
                    context.Orders.Add(order);
                    // remove basket from db
                    context.Baskets.Remove(basket);
                    //  delete basket cookie
                    Response.Cookies.Delete("basketPublicId");

                    await context.SaveChangesAsync();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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