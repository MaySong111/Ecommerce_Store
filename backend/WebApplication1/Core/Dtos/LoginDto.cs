using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Core.Dtos
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
}