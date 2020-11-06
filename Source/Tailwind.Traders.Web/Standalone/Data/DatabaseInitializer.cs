using System;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using CsvHelper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Tailwind.Traders.Web.Standalone.Data
{
    public class StandaloneDatabaseInitializer
    {
        private readonly ILogger logger;
        private readonly string connectionString;

        public StandaloneDatabaseInitializer(ILogger logger, string connectionString)
        {
            this.logger = logger;
            this.connectionString = connectionString;
        }

        public async Task Seed()
        {
            if (string.IsNullOrEmpty(connectionString))
            {
                logger.LogInformation("SQL connection string empty, skipping seeding.");
                return;
            }

            logger.LogInformation("Checking if database needs seeding...");
            using var conn = new SqlConnection(connectionString);
            await conn.OpenAsync();
            if (await IsDatabaseEmpty(conn))
            {
                await CreateBrandsTable(conn);
                await SeedTable(conn, "Brands", "https://raw.githubusercontent.com/microsoft/TailwindTraders-Backend/main/Source/Services/Tailwind.Traders.Product.Api/Setup/ProductBrands.csv");
                await CreateTypesTable(conn);
                await SeedTable(conn, "Types", "https://raw.githubusercontent.com/microsoft/TailwindTraders-Backend/main/Source/Services/Tailwind.Traders.Product.Api/Setup/ProductTypes.csv");
                await CreateTagsTable(conn);
                await SeedTable(conn, "Tags", "https://raw.githubusercontent.com/microsoft/TailwindTraders-Backend/main/Source/Services/Tailwind.Traders.Product.Api/Setup/ProductTags.csv");
                await CreateFeaturesTable(conn);
                await SeedTable(conn, "Features", "https://raw.githubusercontent.com/microsoft/TailwindTraders-Backend/main/Source/Services/Tailwind.Traders.Product.Api/Setup/ProductFeatures.csv");
                await CreateProductsTable(conn);
                await SeedTable(conn, "Products", "https://raw.githubusercontent.com/microsoft/TailwindTraders-Backend/main/Source/Services/Tailwind.Traders.Product.Api/Setup/ProductItems.csv");

                logger.LogInformation("Seeding completed.");
            }
            else
            {
                logger.LogInformation("Seeding not required.");
            }
            conn.Close();
        }

        private Task CreateBrandsTable(SqlConnection conn)
        {
            logger.LogInformation("Creating Brands table...");
            var command = new SqlCommand(@"
                CREATE TABLE Brands (
                    Id INT NOT NULL PRIMARY KEY,
                    Name NVARCHAR(255)
                )", conn);
            return command.ExecuteNonQueryAsync();
        }

        private Task CreateTypesTable(SqlConnection conn)
        {
            logger.LogInformation("Creating Types table...");
            var command = new SqlCommand(@"
                CREATE TABLE Types (
                    Id INT NOT NULL PRIMARY KEY,
                    Code NVARCHAR(255),
                    Name NVARCHAR(255)
                )", conn);
            return command.ExecuteNonQueryAsync();
        }

        private Task CreateTagsTable(SqlConnection conn)
        {
            logger.LogInformation("Creating Tags table...");
            var command = new SqlCommand(@"
                CREATE TABLE Tags (
                    Id INT NOT NULL PRIMARY KEY,
                    Value NVARCHAR(255)
                )", conn);
            return command.ExecuteNonQueryAsync();
        }

        private Task CreateFeaturesTable(SqlConnection conn)
        {
            logger.LogInformation("Creating Features table...");
            var command = new SqlCommand(@"
                CREATE TABLE Features (
                    Id INT NOT NULL PRIMARY KEY,
                    Title NVARCHAR(255),
                    Description NVARCHAR(MAX),
                    ProductItemId INT
                )", conn);
            return command.ExecuteNonQueryAsync();
        }

        private Task CreateProductsTable(SqlConnection conn)
        {
            logger.LogInformation("Creating Products table...");
            var command = new SqlCommand(@"
                CREATE TABLE Products (
                    Id INT NOT NULL PRIMARY KEY,
                    Name NVARCHAR(255),
                    Price DECIMAL(9, 2),
                    ImageName NVARCHAR(255),
                    BrandId INT,
                    TypeId INT,
                    TagId INT
                )", conn);
            return command.ExecuteNonQueryAsync();
        }

        private async Task SeedTable(SqlConnection conn, string tableName, string csvUrl)
        {
            using var httpClient = new HttpClient();
            var csv = await httpClient.GetStreamAsync(csvUrl);

            using var stringReader = new StreamReader(csv);
            using var csvReader = new CsvReader(stringReader);
            csvReader.Read();
            csvReader.ReadHeader();
            var headers = csvReader.Context.HeaderRecord;

            while (csvReader.Read())
            {
                var sql = new StringBuilder();
                sql.Append($"INSERT INTO {tableName} (");
                sql.Append(string.Join(", ", headers));
                sql.Append(") VALUES (");
                sql.Append(string.Join(", ", headers.Select(h => "@" + h)));
                sql.Append(")");

                var command = new SqlCommand(sql.ToString(), conn);
                foreach (var header in headers)
                {
                    command.Parameters.AddWithValue("@" + header, csvReader.GetField(header));
                }

                await command.ExecuteNonQueryAsync();
            }
        }

        private static async Task<bool> IsDatabaseEmpty(SqlConnection conn)
        {
            var command = new SqlCommand(@"
                    select case when
                        exists((select * from information_schema.tables where table_name = 'Brands'))
                        then 1 else 0 end", conn);

            var result = (int)await command.ExecuteScalarAsync();
            return result == 0;
        }

        public static void Initialize(ILogger logger, IConfiguration configuration)
        {
            var initializer = new StandaloneDatabaseInitializer(logger, configuration["SqlConnectionString"]);
            initializer.Seed().Wait();
        }
    }
}
