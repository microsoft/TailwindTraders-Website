using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Tailwind.Traders.Web.Standalone.Data;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ShoppingCartController: Controller
    {
        private const string databaseName = "tailwind";
        private const string collectionName = "cart";
        private readonly MongoClient mongoClient;

        public ShoppingCartController(MongoClient mongoClient)
        {
            this.mongoClient = mongoClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            var database = mongoClient.GetDatabase(databaseName);
            var collection = database.GetCollection<ShoppingCartItemDocument>(collectionName);
            var builder = Builders<ShoppingCartItemDocument>.Filter;
            var results = await collection.FindAsync(
                builder.Eq(i => i.Email, "test@test.com"));

            return Ok(await results.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody]ShoppingCartItemRequest itemRequest)
        {
            var database = mongoClient.GetDatabase(databaseName);
            var collection = database.GetCollection<ShoppingCartItemDocument>(collectionName);
            var guid = Guid.NewGuid().ToString();
            await collection.InsertOneAsync(new ShoppingCartItemDocument
            {
                Id = itemRequest.DetailProduct.Id,
                Email = itemRequest.DetailProduct.Email,
                Name = itemRequest.DetailProduct.Name,
                ImageUrl = itemRequest.DetailProduct.ImageUrl,
                Price = itemRequest.DetailProduct.Price,
                Qty = itemRequest.Qty,
                Guid = guid
            });
            return Created("/api/v1/shoppingcart", new
            {
                message = "Product added on shopping cart",
                id = guid
            });
        }

        [HttpGet("relatedproducts")]
        public IActionResult GetRelatedAsync()
        {
            return Ok(new object[]{});
        }
    }
}