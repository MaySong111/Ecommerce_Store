using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Core.AppContext;
using WebApplication1.Core.Dtos;
using WebApplication1.Core.Entities;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController(StoreContext _context, IMapper _mapper) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<BasketDto>> GetBasketInfo()
        {
            var basket = await GetBasket();
            if (basket == null)
            {
                // 返回空购物车，不是404
                return Ok(new BasketResponseDto
                {
                    Message = "Empty basket",
                    Basket = new BasketDto
                    {
                        BasketPublicId = "",
                        BasketItems = []
                    }
                });
            }
            var basketDto = _mapper.Map<BasketDto>(basket);
            return Ok(new BasketResponseDto
            {
                Message = "Basket retrieved successfully",
                Basket = basketDto
            });
        }


        [HttpPost]
        public async Task<ActionResult> AddItemToBasket([FromQuery] string productId, [FromQuery] int quantity = 1)
        {
            // 1.get basket
            // 注意这里已经将所有的basketitems和products include进来了, 这就是为什么在 basket.AddItem(product) 里面可以直接操作 BasketItems的原因!!!!!!
            var basket = await GetBasket();
            // 2.if basket not exist, create new one basket:create basket id cookie
            if (basket == null)
            {
                basket = await CreateBasket();
            }

            // 3.get product from db
            var product = await _context.Products.FindAsync(productId);
            // 4.if product is not exist, return error
            if (product == null)
            {
                return NotFound(new BasketResponseDto
                {
                    Message = "Product not found"
                });
            }

            // 4. get basketitems quantity (quantity in cart) 获取购物车中已有的数量
            var existingItem = basket.BasketItems.FirstOrDefault(i => i.ProductId == productId);
            var quantityInCart = existingItem?.Quantity ?? 0;

            // 5. 检查：购物车现有数量 + 本次要加的数量 是否超过库存
            if (quantityInCart + quantity > product.QuantityInStock)
            {
                return BadRequest(new BasketResponseDto
                {
                    Message = $"Cannot add {quantity} items. Only {product.QuantityInStock - quantityInCart} items left in stock.",
                });
            }

            // 6.product exists, then add this product to basket添加商品（传入 quantity）
            basket.AddItem(product, quantity);
            // 7.save changes to db
            await _context.SaveChangesAsync();
            return Ok(new BasketResponseDto
            {
                Message = "Item added to basket successfully"
            });
        }


        [HttpPatch("reduce")]
        public async Task<ActionResult> ReduceItemQuantity([FromQuery] string productId)
        {
            // 1.get basket
            var basket = await GetBasket();
            // 2. reduce item quantity
            if (basket == null) return BadRequest(new BasketResponseDto
            {
                Message = "Basket not found"
            });
            basket.ReduceItemQuantity(productId);
            // 3.save changes to db
            await _context.SaveChangesAsync();
            return Ok(new BasketResponseDto
            {
                Message = "Item quantity reduced successfully"
            });
        }


        [HttpDelete("remove")]
        public async Task<ActionResult> RemoveItemFromBasket([FromQuery] string productId)
        {
            // 1.get basket
            var basket = await GetBasket();
            // 2. remove item
            if (basket == null) return BadRequest(new BasketResponseDto
            {
                Message = "Basket not found"
            });
            basket.RemoveItem(basket.BasketItems.FirstOrDefault(i => i.ProductId == productId)?.Product!);

            // 3.save changes to db
            await _context.SaveChangesAsync();
            return Ok(new BasketResponseDto
            {
                Message = "Item removed from basket successfully"
            });
        }

        [HttpDelete("clear")]
        public async Task<ActionResult> ClearBasket()
        {
            // 1.get basket
            var basket = await GetBasket();
            // 2. clear basket
            if (basket == null) return BadRequest(new BasketResponseDto
            {
                Message = "Basket not found"
            });
            // 3.clear items
            basket.BasketItems.Clear();

            // 4. delete basket cookie
            Response.Cookies.Delete("basketPublicId");
            // 5. remove basket from db
            _context.Baskets.Remove(basket);

            // 6. save changes to db
            await _context.SaveChangesAsync();
            return Ok();
        }


        private async Task<Basket?> GetBasket()
        {
            var basket = await _context.Baskets
                .Include(b => b.BasketItems)
                .ThenInclude(item => item.Product)
                .FirstOrDefaultAsync(b => b.BasketPublicId == Request.Cookies["basketPublicId"]);
            if (basket == null) return null;
            return basket;
        }

        private async Task<Basket> CreateBasket()
        {
            var basketPublicId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(30),
                IsEssential = true,
                HttpOnly = false,
                SameSite = SameSiteMode.Lax,  // 同域用Lax
                Path = "/"

            };
            Response.Cookies.Append("basketPublicId", basketPublicId, cookieOptions);
            var basket = new Basket
            {
                BasketPublicId = basketPublicId
            };
            _context.Baskets.Add(basket);
            await _context.SaveChangesAsync();
            return basket;
        }
    }
}