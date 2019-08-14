
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Tailwind.Traders.Web.Standalone.Data
{
    public class ShoppingCartItemDocument
    {
        [BsonId]
        [JsonIgnore]
        public ObjectId _id { get; set; }
        
        [BsonElement("productId")]
        public int Id { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("imageUrl")]
        public string ImageUrl { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("price")]
        public decimal Price { get; set; }

        [BsonElement("qty")]
        public int Qty { get; set; }

        [BsonElement("id")]
        [JsonProperty("_cdbid")]
        public string Guid { get; set; }
    }
}