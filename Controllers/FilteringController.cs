using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreManagement.Data;
using StoreManagement.Models;

namespace StoreManagement.Controllers
{
    [Authorize]
    [Route("api/Check/")]
    [ApiController]
    public class FilteringController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TablesDbContext _context;
        private readonly ApplicationDbContext _contextUsrs;
        SignInManager<ApplicationUser> _signInManager;

        public FilteringController(UserManager<ApplicationUser> userManager, TablesDbContext context, ApplicationDbContext contextUsrs, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _context = context;
            _contextUsrs = contextUsrs; 
            _signInManager = signInManager;
        }

        [Route("SeeDeadline")]
        [HttpPut]
        public async Task companyCheckoutAsync()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);          
            tblFirma firma = await _context.tblFirma.Where(x => x.Id == user.IdFirma).SingleOrDefaultAsync();
                    
            DateTime theDate = firma.DataMbarimit;
            DateTime after5DaysInTheFuture = theDate.AddDays(5);
            if (after5DaysInTheFuture < DateTime.Now)
            {
                await filterDbAsync(firma);
                await _signInManager.SignOutAsync();
            }
           
        }

        [Authorize(Roles = "SuperAdmin")]
        [Route("filterDeadlines")]
        [HttpPut]
        public async Task<OkResult> companiesCheckoutAsync()
        {
            var companies = await _context.tblFirma.Where(x => x.DataMbarimit.AddDays(5) < DateTime.Now).ToListAsync();
            foreach (var item in companies)
            {   
                await filterDbAsync(item);
                
            }
            return Ok();
        }



        private async Task filterDbAsync(tblFirma firma)
        {
            //delete data from tblProduktet
            var products = await _context.tblProduktet.Where(x => x.IdFirma == firma.Id).ToListAsync();
            foreach (var item in products)
            {
                _context.tblProduktet.Remove(item);
            }
            await _context.SaveChangesAsync();

            //delete data from tblKategorite
            var kategorite = await _context.tblKategorite.Where(x => x.IdFirma == firma.Id).ToListAsync();
            foreach (var item in kategorite)
            {
                _context.tblKategorite.Remove(item);
            }
            await _context.SaveChangesAsync();

            //delete data from tblPorosite
            var porosite = await _context.tblPorosite.Where(x => x.IdFirma == firma.Id).SingleOrDefaultAsync();
            if (porosite != null)
            {
                _context.tblPorosite.Remove(porosite);
                await _context.SaveChangesAsync();
            }

            //delete data from tbl Users
            var UsersFromThisFirm = await _contextUsrs.Users.Where(x => x.IdFirma == firma.Id).OrderBy(x => x.FirstName).ToListAsync();
            foreach (var item in UsersFromThisFirm)
            {
                await _userManager.DeleteAsync(item);
            }

            //delete data from tblFirma
            var company = await _context.tblFirma.Where(x => x.Id == firma.Id).SingleOrDefaultAsync();
            _context.tblFirma.Remove(company);
            await _context.SaveChangesAsync();
        }
    }
}
