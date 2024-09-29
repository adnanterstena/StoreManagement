using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreManagement.Models
{
    [Table("produktet")]
    public class tblProduktet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public long IdFirma { get; set; }
        public long IdKategoria { get; set; }
        public string AdminEmail { get; set; }

        [Required]
        [MaxLength(200)]
        public string EmriProduktit { get; set; }
        public string Barkodi { get; set; }
        public string OtherInformation1 { get; set; }
        public string OtherInformation2 { get; set; }
        public string OtherInformation3 { get; set; }
        public int Sasia { get; set; }
        public int SasiaEShitur { get; set; }

        [Range(0, 9999999999999999.99)]
        public decimal Cmimi { get; set; }

        [Range(0, 9999999999999999.99)]
        public decimal Zbritja { get; set; }
        public DateTime DataProdhimit { get; set; }
        public DateTime DataSkadimit { get; set; }
    }
}
