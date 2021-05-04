using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Tailwind.Traders.Web.Standalone.Models;

namespace Tailwind.Traders.Web.Standalone.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class LoginController: Controller
    {
        private readonly IConfiguration config;

        public LoginController(IConfiguration config)
        {
            this.config = config;
        }

        [HttpPost()]
        public IActionResult Login([FromBody] TokenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password) || request.GrantType != "password")
            {
                return BadRequest("Could not verify username and password");
            }

            return Ok(new
            {
                access_token = CreateAccessToken(request.Username),
                refresh_token = ""
            });
        }

        private AccessToken CreateAccessToken(string username)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Sid, Guid.NewGuid().ToString())
            };

            // demo only, do not do this in real life!
            const string defaultSecurityKey = Constants.DefaultJwtSigningKey;
            var securityKey = config["SecurityKey"] ?? defaultSecurityKey;
            var encoding = Encoding.UTF8.GetBytes(securityKey);
            var key = new SymmetricSecurityKey(encoding);
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiresInDays = 365;

            var token = new JwtSecurityToken(
                claims: claims,
                issuer: config["Issuer"] ?? "TailWindWebsite",
                expires: DateTime.Now.AddDays(expiresInDays),
                signingCredentials: creds);

            return new AccessToken
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresIn = expiresInDays * 24 * 60 * 60,
                TokenType = "bearer"
            };
        }
    }
}