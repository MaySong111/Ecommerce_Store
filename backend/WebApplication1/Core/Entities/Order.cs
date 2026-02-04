using System.ComponentModel.DataAnnotations;
using WebApplication1.Core.Contants;

namespace WebApplication1.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public required string BuyerEmail { get; set; }
        [MaxLength(500)]
        public required string ShippingAddress { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.UtcNow;
        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }
        public long Discount { get; set; } = 0;
        public required string PaymentIntentId { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

        // navigation property
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public long getTotal()
        {
            return Subtotal + DeliveryFee - Discount;
        }

        //


    }
}