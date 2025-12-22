using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerEmail { get; set; }
        public string ShippingAddress { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        // public List<OrderItem> OrderItems { get; set; }

    }
}