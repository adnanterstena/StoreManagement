using System;
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
    [Route("api/Sell/")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TablesDbContext _context;


        public OrdersController(UserManager<ApplicationUser> userManager, TablesDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        


        [Route("PostOrders")]
        [HttpPost]
        public async Task<object> postOrdersMethod([FromBody] GetFinalOrder [] fetchArr, decimal totali)
        {
            //te mendohet qe do te vi id-ja produktiti edhe numri items (sa jane shitur: sasiaShitur)

            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }

            tblFirma firma = await _context.tblFirma.Where(x => x.Id == user.IdFirma).SingleOrDefaultAsync();

            if (firma == null)
            {
                return BadRequest();
            }

            await UpdateProduktetAfterOrderAsync(fetchArr, user.IdFirma);
            
           

            if (firma.RuatjaTotalitPer12Mujorin == false && firma.RuatjaTotalitPer6Mujorin == false )
            {
                return Ok();
            }
            else
            {
                await RegjistriMujorAsync(totali, user.IdFirma, firma.AdminEmail);
            }
            
            return Ok();
        }

        private async Task UpdateProduktetAfterOrderAsync(GetFinalOrder[] lst, long idFirma)
        {
            tblProduktet Produkti;


            foreach (var item in lst)
            {
                if (item.id != -1)
                {
                    Produkti = new tblProduktet();
                    Produkti = await _context.tblProduktet.Where(x => x.IdFirma == idFirma && x.Id == item.id).SingleOrDefaultAsync();
                    Produkti.SasiaEShitur += item.sasiaEShitur;
                    Produkti.Sasia -= item.sasiaEShitur;
                    _context.tblProduktet.Update(Produkti);                    
                }
            }
            await _context.SaveChangesAsync();
        }


        private async Task RegjistriMujorAsync(decimal shuma, long idFirma, string adminEmail)
        {

            tblPorosite Porosia = await _context.tblPorosite.Where(x => x.IdFirma == idFirma).SingleOrDefaultAsync();
            if(Porosia == null)
            {
                Porosia = new tblPorosite()
                {
                    AdminEmail = adminEmail,
                    IdFirma = idFirma
                };
            }

            if (DateTime.Now.Month == 1)
            {
                Porosia.JanarTotali += shuma;
                if( Porosia.ShkurtTotali != 0) Porosia.ShkurtTotali = 0;
            }
            if (DateTime.Now.Month == 2)
            {
                Porosia.ShkurtTotali += shuma;
                if (Porosia.MarsTotali != 0) Porosia.MarsTotali = 0;
            }
            if (DateTime.Now.Month == 3)
            {
                Porosia.MarsTotali += shuma;
                if (Porosia.PrillTotali != 0) Porosia.PrillTotali = 0;
            }
            if (DateTime.Now.Month == 4)
            {
                Porosia.PrillTotali += shuma;
                if (Porosia.MajTotali != 0) Porosia.MajTotali = 0;
            }
            if (DateTime.Now.Month == 5)
            {
                Porosia.MajTotali += shuma;
                if (Porosia.QershorTotali != 0) Porosia.QershorTotali = 0;
            }
            if (DateTime.Now.Month == 6)
            {
                Porosia.QershorTotali += shuma;
                if (Porosia.KorrikTotali != 0) Porosia.KorrikTotali = 0;
            }
            if (DateTime.Now.Month == 7)
            {
                Porosia.KorrikTotali += shuma;
                if (Porosia.GushtTotali != 0) Porosia.GushtTotali = 0;
            }
            if (DateTime.Now.Month == 8)
            {
                Porosia.GushtTotali += shuma;
                if (Porosia.ShtatorTotali != 0) Porosia.ShtatorTotali = 0;
            }
            if (DateTime.Now.Month == 9)
            {
                Porosia.ShtatorTotali += shuma;
                if (Porosia.TetorTotali != 0) Porosia.TetorTotali = 0;
            }
            if (DateTime.Now.Month == 10)
            {
                Porosia.TetorTotali += shuma;
                if (Porosia.NentorTotali != 0) Porosia.NentorTotali = 0;
            }
            if (DateTime.Now.Month == 11)
            {
                Porosia.NentorTotali += shuma;
                if (Porosia.DhjetorTotali != 0) Porosia.DhjetorTotali = 0;
            }
            if (DateTime.Now.Month == 12)
            {
                Porosia.DhjetorTotali += shuma;
                if (Porosia.JanarTotali != 0) Porosia.JanarTotali = 0;
            }
            
            //check if shuld bee updated or added new order
            if(Porosia.Id > 0)
            {
                _context.tblPorosite.Update(Porosia);
            }
            else
            {
                _context.tblPorosite.Add(Porosia);
            }
            await _context.SaveChangesAsync();

        }

    }
}
