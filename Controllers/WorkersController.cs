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
    [Authorize(Roles = "Admin,Manager")]
    [Route("api/Workers/")]
    [ApiController]
    public class WorkersController : ControllerBase
    {

        private readonly TablesDbContext _contexttbl;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;


        public WorkersController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, TablesDbContext contexttbl)
        {
            _userManager = userManager;
            _context = context;
            _contexttbl = contexttbl;
        }

        [Route("GetWorkers")]
        [HttpGet]
        public async Task<object> GetWorkersForAdmin()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }
            var result = await _context.Users.Where(x => x.IdFirma == user.IdFirma).OrderBy(x => x.FirstName).ToListAsync();


            List<GetWorkers> data = new List<GetWorkers>();
            GetWorkers x;
            int nrRendor = 0;
            foreach (var item in result)
            {
                var userRole = await _userManager.GetRolesAsync(item);
                string roleUsr = userRole[0];
                if (roleUsr != "Admin")
                {
                    nrRendor++;
                    x = new GetWorkers()
                    {
                        nr = nrRendor,
                        age = item.Mosha,
                        birthdary = item.DataLindjes,
                        email = item.Email,
                        firstName = item.FirstName,
                        lastName = item.LastName,
                        nacionality = item.Nacionaliteti,
                        personalNumber = item.NrPersonal,
                        userName = item.UserName,
                        phoneNumber = item.PhoneNumber,
                        role = roleUsr,
                    };
                    data.Add(x);

                }


            }

            return Ok(data);
        }

        [Route("EditRoleWorker")]
        [HttpPut]
        public async Task<object> EditRoleOftWorkersFromAdmin(GetUserAndRole data)
        {
            ApplicationUser userAdmin = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (userAdmin == null)
            {
                return BadRequest();
            }
            string RemoveRole = "Manager";
            if (RemoveRole == data.role)
            {
                RemoveRole = "Worker";
            }
            ApplicationUser user = await _userManager.FindByEmailAsync(data.email);

            if(user.IdFirma == userAdmin.IdFirma)
            {
                var result = await _userManager.AddToRoleAsync(user, data.role);

                if (result.Succeeded)
                {
                    await _userManager.RemoveFromRoleAsync(user, RemoveRole);
                    return Ok();
                }
            }

            return BadRequest();

        }

        
        [Route("RegisterWorker")]
        [HttpPost]
        public async Task<object> RegisterWorkerAsync([FromBody] RegisterWorkers data, int NrPersonal, int Mosha, DateTime DataLindjes)
        {
            
                
            ApplicationUser userAdm = await _userManager.FindByNameAsync(this.User.Identity.Name);
            tblFirma firma = await _contexttbl.tblFirma.FindAsync(userAdm.IdFirma);

            if(firma.NrUseraveWorkers > 100)
            {
                return BadRequest();
            }

            if (userAdm == null)
            {
                return BadRequest();
            }                
               
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
                IdFirma = userAdm.IdFirma,
            };
            var result = await _userManager.CreateAsync(user, data.Password);

            if (result.Succeeded)
            {
                var mkro = await _userManager.AddToRoleAsync(user, data.Role);
                if (mkro.Succeeded)
                {
                    firma.NrUseraveWorkers++;
                    _contexttbl.tblFirma.Update(firma);
                    await _contexttbl.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    await _userManager.DeleteAsync(user);
                }
            }
            else
            {
                //403 for errors data
                return StatusCode(403, result.Errors);
            }
            List<IdentityError> err = new List<IdentityError>();
            err.Add(new IdentityError()
            {
                Code = "tryAgain",
                Description = "Please try again later.",
            });
            return StatusCode(403, err);

        }


        [Route("DeleteWorkers")]
        [HttpPost]
        public async Task<object> deleteWorker(string workerEmail)
        {
            ApplicationUser userMA = await _userManager.FindByNameAsync(this.User.Identity.Name);
            ApplicationUser user = await _userManager.FindByEmailAsync(workerEmail);
            if (user == null)
            {
                return BadRequest();
            }
            if (workerEmail != "" && userMA.IdFirma == user.IdFirma)
            {
               

                var res = await _userManager.DeleteAsync(user);
                if (res.Succeeded)
                {
                    tblFirma firma = await _contexttbl.tblFirma.FindAsync(userMA.IdFirma);
                    firma.NrUseraveWorkers--;
                    _contexttbl.tblFirma.Update(firma);
                    await _contexttbl.SaveChangesAsync();
                    return Ok();
                }                
            }

            return BadRequest();
        }


    }
}
