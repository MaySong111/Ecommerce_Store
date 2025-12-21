using Stripe;
using WebApplication1.Core.Entities;

namespace WebApplication1.Core.Service
{
    public class PaymentsService(IConfiguration configuration)
    {
        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            StripeConfiguration.ApiKey = configuration["StripeSettings:Secret key"];
            var service = new PaymentIntentService();
            var intent = new PaymentIntent();

            var subtotal = basket.BasketItems.Sum(item => item.Quantity * item.Product.Price);
            var deliveryFee = subtotal > 20000 ? 0 : 500;
            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,
                    Currency = "aud",
                    PaymentMethodTypes = ["card"],
                };
                intent = await service.CreateAsync(options);
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = subtotal + deliveryFee
                };
                await service.UpdateAsync(basket.PaymentIntentId!, options);
            }
            return intent;
        }

    }
}