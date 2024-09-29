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
    [Route("api/Payment/")]
    [ApiController]
    public class PaymentManageController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TablesDbContext _context;
        public PaymentManageController(UserManager<ApplicationUser> userManager, TablesDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [Authorize(Roles = "Admin,Manager")]
        [Route("AddPayment")]
        [HttpGet]
        public async Task<object> addPaymentToFirm()
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

            DateTime theDate = result.DataMbarimit;
            DateTime after1YearInTheFuture = theDate.AddYears(1);

            result.DataMbarimit = after1YearInTheFuture;
            result.DataPageses = theDate;
            result.Paguar = true;

            _context.tblFirma.Update(result);
            await _context.SaveChangesAsync();
            return Ok();

        }
    }
}
