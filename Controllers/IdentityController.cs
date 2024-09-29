using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StoreManagement.Data;
using StoreManagement.Models;
using StoreManagement.ViewModels;

namespace StoreManagement.Controllers
{
    [Route("api/identity/")]
    [ApiController]
    [AllowAnonymous]
    public class IdentityController : ControllerBase
    {
        private readonly TablesDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        SignInManager<ApplicationUser> _signInManager;


        public IdentityController(TablesDbContext context, SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [Route("Register")]
        [HttpPost]
        public async Task<object> RegisterAsync([FromBody] RegisterAdm data, int NrPersonal, int Mosha, DateTime DataLindjes)
        {
            if (data.UserName !="" && data.Email !="" && data.Password != "")
            {
                DateTime theDate = DateTime.Now;
                DateTime after3MonthInTheFuture = theDate.AddMonths(3);

                tblFirma firma = new tblFirma()
                {
                    AdminEmail = data.Email,
                    EmriFirmes = data.NameOfStore,
                    Paguar = false,
                    DataFillimit = DateTime.Now,
                    DataPageses = after3MonthInTheFuture,
                    DataMbarimit = after3MonthInTheFuture,
                    RuatjaTotalitPer12Mujorin = true,
                    RuatjaTotalitPer6Mujorin = false,
                };


                _context.Add(firma);
                await _context.SaveChangesAsync();

                if(firma.Id != 0)
                { 
                    ApplicationUser user = new ApplicationUser()
                    {
                        UserName = data.UserName,
                        Email = data.Email,
                        FirstName = data.FirstName,
                        LastName = data.LastName,
                        NrPersonal = NrPersonal,
                        Mosha = Mosha,
                        Gjinia = data.Gjinia,
                        DataLindjes = DataLindjes,
                        Nacionaliteti = data.Nacionaliteti,
                        IdFirma = firma.Id,
                    };
                    var result = await _userManager.CreateAsync(user, data.Password);

                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(user, "Admin");

                        tblScannerAndThermal ST = new tblScannerAndThermal()
                        {
                            IdFirma = firma.Id,
                            Vat = 0,
                            ScannerKey = 0,
                            VendorId = "04B8",
                            DeviceModel = "TM-T20",
                            CuponQrCode = RandomDigits(14),

                        };
                        _context.tblScannerAndThermal.Add(ST);
                        await _context.SaveChangesAsync();
                        return Ok();
                    }
                    else
                    {
                       _context.tblFirma.Remove(firma);
                       await _context.SaveChangesAsync();
                       return StatusCode(403, result.Errors);
                    }
                }
            }
            List<IdentityError> err = new List<IdentityError>();
            err.Add(new IdentityError()
            {
                Code = "tryAgain",
                Description = "Please enter 'User Name', 'Email' and 'Passwords' (passwords must be at least 8 characters).",
            });
            return StatusCode(403, err);
        }

        private string RandomDigits(int length)
        {
            var random = new Random();
            string s = string.Empty;
            for (int i = 0; i < length; i++)
                s = String.Concat(s, random.Next(10).ToString());
            return s;
        }


        [Route("LogIn")]
        [HttpPost]
        public async Task<object> login([FromBody] UserLogin userL)
        {            
            ApplicationUser user;

            if (userL.UserName.Contains("@"))
                user = await _userManager.FindByEmailAsync(userL.UserName);
            else
                user = await _userManager.FindByNameAsync(userL.UserName);

            if (user != null)
            {          
                var signInResult = await _signInManager.PasswordSignInAsync(user, userL.Password, true, false);
                if (signInResult.Succeeded)
                {
                    return Ok();
                }
            }
            return BadRequest();
        }

        [Route("LogOut")]
        public async Task logout()
        {
            await _signInManager.SignOutAsync();
        }

    }
}
