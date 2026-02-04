namespace WebApplication1.Core.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
        public long Price { get; set; }
        public int Quantity { get; set; }
        public string OrderStatus { get; set; } = "PaymentReceived";
        public long Discount { get; set; } = 0;
        // navigation property
        public int OrderId { get; set; }
        public Order Order { get; set; }

    }
}