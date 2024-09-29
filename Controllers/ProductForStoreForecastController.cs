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
    [ApiController]
    [Route("[controller]/")]
    public class ProductForStoreForecastController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TablesDbContext _context;

        public ProductForStoreForecastController(TablesDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IEnumerable<ProductReduxStore>> GetAsync()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return null;
            }

            var result = await _context.tblProduktet.Where(x => x.IdFirma == user.IdFirma).ToListAsync();
            ProductReduxStore x;
            List<ProductReduxStore> data = new List<ProductReduxStore>();
            foreach (var item in result)
            {
                x = new ProductReduxStore()
                {
                    Barkodi = item.Barkodi,
                    Cmimi = item.Cmimi,
                    Emertimi = item.EmriProduktit,
                    Id = item.Id,
                    Kategoria = item.IdKategoria,
                    Zbritja = item.Zbritja,
                    SasiaEShitur = item.SasiaEShitur,
                    OtherInformation1 = item.OtherInformation1,
                    OtherInformation2 = item.OtherInformation2,
                    OtherInformation3 = item.OtherInformation3,

                };
                data.Add(x);
            }

            return data;
        }

        [Route("FirmName")]
        [HttpGet]
        public async Task<object> GetFirmName()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return null;
            }

            string result = _context.tblFirma.Where(x => x.Id == user.IdFirma).SingleOrDefault().EmriFirmes;

            return Ok(result);
        }

        [Route("GetCategoriesFS")]
        [HttpGet]
        public async Task<IEnumerable<object>> GetCategoriesForStore()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return null;
            }
            var result = await _context.tblKategorite.Where(x => x.IdFirma == user.IdFirma).ToListAsync();

            
            List<CategoriesForStore> data = new List<CategoriesForStore>();
            CategoriesForStore x;
            CategoriesForStore lastItem = new CategoriesForStore();

            foreach (var item in result)
            {
                x = new CategoriesForStore()
                {
                    EmriKategorise = item.LlojiKategorise,
                    Id = item.Id,
                };
                if (x.EmriKategorise != "")
                {
                    data.Add(x);
                }
                else
                {
                    x.EmriKategorise = "Extra";
                    lastItem = x;
                }
            }
            if(lastItem.EmriKategorise != "")
            {
                data.Add(lastItem);
            }

            return data;
        }
    }
}
