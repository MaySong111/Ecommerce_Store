namespace WebApplication1.Core.Entities
{
    public class BasketItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }


        // Fk + nav properties
        public required string ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public required int BasketId { get; set; }
        public Basket Basket { get; set; } = null!;

    }
}