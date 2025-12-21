namespace WebApplication1.Core.Dtos
{
    public class BasketDto
    {
        public required string BasketPublicId { get; set; }
        public List<BasketItemDto> BasketItems { get; set; } = [];
        public string? PaymentIntentId { get; set; }
        public string? ClientSecret { get; set; }
    }
}