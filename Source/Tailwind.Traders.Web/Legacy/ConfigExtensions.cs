using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Tailwind.Traders.Web.Legacy
{
    public static class ConfigExtensions
    {
        public static void AddLegacy(this IServiceCollection services, IConfiguration config)
        {
            services.AddScoped<SqlConnection>(_ => new SqlConnection(config["SqlConnectionString"]));
        }
    }
}