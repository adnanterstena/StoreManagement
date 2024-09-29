using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreManagement.ViewModels
{
    public class GetProducts
    {
        public int Page { get; set; }
        public int LastPage { get; set; }
        public int TotalProductsRecord { get; set; }
        public long Id { get; set; }
        public string EmriProduktit { get; set; }
        public string Kategoria { get; set; }
        public string Barkodi { get; set; }
        public int Sasia { get; set; }
        public int SasiaEShitur { get; set; }
        public decimal Cmimi { get; set; }
        public decimal Zbritja { get; set; }
        public DateTime DataProdhimit { get; set; }
        public DateTime DataSkadimit { get; set; }
        public string OtherInformation1 { get; set; }
        public string OtherInformation2 { get; set; }
        public string OtherInformation3 { get; set; }
    }
}
