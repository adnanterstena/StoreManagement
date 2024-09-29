using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreManagement.Models
{
    [Table("firma")]
    public class tblFirma
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public string AdminEmail { get; set; }

        [MaxLength(200)]
        public string EmriFirmes { get; set; }
        public bool Paguar { get; set; }
        public DateTime DataFillimit { get; set; }
        public DateTime DataPageses { get; set; }
        public DateTime DataMbarimit { get; set; }
        public bool RuatjaTotalitPer6Mujorin { get; set; }
        public bool RuatjaTotalitPer12Mujorin { get; set; }
        public int NrKategorive { get; set; }
        public int NrProdukteve { get; set; }
        public int NrUseraveWorkers { get; set; }
    }
}
