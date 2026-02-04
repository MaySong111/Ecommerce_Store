

namespace WebApplication1.Core.Dtos
{
    public class OrderItemDto
    {
        public string ProductId { get; set; }
        public required string ProductName { get; set; }
        public string PictureUrl { get; set; }
        public long Price { get; set; }
        public int Quantity { get; set; }
        public string OrderStatus { get; set; } = "PaymentReceived";
        public long Discount { get; set; } = 0;
    }
}