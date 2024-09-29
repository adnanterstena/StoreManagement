using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StoreManagement.Models;
using StoreManagement.ViewModels;

namespace StoreManagement.Controllers
{
    [Authorize]
    [Route("api/Profile/")]
    [ApiController]
    public class ProfileEditController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        SignInManager<ApplicationUser> _signInManager;

        public ProfileEditController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }



        [Route("GetProfile")]
        [HttpGet]
        public async Task<object> GetWorkersForAdmin()
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }
            var userRole = await _userManager.GetRolesAsync(user);
            string roleUsr = userRole[0];

            GetWorkers data = new GetWorkers()
            {
                age = user.Mosha,
                firstName = user.FirstName,
                nacionality = user.Nacionaliteti,
                email = user.Email,
                birthdary = user.DataLindjes,
                lastName = user.LastName,
                personalNumber = user.NrPersonal,
                phoneNumber = user.PhoneNumber,
                role = roleUsr,
                userName = user.UserName,
            };

            return Ok(data);
        }

        [Route("PostProfileData")]
        [HttpPost]
        public async Task<object> postProfileData([FromBody] GetWorkers data, DateTime birthday)
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }
            user.FirstName = data.firstName;
            user.LastName = data.lastName;
            user.Mosha = data.age;
            user.DataLindjes = birthday;
            user.Nacionaliteti = data.nacionality;
            user.NrPersonal = data.personalNumber;
            user.PhoneNumber = data.phoneNumber;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok();
            }

            return BadRequest();

        }

        [Route("ChangePassword")]
        [HttpPost]
        public async Task<object> profileChangePassword(GetForChangePassword data)
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }
            var result = await _userManager.ChangePasswordAsync(user, data.password, data.newPassword);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest();
        }


        [Route("ChangeUserName")]
        [HttpPost]
        public async Task<object> changeUserName(string newUserName)
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }
            if (newUserName != "")
            {
                var result = await _userManager.FindByNameAsync(newUserName);
                if (result == null)
                {
                    var res = await _userManager.SetUserNameAsync(user, newUserName);
                    if (res.Succeeded)
                    {

                        await _signInManager.RefreshSignInAsync(user);
                        return Ok();
                    }
                }
            }

            return BadRequest();
        }
        [Route("ChangeEmail")]
        [HttpPost]
        public async Task<object> changeEmail(string newEmail)
        {
            ApplicationUser user = await _userManager.FindByNameAsync(this.User.Identity.Name);
            if (user == null)
            {                
                return BadRequest();
            }
            if (newEmail != "")
            {

                var result = await _userManager.FindByEmailAsync(newEmail);
                if(result == null)
                {
                    var res = await _userManager.SetEmailAsync(user,newEmail);
                    if (res.Succeeded)
                    {
                        return Ok();
                    }
                }
            }

            return BadRequest();
        }      
    }
}
