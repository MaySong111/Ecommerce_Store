namespace WebApplication1.Core.Dtos
{
    public class BasketResponseDto
    {
        public string Message { get; set; } = "";
        public BasketDto? Basket { get; set; }
    }
}