using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreManagement.Models
{
    [Table("infoPage")]
    public class tblinfoPage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public string Titulli { get; set; }
        public string Shkrimi { get; set; }
    }
}
