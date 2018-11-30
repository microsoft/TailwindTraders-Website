using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Tailwind.Traders.Recommendations.Models;

namespace Tailwind.Traders.Recommendations
{
    public static class RecommendationsTrigger
    {
        private const string sqlRecommendationsQuery = "SELECT Id, Name, Price, ImageName, TypeId  FROM dbo.ProductItems WHERE Id != @currentId and TypeId = @currentTypeId";
        private const string imageFormat = "https://tailwindtradersimgdev.blob.core.windows.net/product-detail/{0}";

        [FunctionName("RecommendationsTrigger")]
        public static async Task Run([CosmosDBTrigger(
            databaseName: "%CosmosCartDatabase%",
            collectionName: "%CosmosCartCollection%",
            ConnectionStringSetting = "CosmosConnectionString",
            LeaseCollectionName = "leases",
            LeaseCollectionPrefix = "%LeasePrefix%",
            CreateLeaseCollectionIfNotExists = true)]IReadOnlyList<Document> shoppingCarts,
            [CosmosDB(
                databaseName: "%CosmosRecomendationsDatabase%",
                collectionName: "%CosmosRecommendationsCollection%",
                ConnectionStringSetting = "CosmosConnectionString"                
            )] IAsyncCollector<ShoppingCartRecommendation> recommendations,
            ILogger log)
        {
            var sqlServerConnectionString = Environment.GetEnvironmentVariable("SqlServerConnectionString");
            using (SqlConnection conn = new SqlConnection(sqlServerConnectionString))
            {
                conn.Open();
                foreach(Document changeFeedItem in shoppingCarts)
                {
                    try
                    {
                        var shoppingCartUpdate = JsonConvert.DeserializeObject<ShoppingCart>(changeFeedItem.ToString());
                        var recommendation = new ShoppingCartRecommendation()
                        {
                            email = shoppingCartUpdate.detailProduct.email,
                            typeid = shoppingCartUpdate.detailProduct.typeid
                        };

                        using (SqlCommand command = new SqlCommand(sqlRecommendationsQuery, conn))
                        {
                            command.Parameters.AddWithValue("@currentId", shoppingCartUpdate.detailProduct.id);
                            command.Parameters.AddWithValue("@currentTypeId", shoppingCartUpdate.detailProduct.typeid);

                            using (SqlDataReader reader = command.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    recommendation.recommendations.Add(new ShoppingDetailProduct()
                                    {
                                        email = recommendation.email,
                                        id = (int)reader["Id"],
                                        name = (string)reader["Name"],
                                        price = (float)reader["Price"],
                                        imageUrl = string.Format(imageFormat, (string)reader["ImageName"]),
                                        typeid = (int)reader["TypeId"],
                                    });
                                }
                            }

                            await recommendations.AddAsync(recommendation);
                        }
                    }
                    catch (Exception ex)
                    {
                        log.LogCritical($"Failure to process Change Feed Item id {changeFeedItem.Id}", ex);
                    }
                }
            }
        }
    }
}
