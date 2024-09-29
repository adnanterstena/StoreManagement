using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreManagement.ViewModels.ViewsSuperAdm
{
    public class FirmsStatistics
    {
        public long id { get; set; }
        public string adminEmail { get; set; }
        public string emriFirmes { get; set; }
        public bool paguar { get; set; }
        public DateTime dataFillimit { get; set; }
        public DateTime dataPageses { get; set; }
        public DateTime dataMbarimit { get; set; }
        public bool ruatjaTotalitPer6Mujorin { get; set; }
        public bool ruatjaTotalitPer12Mujorin { get; set; }
        public int nrKategorive { get; set; }
        public int nrProdukteve { get; set; }
        public int nrUseraveWorkers { get; set; }
    }
}
