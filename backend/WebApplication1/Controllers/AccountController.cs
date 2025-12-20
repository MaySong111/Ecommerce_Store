using API.core.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Core.Dtos;
using WebApplication1.Core.Entities;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController(UserManager<User> userManager, JwtTokenCreator jwtTokenCreator) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDto dto)
        {
            // 1. check if user with the same email exists
            var existingUser = await userManager.FindByEmailAsync(dto.Email);
            // email 已存在则返回409 Conflict,而不是400 Bad Request(400是参数格式错误等)
            if (existingUser != null)
            {
                // return BadRequest(new { Message = "Email is already in use." });
                return Conflict(new { Message = "Email is already in use." });
            }
            // 2. create new user
            var newUser = new User
            {
                Email = dto.Email,
                UserName = dto.UserName
            };

            // 3. save user to database
            var result = await userManager.CreateAsync(newUser, dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "User registration failed.", Errors = result.Errors });
            }
            // 4. add a default user role to all new users
            await userManager.AddToRoleAsync(newUser, "MEMBER");
            return Created("", new { Message = "User registered successfully." });
        }


        [HttpPost("login")]
        public async Task<ActionResult<AccountResponseDto>> Login([FromBody] LoginDto dto)
        {
            // 1. find user by email
            var user = await userManager.FindByEmailAsync(dto.Email);
            // 邮箱不存在 = 身份验证失败并不是找不到用户(所以不是NotFound),而是Unauthorized401
            if (user == null)
            {
                return NotFound(new { Message = "User does not exist." });
            }
            // 2. check password
            var passwordValid = await userManager.CheckPasswordAsync(user, dto.Password);
            // 密码错误 = 身份验证失败401 Unauthorized
            if (!passwordValid)
            {
                return BadRequest(new { Message = "Invalid password." });
            }
            else
            {
                // 3. return user info (you might want to return a token here instead), include token in ResponseApiDto
                // 3.1 generate JWT token
                var token = await jwtTokenCreator.GenerateToken(user);
                // 3.2 get the role of user
                var userRoles = await userManager.GetRolesAsync(user);
                string userRole = userRoles.FirstOrDefault() ?? "MEMBER";

                // 3.3 create response DTO
                return Ok(new AccountResponseDto
                {
                    Message = "Login successful.",
                    Token = token,
                    UserInfo = new UserInfoDto
                    {
                        UserName = user.UserName,
                        Role = userRole
                    }
                });
            }

        }
    }
}