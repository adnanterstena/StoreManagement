using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreManagement.ViewModels
{
    public class GetSTData
    {
        public decimal vat { get; set; }
        public long barcodeKey { get; set; }
        public string cuponQr { get; set; }
        public string thermalVendoId { get; set; }
        public string thermalModel { get; set; }
    }
}
