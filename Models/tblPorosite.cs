using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreManagement.Models
{
    [Table("porosite")]
    public class tblPorosite
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public long IdFirma { get; set; }
        public string AdminEmail { get; set; }

        [Range(0, 9999999999999999.99)]
        public decimal JanarTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal ShkurtTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal MarsTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal PrillTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal MajTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal QershorTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal KorrikTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal GushtTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal ShtatorTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal TetorTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal NentorTotali { get; set; }
        [Range(0, 9999999999999999.99)]
        public decimal DhjetorTotali { get; set; }

    }
}
