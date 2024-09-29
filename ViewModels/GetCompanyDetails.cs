using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreManagement.ViewModels
{
    public class GetCompanyDetails
    {

        public string AdminEmail { get; set; }
        public string EmriFirmes { get; set; }
        public DateTime DataFillimit { get; set; }
        public DateTime DataPageses { get; set; }
        public DateTime DataMbarimit { get; set; }
        public bool RuatjaTotalitPer6Mujorin { get; set; }
        public bool RuatjaTotalitPer12Mujorin { get; set; }
    }
}
