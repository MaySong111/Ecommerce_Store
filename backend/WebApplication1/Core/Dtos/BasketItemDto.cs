namespace WebApplication1.Core.Dtos
{
    public class BasketItemDto
    {
        public required string ProductId { get; set; }
        public int Quantity { get; set; }
        public required string Name { get; set; }
        public long Price { get; set; }
        public required string PictureUrl { get; set; }
        public required string Brand { get; set; }
        public required string Type { get; set; }
        // every item has its own stock info
        public int RemainingStock { get; set; }
    }
}