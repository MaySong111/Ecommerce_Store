using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Core.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string Email { get; set; }
        [EmailAddress]
        public string Password { get; set; }
    }
}