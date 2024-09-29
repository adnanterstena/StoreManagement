using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReflectionIT.Mvc.Paging;
using StoreManagement.Data;
using StoreManagement.Models;
using StoreManagement.ViewModels.ViewsSuperAdm;

namespace StoreManagement.Controllers
{
    [Authorize]
    [Route("api/superadmincontroller/")]
    [ApiController]
    public class AdnaniController : ControllerBase
    {
        private readonly InfoDbContext _contextInfo;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TablesDbContext _context;
        private readonly InfoDbContext _contextInf;

        public AdnaniController( InfoDbContext contextInfo, TablesDbContext context, UserManager<ApplicationUser> userManager, InfoDbContext contextInf)
        {
            _contextInfo = contextInfo;
            _context = context;
            _userManager = userManager;
            _contextInf = contextInf;
        }


        [Route("getSTS")]
        [HttpGet]
        public async Task<object> getA()
        {
            
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }
            if(user.Email == "adnanterstena@outlook.com")
            {
                if (this.User.IsInRole("SuperAdmin")) return Ok();
                else await _userManager.AddToRoleAsync(user, "SuperAdmin");
            }
            return BadRequest();
        }

        #region InfoPage
        [Authorize(Roles = "SuperAdmin")]
        [Route("GetInfo")]
        [HttpGet]
        public async Task<object> getInfo()
        {
            var result = await _contextInfo.tblinfoPage.ToListAsync();

            return Ok(result);
        }
        [Authorize(Roles = "SuperAdmin")]
        [Route("EditinfoPage")]
        [HttpPut]
        public async Task<object> editProducts([FromBody] EditInfoPageItem data,
                                                         long id)
        {

            tblinfoPage thisInfoItem = await _contextInfo.tblinfoPage.Where(x => x.Id == id).SingleOrDefaultAsync();

            if (thisInfoItem != null)
            {
                thisInfoItem.Titulli = data.titulli;
                thisInfoItem.Shkrimi = data.pershkrimi;


                _contextInfo.tblinfoPage.Update(thisInfoItem);
                await _contextInfo.SaveChangesAsync();
                return Ok();
            }
            return BadRequest();
        }
        [Authorize(Roles = "SuperAdmin")]
        [Route("AddInfoItem")]
        [HttpPost]
        public async Task<object> addInfoItem([FromBody] EditInfoPageItem data)
        {

            tblinfoPage newInfoItem = new tblinfoPage()
            {
                Shkrimi = data.pershkrimi,
                Titulli = data.titulli
            };

            _contextInfo.tblinfoPage.Add(newInfoItem);
            await _contextInfo.SaveChangesAsync();
            return Ok();

        }
        [Authorize(Roles = "SuperAdmin")]
        [Route("DeleteinfoItem")]
        [HttpDelete]
        public async Task<object> DeletetblProduktetAsync(long id)
        {


            tblinfoPage tblInfoItem = await _contextInfo.tblinfoPage.Where(x => x.Id == id).SingleOrDefaultAsync();
            if (tblInfoItem == null)
            {
                return NotFound();
            }

            _contextInfo.tblinfoPage.Remove(tblInfoItem);
            await _contextInfo.SaveChangesAsync();

            return Ok();
        }

        #endregion

        #region Statistics
        [Authorize(Roles = "SuperAdmin")]
        [Route("GetFirmStatistics")]
        [HttpPost]
        public async Task<object> FirmStatistics(int page = 1 )
        {
            //int NrFirmave = _context.tblFirma.AsNoTracking().OrderBy(s => s.Id).Count();

            var queryRes = _context.tblFirma.AsNoTracking().OrderBy(s => s.AdminEmail);
            var modeltblF = await PagingList.CreateAsync(queryRes,200, page);
           
            List<FirmsStatistics> data = new List<FirmsStatistics>();
            FirmsStatistics row;
            long nrRreshtit = 1;
            foreach (var item in modeltblF)
            {              
                row = new FirmsStatistics()
                {
                    id = nrRreshtit,
                    adminEmail = item.AdminEmail,
                    dataFillimit = item.DataFillimit,
                    dataMbarimit = item.DataMbarimit,
                    dataPageses = item.DataPageses,
                    emriFirmes = item.EmriFirmes,
                    nrKategorive = item.NrKategorive,
                    nrProdukteve = item.NrProdukteve,
                    nrUseraveWorkers = item.NrUseraveWorkers,
                    paguar = item.Paguar,
                    ruatjaTotalitPer12Mujorin = item.RuatjaTotalitPer12Mujorin,
                    ruatjaTotalitPer6Mujorin = item.RuatjaTotalitPer6Mujorin,
                };
                nrRreshtit++;
                data.Add(row);
            }

            return Ok(data);
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("GetStatistics")]
        [HttpGet]
        public object getStatistics()
        {
            GetNuFirmSt data = new GetNuFirmSt();
            data.nuFirms = _context.tblFirma.AsNoTracking().Count();
            data.nuFirmPayed = _context.tblFirma.AsNoTracking().Where(s => s.Paguar == true).Count();
            data.nuFirmNotPayed = _context.tblFirma.AsNoTracking().Where(s => s.Paguar == false).Count();

            return Ok(data);
        }
        [Authorize(Roles = "SuperAdmin")]
        [Route("GetStatisUPC")]
        [HttpGet]
        public object getStatisUPC()
        {
            GetStatisUPCItem data = new GetStatisUPCItem();
            data.usersNumber= _userManager.Users.Count();
            data.productNumber = _context.tblProduktet.AsNoTracking().Count();
            data.categoriesNumber = _context.tblKategorite.AsNoTracking().Count();
            data.forgotNumNumber = _contextInf.tblresetPassword.AsNoTracking().Count();
            return Ok(data);
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("resetTblForgot")]
        [HttpPut]
        public async Task<OkResult> resetForgotTblAsync()
        {
            var tblRP = await _contextInf.tblresetPassword.ToListAsync();
            foreach (var item in tblRP)
            {
                _contextInf.tblresetPassword.Remove(item);
            }
            await _contextInf.SaveChangesAsync();

            return Ok();
        }


        #endregion
    }
}
