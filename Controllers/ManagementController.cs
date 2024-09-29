using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreManagement.Data;
using StoreManagement.Models;
using StoreManagement.ViewModels;

namespace StoreManagement.Controllers
{

    [Authorize]
    [Route("api/Management/")]
    [ApiController]
    public class ManagementController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TablesDbContext _context;


        public ManagementController(UserManager<ApplicationUser> userManager, TablesDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }


        [Route("Path")]
        public string FindPath()
        {
            if (User.IsInRole("Admin") || User.IsInRole("Manager"))
                return "/Manage";
            else
                return "/Store";
        }


        #region PRODUCTS        

        [Route("AddProducts")]
        [HttpPost]
        public async Task<object> addingProducts([FromBody] addProducts data,
                                                            string Barcode,
                                                            int Sasia,
                                                            decimal Price,
                                                            decimal Zbritja,
                                                            DateTime DataProdhimit,
                                                            DateTime DataSkadimit)
        {
            if (data.ProductName == "")
            {
                return BadRequest();
            }

            if (Barcode == null)
            {
                Barcode = "000000";
            }        

            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblFirma firma = await _context.tblFirma.FindAsync(user.IdFirma);
            if (firma.NrProdukteve > 300)
            {
                return BadRequest();
            }

            tblKategorite newCategory = new tblKategorite()
            {
                IdFirma = user.IdFirma,
                AdminEmail = firma.AdminEmail,
                LlojiKategorise = data.Lloji,
            };

            tblKategorite rezOfCategory = await _context.tblKategorite.Where(x => x.LlojiKategorise == data.Lloji && x.IdFirma == user.IdFirma).SingleOrDefaultAsync();
            if (rezOfCategory == null)
            {
                firma.NrKategorive++;
                _context.tblFirma.Update(firma);
                _context.Add(newCategory);
                await _context.SaveChangesAsync();
            }
            else
            {
                newCategory = rezOfCategory;
            }

            if (newCategory.Id > 0)
            {
                tblProduktet newProduct = new tblProduktet()
                {
                    IdFirma = user.IdFirma,
                    AdminEmail = firma.AdminEmail,
                    EmriProduktit = data.ProductName,
                    Barkodi = Barcode,
                    Sasia = Sasia,
                    SasiaEShitur = 0,
                    Cmimi = Price,
                    Zbritja = Zbritja,
                    DataProdhimit = DataProdhimit,
                    DataSkadimit = DataSkadimit,
                    IdKategoria = newCategory.Id,
                    OtherInformation1 = data.OtherInformation1,
                    OtherInformation2 = data.OtherInformation2,
                    OtherInformation3 = data.OtherInformation3,
                };

                firma.NrProdukteve++;
                _context.tblFirma.Update(firma);
                _context.Add(newProduct);
                await _context.SaveChangesAsync();

                return Ok();
            }
            return BadRequest();
        }

        [Route("EditProducts")]
        [HttpPut]
        public async Task<object> editProducts([FromBody] EditProducts data,
                                                            string barkodi,
                                                            decimal cmimi,
                                                            decimal zbritja,
                                                            long id,
                                                            int sasia,
                                                            int sasiaEshitur,
                                                            DateTime dataProdhimit,
                                                            DateTime dataskadimit)
        {

            if (data.emriProduktit == "")
            {
                return BadRequest();
            }

            if (barkodi == null)
            {
                barkodi = "000000";
            }

            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblKategorite rezOfCategory = await _context.tblKategorite.Where(x => x.LlojiKategorise == data.kategoria && x.IdFirma == user.IdFirma).SingleOrDefaultAsync();

            tblProduktet thisProduct = await _context.tblProduktet.Where(x => x.Id == id && x.IdFirma == user.IdFirma).SingleOrDefaultAsync();

            if (thisProduct != null)
            {
                thisProduct.EmriProduktit = data.emriProduktit;
                thisProduct.IdKategoria = rezOfCategory.Id;
                thisProduct.OtherInformation1 = data.otherinformation1;
                thisProduct.OtherInformation2 = data.otherinformation2;
                thisProduct.OtherInformation3 = data.otherinformation3;
                thisProduct.Barkodi = barkodi;
                thisProduct.Cmimi = cmimi;
                thisProduct.Zbritja = zbritja;
                thisProduct.Id = id;
                thisProduct.Sasia = sasia;
                thisProduct.SasiaEShitur = sasiaEshitur;
                thisProduct.DataProdhimit = dataProdhimit;
                thisProduct.DataSkadimit = dataskadimit;



                _context.tblProduktet.Update(thisProduct);
                await _context.SaveChangesAsync();
                return Ok();
            }
            return BadRequest();
        }


        [Route("GetProducts")]
        [HttpGet]
        public async Task<object> getProductsAsync()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            var Data = await _context.tblProduktet.Where(x => x.IdFirma == user.IdFirma).OrderByDescending(s => s.Id).ToListAsync();


            List<GetProducts> dataToView = new List<GetProducts>();

            if (Data.Count > 0)
            {
                GetProducts newRec;
                foreach (var item in Data)
                {
                    var res = await _context.tblKategorite.Where(x => x.Id == item.IdKategoria).FirstAsync();
                    newRec = new GetProducts()
                    {
                        Id = item.Id,
                        Barkodi = item.Barkodi,
                        Cmimi = item.Cmimi,
                        DataProdhimit = item.DataProdhimit,
                        DataSkadimit = item.DataSkadimit,
                        EmriProduktit = item.EmriProduktit,
                        Kategoria = res.LlojiKategorise,
                        Sasia = item.Sasia,
                        SasiaEShitur = item.SasiaEShitur,
                        Zbritja = item.Zbritja,
                        OtherInformation1 = item.OtherInformation1,
                        OtherInformation2 = item.OtherInformation2,
                        OtherInformation3 = item.OtherInformation3,

                    };
                    dataToView.Add(newRec);
                }
            }

            return Ok(dataToView);
        }


        [Route("DeleteProdukt")]
        [HttpDelete]
        public async Task<object> DeletetblProduktetAsync(long id)
        {

            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblProduktet tblProduktet = await _context.tblProduktet.Where(x => x.Id == id && x.IdFirma == user.IdFirma).SingleOrDefaultAsync();
            if (tblProduktet == null)
            {
                return NotFound();
            }
            tblFirma firma = await _context.tblFirma.FindAsync(user.IdFirma);
            firma.NrProdukteve--;
            _context.tblFirma.Update(firma);
            _context.tblProduktet.Remove(tblProduktet);
            await _context.SaveChangesAsync();

            return Ok();
        }


        #endregion


        #region CATEGORY   

        [Route("AddCategory")]
        [HttpPost]
        public async Task<object> AddCategory([FromBody] addCategory data)
        {
            if (data.CategoryName == "")
            {
                return BadRequest();
            }

            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblFirma firma = await _context.tblFirma.FindAsync(user.IdFirma);
            if (firma.NrKategorive > 15)
            {
                return BadRequest();
            }

            tblKategorite rezOfCategory = await _context.tblKategorite.Where(x => x.LlojiKategorise == data.CategoryName && x.IdFirma == user.IdFirma).SingleOrDefaultAsync();
            if (rezOfCategory == null)
            {
                tblKategorite newCategory = new tblKategorite()
                {
                    IdFirma = user.IdFirma,
                    AdminEmail = firma.AdminEmail,
                    LlojiKategorise = data.CategoryName,
                };

                firma.NrKategorive++;
                _context.tblFirma.Update(firma);
                _context.Add(newCategory);
                await _context.SaveChangesAsync();
                return Ok();
            }
            return BadRequest();
        }


        [Route("GetCategories")]
        [HttpGet]
        public async Task<object> GetCategoriesForStore()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }
            var result = await _context.tblKategorite.Where(x => x.IdFirma == user.IdFirma).ToListAsync();


            List<CategoriesForStore> data = new List<CategoriesForStore>();
            CategoriesForStore x;
            foreach (var item in result)
            {
                x = new CategoriesForStore()
                {
                    EmriKategorise = item.LlojiKategorise,
                    Id = item.Id,
                };
                if (x.EmriKategorise != "") data.Add(x);
            }

            return Ok(data);
        }


        [Route("EditCategory")]
        [HttpPut]
        public async Task<object> AddCategory([FromBody] addCategory data, float id)
        {
            if (data.CategoryName == "")
            {
                return BadRequest();
            }

            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblKategorite thisCategory = await _context.tblKategorite.Where(x => x.Id == id && x.IdFirma == user.IdFirma).SingleOrDefaultAsync();
            if (thisCategory.LlojiKategorise == data.CategoryName) return Ok();
            if (thisCategory != null)
            {
                thisCategory.LlojiKategorise = data.CategoryName;


                _context.tblKategorite.Update(thisCategory);
                await _context.SaveChangesAsync();
                return Ok();
            }
            return BadRequest();
        }

        #endregion


        #region CompanyData

        [Authorize(Roles = "Admin,Manager")]
        [Route("GetCompanyData")]
        [HttpGet]
        public async Task<object> getCompanyInfo()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblFirma result = await _context.tblFirma.Where(x => x.Id == user.IdFirma).SingleOrDefaultAsync();

            if (result == null)
            {
                return BadRequest();
            }

            GetCompanyDetails data = new GetCompanyDetails()
            {
                AdminEmail = result.AdminEmail,
                DataFillimit = result.DataFillimit,
                DataMbarimit = result.DataMbarimit,
                DataPageses = result.DataPageses,
                EmriFirmes = result.EmriFirmes,
                RuatjaTotalitPer12Mujorin = result.RuatjaTotalitPer12Mujorin,
                RuatjaTotalitPer6Mujorin = result.RuatjaTotalitPer6Mujorin,
            };

            return Ok(data);
        }



        [Route("GetExpirationData")]
        [HttpGet]
        public async Task<object> companyDataSkadimit()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            var result = _context.tblFirma.Where(x => x.Id == user.IdFirma).SingleOrDefaultAsync().Result.DataMbarimit;

            if (result == null)
            {
                return BadRequest();
            }

            return Ok(result);
        }



        [Authorize(Roles = "Admin,Manager")]
        [Route("AddCompanyConf")]
        [HttpPost]
        public async Task<object> addCompanyConfiguration(bool for12Month, bool for6Month)
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblFirma result = await _context.tblFirma.Where(x => x.Id == user.IdFirma).SingleOrDefaultAsync();

            if (result == null)
            {
                return BadRequest();
            }

            result.RuatjaTotalitPer12Mujorin = for12Month;
            result.RuatjaTotalitPer6Mujorin = for6Month;
            _context.tblFirma.Update(result);
            await _context.SaveChangesAsync();

            return Ok();



        }

        [Authorize(Roles = "Admin,Manager")]
        [Route("EditCompanyName")]
        [HttpPost]
        public async Task<object> editCompanyName(string newCompanyName)
        {

            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblFirma result = await _context.tblFirma.Where(x => x.Id == user.IdFirma).SingleOrDefaultAsync();

            if (result == null)
            {
                return BadRequest();
            }

            result.EmriFirmes = newCompanyName;
            _context.tblFirma.Update(result);
            await _context.SaveChangesAsync();

            return Ok();

        }

        [Authorize(Roles = "Admin,Manager")]
        [Route("GetCompanyStatistics")]
        [HttpGet]
        public async Task<object> getCompanyStatistics()
        {

            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblFirma result = await _context.tblFirma.Where(x => x.Id == user.IdFirma).SingleOrDefaultAsync();

            if(result != null)
            {

                tblPorosite data = await _context.tblPorosite.Where(x => x.IdFirma == user.IdFirma).SingleOrDefaultAsync();
                if (data == null)
                {
                    return withutSavesStatistic();
                }

                if (result.RuatjaTotalitPer6Mujorin == true)
                {
                    bool edited1 = false;
                    decimal[] mnth = new decimal[12];
                    mnth[0] = data.JanarTotali;
                    mnth[1] = data.ShkurtTotali;
                    mnth[2] = data.MarsTotali;
                    mnth[3] = data.PrillTotali;
                    mnth[4] = data.MajTotali;
                    mnth[5] = data.QershorTotali;
                    mnth[6] = data.KorrikTotali;
                    mnth[7] = data.GushtTotali;
                    mnth[8] = data.ShtatorTotali;
                    mnth[9] = data.TetorTotali;
                    mnth[10] = data.NentorTotali;
                    mnth[11] = data.DhjetorTotali;

                    int nrKetijMuaji = DateTime.Now.Month;
                    int ii = 0;
                    for (int i = 0; i < mnth.Length; i++)
                    {
                        if (i < 6)
                        {
                            if (nrKetijMuaji + i >= mnth.Length)
                            {
                                if (mnth[ii] != 0) { mnth[ii] = 0; edited1 = true; }
                                ii++;
                            }
                            else
                            {
                                if (mnth[nrKetijMuaji + i] != 0) { mnth[nrKetijMuaji + i] = 0; edited1 = true; }
                            }
                        }
                        else { 
                            break;
                        }
                    }

                    if (edited1 == true)
                    {
                        data.JanarTotali = mnth[0];
                        data.ShkurtTotali = mnth[1];
                        data.MarsTotali = mnth[2];
                        data.PrillTotali = mnth[3];
                        data.MajTotali = mnth[4];
                        data.QershorTotali = mnth[5];
                        data.KorrikTotali = mnth[6];
                        data.GushtTotali = mnth[7];
                        data.ShtatorTotali = mnth[8];
                        data.TetorTotali = mnth[9];
                        data.NentorTotali = mnth[10];
                        data.DhjetorTotali = mnth[11];

                        _context.tblPorosite.Update(data);
                        await _context.SaveChangesAsync();

                    }
                }
                else if(result.RuatjaTotalitPer12Mujorin == false && result.RuatjaTotalitPer6Mujorin == false)
                {
                    bool edited = false;
                    if (data.JanarTotali != 0) { data.JanarTotali = 0; edited = true; }
                    if (data.ShkurtTotali != 0) { data.ShkurtTotali = 0; edited = true; }
                    if (data.MarsTotali != 0) { data.MarsTotali = 0; edited = true; }
                    if (data.PrillTotali != 0) { data.PrillTotali = 0; edited = true; }
                    if (data.MajTotali != 0) { data.MajTotali = 0; edited = true; }
                    if (data.QershorTotali != 0) { data.QershorTotali = 0; edited = true; }
                    if (data.KorrikTotali != 0) { data.KorrikTotali = 0; edited = true; }
                    if (data.GushtTotali != 0) { data.GushtTotali = 0; edited = true; }
                    if (data.ShtatorTotali != 0) { data.ShtatorTotali = 0; edited = true; }
                    if (data.TetorTotali != 0) { data.TetorTotali = 0; edited = true; }
                    if (data.NentorTotali != 0) { data.NentorTotali = 0; edited = true; }
                    if (data.DhjetorTotali != 0) { data.DhjetorTotali = 0; edited = true; }

                    if (edited == true)
                    {
                        _context.tblPorosite.Update(data);
                        await _context.SaveChangesAsync();
                    }

                    return withutSavesStatistic();
                }

                return withSavesStatistics(data);

            }

            return BadRequest();
        }

        private object withSavesStatistics(tblPorosite data)
        {
            List<GetCompanyStatistics> months = new List<GetCompanyStatistics>();

            GetCompanyStatistics dt;

            dt = new GetCompanyStatistics() { id = 1, month = "January" };
            if (data.JanarTotali == 0) dt.sum = "No Data";
            else dt.sum = data.JanarTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 2, month = "February" };
            if (data.ShkurtTotali == 0) dt.sum = "No Data";
            else dt.sum = data.ShkurtTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 3, month = "March" };
            if (data.MarsTotali == 0) dt.sum = "No Data";
            else dt.sum = data.MarsTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 4, month = "April" };
            if (data.PrillTotali == 0) dt.sum = "No Data";
            else dt.sum = data.PrillTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 5, month = "May" };
            if (data.MajTotali == 0) dt.sum = "No Data";
            else dt.sum = data.MajTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 6, month = "June" };
            if (data.QershorTotali == 0) dt.sum = "No Data";
            else dt.sum = data.QershorTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 7, month = "July" };
            if (data.KorrikTotali == 0) dt.sum = "No Data";
            else dt.sum = data.KorrikTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 8, month = "August" };
            if (data.GushtTotali == 0) dt.sum = "No Data";
            else dt.sum = data.GushtTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 9, month = "September" };
            if (data.ShtatorTotali == 0) dt.sum = "No Data";
            else dt.sum = data.ShtatorTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 10, month = "October" };
            if (data.TetorTotali == 0) dt.sum = "No Data";
            else dt.sum = data.TetorTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 11, month = "November" };
            if (data.NentorTotali == 0) dt.sum = "No Data";
            else dt.sum = data.NentorTotali.ToString();
            months.Add(dt);
            dt = new GetCompanyStatistics() { id = 12, month = "December" };
            if (data.DhjetorTotali == 0) dt.sum = "No Data";
            else dt.sum = data.DhjetorTotali.ToString();
            months.Add(dt);


            return Ok(months);
        }

        private object withutSavesStatistic()
        {
            List<GetCompanyStatistics> months12 = new List<GetCompanyStatistics>();
            for (int i = 1; i < 13; i++)
            {
                months12.Add(new GetCompanyStatistics { id = i, month = "Month " + i.ToString(), sum = "No Data" });
            }
            return Ok(months12);
        }



        #endregion


        #region ScannerAndThermalPrinter

        [Route("GetSTData")]
        [HttpGet]
        public async Task<object> getScannerThermalData()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblScannerAndThermal result = await _context.tblScannerAndThermal.Where(x => x.IdFirma == user.IdFirma).SingleOrDefaultAsync();

            if (result == null)
            {
                return BadRequest();
            }

            GetSTData data = new GetSTData()
            {
                barcodeKey = result.ScannerKey,
                cuponQr = result.CuponQrCode,
                thermalModel = result.DeviceModel,
                thermalVendoId = result.VendorId,
                vat = result.Vat,
            };

            return Ok(data);
        }

        [Route("GetScannerKey")]
        [HttpGet]
        public async Task<object> getScannerKey()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }
            long result = _context.tblScannerAndThermal.Where(x => x.IdFirma == user.IdFirma).SingleOrDefaultAsync().Result.ScannerKey;
            return Ok(result);
        }

        [Authorize(Roles = "Admin,Manager")]
        [Route("addScThData")]
        [HttpPost]
        public async Task<object> addScannerThermalData([FromBody] addScTh data,
                                                            long barcodeKey,
                                                            decimal vat)
        {


            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblScannerAndThermal rezOftblSC = await _context.tblScannerAndThermal.Where(x => x.IdFirma == user.IdFirma).SingleOrDefaultAsync();
            if (rezOftblSC == null)
            {
                return BadRequest();
            }
            else
            {
                rezOftblSC.ScannerKey = barcodeKey;
                rezOftblSC.Vat = vat;
                rezOftblSC.VendorId = data.thermalVendoId;
                rezOftblSC.DeviceModel = data.thermalModel;
                _context.tblScannerAndThermal.Update(rezOftblSC);
                await _context.SaveChangesAsync();
                return Ok();
            }
        }

      

        #endregion


    }
}
