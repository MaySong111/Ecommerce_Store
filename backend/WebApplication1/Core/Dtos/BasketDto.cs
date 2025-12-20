namespace WebApplication1.Core.Dtos
{
    public class BasketDto
    {
        public required string BasketPublicId { get; set; }
        public List<BasketItemDto> BasketItems { get; set; } = [];
    }
}