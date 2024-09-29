using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreManagement.Models
{
    [Table("kategorite")]
    public class tblKategorite
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public long IdFirma { get; set; }
        public string AdminEmail { get; set; }

        [Required]
        [MaxLength(200)]
        public string LlojiKategorise { get; set; }
    }
}
