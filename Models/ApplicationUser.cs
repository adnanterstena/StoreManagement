using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace StoreManagement.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser() : base() { }


        public long IdFirma { get; set; }

        [Required]
        [MaxLength(100)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [Required]
        [Display(Name = "Personal Number")]
        public Int64 NrPersonal { get; set; }

        [Required]
        [Range(1, 150, ErrorMessage = "Value must be between 1 to 150")]
        public int Mosha { get; set; }

        [Required]
        [MaxLength(10)]
        public string Gjinia { get; set; }

        [Required]
        public DateTime DataLindjes { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nacionaliteti { get; set; }
    }
}
