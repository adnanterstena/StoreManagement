using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreManagement.ViewModels
{
    public class ProductReduxStore
    {
        public long Id { get; set; }
        public string Emertimi { get; set; }
        public string Barkodi { get; set; }
        public decimal Cmimi { get; set; }
        public decimal Zbritja { get; set; }
        public long Kategoria { get; set; }
        public int SasiaEShitur { get; set; }
        public string OtherInformation1 { get; set; }
        public string OtherInformation2 { get; set; }
        public string OtherInformation3 { get; set; }
    }
}
