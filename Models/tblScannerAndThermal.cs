using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreManagement.Models
{
    [Table("ScannerAndThermal")]
    public class tblScannerAndThermal
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public long IdFirma { get; set; }
        public long ScannerKey { get; set; }

        [MaxLength(18)]
        public string CuponQrCode { get; set; }

        [Range(0, 999.99)]
        public decimal Vat { get; set; }

        [MaxLength(50)]
        public string VendorId { get; set; }

        [MaxLength(50)]
        public string DeviceModel { get; set; }
    }
}
