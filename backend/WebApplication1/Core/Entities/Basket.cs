namespace WebApplication1.Core.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public required string BasketPublicId { get; set; }
        public List<BasketItem> BasketItems { get; set; } = [];
        public string? ClientSecret { get; set; }
        public string? PaymentIntentId { get; set; }


        // methods
        // +: add item      
        public void AddItem(Product product, int quantity = 1)
        {
            var existingItem = BasketItems.FirstOrDefault(item => item.ProductId == product.Id);
            // if item exists, increase quantity
            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
                // quantity in cart can not exceed product stock
                if (existingItem.Quantity > product.QuantityInStock)
                {
                    existingItem.Quantity = product.QuantityInStock;
                }

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


        // -:reduce quantity--decrease one quantity from one basketitem, basketitem still exists
        public void ReduceItemQuantity(string productId)
        {
            var existingItem = BasketItems.FirstOrDefault(item => item.ProductId == productId);
            if (existingItem != null)
            {
                existingItem.Quantity -= 1;
                // if quantity equal to 0, remove item
                if (existingItem.Quantity == 0)
                {
                    BasketItems.Remove(existingItem);
                }
            }
        }

        // X:remove item completely--clear one basketitem  from basketitems (remove one line)
        public void RemoveItem(Product product)
        {
            if (product == null) return;
            var existingItem = BasketItems.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingItem != null) BasketItems.Remove(existingItem);
        }
    }
}