namespace WebApplication1.Core.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public required string BasketId { get; set; }
        public List<BasketItem> BasketItems { get; set; } = [];


        // methods
        public void AddItem(Product product, int quantity)
        {
            if (quantity <= 0) return;
            if (product.QuantityInStock < quantity) return;
            if (product == null) return;
            var existingItem = BasketItems.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                BasketItems.Add(new BasketItem
                {
                    Quantity = quantity,
                    ProductId = product.Id,
                    BasketId = this.Id,
                    Product = product
                });
            }
        }


        public void RemoveItem(Product product, int quantity)
        {
            if (quantity <= 0) return;
            var existingItem = BasketItems.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingItem == null) return;
            if (existingItem.Quantity <= quantity)
            {
                BasketItems.Remove(existingItem);
            }
            else
            {
                existingItem.Quantity -= quantity;
            }
        }
    }
}