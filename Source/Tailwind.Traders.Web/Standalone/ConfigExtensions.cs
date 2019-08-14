using System.Data.SqlClient;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Tailwind.Traders.Web.Standalone.Data;

namespace Tailwind.Traders.Web.Standalone
{
    public static class ConfigExtensions
    {
        public static void AddStandalone(this IServiceCollection services, IConfiguration config, ILogger logger)
        {
            if (!IsStandaloneEnabled(config))
            {
                return;
            }

            services.AddScoped<SqlConnection>(
                _ => new SqlConnection(config["SqlConnectionString"]));
            services.AddSingleton<MongoClient>(
                new MongoClient("mongodb://localhost:27017"));

            // demo only, do not do this in real life!
            const string defaultSecurityKey = Constants.DefaultJwtSigningKey;
            var securityKey = config["SecurityKey"] ?? defaultSecurityKey;
            var key = Encoding.ASCII.GetBytes(securityKey);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            var initializer = new StandaloneDatabaseInitializer(logger, config["SqlConnectionString"]);
            initializer.Seed().Wait();
        }

        public static void UseStandalone(this IApplicationBuilder app, IConfiguration config)
        {
            if (!IsStandaloneEnabled(config))
            {
                return;
            }

            app.UseAuthentication();
        }

        public static bool IsStandaloneEnabled(this IConfiguration config)
        {
            return !string.IsNullOrEmpty(config["SqlConnectionString"]);
        }
    }
}