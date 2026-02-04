using Stripe;
using WebApplication1.Core.Entities;

namespace WebApplication1.Core.Service
{
    public class PaymentsService(IConfiguration configuration)
    {
        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket, string userEmail)
        {
            StripeConfiguration.ApiKey = configuration["StripeSettings:Secretkey"];
            var service = new PaymentIntentService();

            var subtotal = basket.BasketItems.Sum(item => item.Quantity * item.Product.Price);
            var deliveryFee = subtotal >= 50000 ? 0 : 500;
            // var intent = new PaymentIntent();
            PaymentIntent intent;

            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,
                    Currency = "aud",
                    PaymentMethodTypes = ["card"],
                    ReceiptEmail = userEmail
                };
                // invoke Stripe api (third party) to create a new (payment intent) object-发送请求到 Stripe
                intent = await service.CreateAsync(options);
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = subtotal + deliveryFee,
                    ReceiptEmail = userEmail // 必须加上，确保更新时邮箱依然存在
                };
                intent = await service.UpdateAsync(basket.PaymentIntentId!, options);
            }

            // return the payment intent object(Stripe 返回 PaymentIntent 对象)
            return intent;
        }

    }
}


// Stripe 返回什么是什么? paymentIntent 对象
// intent = {
//     Id: "pi_123abc",                     // 👈 PaymentIntentId（后端追踪用）
//     ClientSecret: "pi_123abc_secret_xyz", // 👈 ClientSecret（前端用）
//     Amount: 9500,
//     Currency: "aud",
//     Status: "requires_payment_method"     // 👈 状态：等待用户输入信用卡
// }