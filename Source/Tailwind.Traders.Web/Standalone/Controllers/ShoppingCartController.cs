using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Tailwind.Traders.Web.Standalone.Data;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
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
            var userId = User.Identity.Name;
            var database = mongoClient.GetDatabase(databaseName);
            var collection = database.GetCollection<ShoppingCartItemDocument>(collectionName);
            var builder = Builders<ShoppingCartItemDocument>.Filter;
            var results = await collection.FindAsync(
                builder.Eq(i => i.Email, userId));

            return Ok(await results.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody]ShoppingCartItemRequest itemRequest)
        {
            var userId = User.Identity.Name;
            var database = mongoClient.GetDatabase(databaseName);
            var collection = database.GetCollection<ShoppingCartItemDocument>(collectionName);
            var filter = Builders<ShoppingCartItemDocument>.Filter;

            var guid = Guid.NewGuid().ToString();
            await collection.InsertOneAsync(new ShoppingCartItemDocument
            {
                Id = itemRequest.DetailProduct.Id,
                Email = userId,
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

        [HttpPost("product")]
        public async Task<IActionResult> UpdateProductAsync([FromBody]ShoppingCartItemUpdateRequest updateRequest)
        {
            var userId = User.Identity.Name;
            var database = mongoClient.GetDatabase(databaseName);
            var collection = database.GetCollection<ShoppingCartItemDocument>(collectionName);
            var filter = Builders<ShoppingCartItemDocument>.Filter;
            var update = Builders<ShoppingCartItemDocument>.Update;
            
            var updatedDocument = await collection.FindOneAndUpdateAsync(
                filter.Eq(i => i.Email, userId) & filter.Eq(i => i.Guid, updateRequest.Id),
                update.Set(i => i.Qty, updateRequest.Qty)
            );

            // this is wrong but returning 201 to match existing API
            return Created("/api/v1/shoppingcart", new
            {
                Message = "Product qty updated"
            });
        }

        [HttpDelete("product")]
        public async Task<IActionResult> DeleteProductAsync([FromBody]ShoppingCartItemDeleteRequest deleteRequest)
        {
            var userId = User.Identity.Name;
            var database = mongoClient.GetDatabase(databaseName);
            var collection = database.GetCollection<ShoppingCartItemDocument>(collectionName);
            var filter = Builders<ShoppingCartItemDocument>.Filter;

            _ = await collection.DeleteOneAsync(
                filter.Eq(i => i.Email, userId) & filter.Eq(i => i.Guid, deleteRequest.Id));
            
            return Ok();
        }

        [HttpGet("relatedproducts")]
        public IActionResult GetRelatedAsync()
        {
            return Ok(new object[]{});
        }
    }
}