

using WebApplication1.Core.Contants;

namespace WebApplication1.Core.Dtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public required string BuyerEmail { get; set; }
        public required string ShippingAddress { get; set; }
        public DateTimeOffset OrderDate { get; set; }
        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }
        public long Discount { get; set; } = 0;
        public required OrderStatus OrderStatus { get; set; }

        // navigation property
        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
    }
}