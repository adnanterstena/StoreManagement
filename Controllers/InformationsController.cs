using System;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using StoreManagement.Models;
using System.Text;
using StoreManagement.Data;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;

namespace StoreManagement.Controllers
{
    [AllowAnonymous]
    [Route("api/")]
    [ApiController]
    public class InformationsController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly InfoDbContext _contextInfo;

        public InformationsController(IConfiguration configuration, UserManager<ApplicationUser> userManager, InfoDbContext contextInfo)
        {
            _configuration = configuration;
            _userManager = userManager;
            _contextInfo = contextInfo;
        }

        [Route("forgotPass/SendMsg")]
        [HttpPost]
        public async Task<object> sendMsgForResetPassword(string emailToRecover)
        {
            ApplicationUser user;
            user = await _userManager.FindByEmailAsync(emailToRecover);
            if(user == null)
            {
                user = await _userManager.FindByNameAsync(emailToRecover);
                if (user == null) return BadRequest();
            }

            string codeGenerated = "";

            var re = await _contextInfo.tblresetPassword.Where(a => a.UserName == user.UserName).SingleOrDefaultAsync();
            if(re == null)
            {
                codeGenerated = generateCodeConfirm();

               

             
                while (true)
                {
                    var resConfirm = await _contextInfo.tblresetPassword.Where(a => a.confirmCode == codeGenerated).SingleOrDefaultAsync();
                    if (resConfirm == null) break;
                    else codeGenerated = generateCodeConfirm();                 
                }

                tblresetPassword ressPass = new tblresetPassword()
                {
                    confirmCode = codeGenerated,
                    UserName = user.UserName

                };
                _contextInfo.tblresetPassword.Add(ressPass);
                await _contextInfo.SaveChangesAsync();

            }
            else
            {
                codeGenerated = re.confirmCode;
            }

            var emPPs = _configuration.GetValue<string>("Sendgrid456846fs-ApiKey:applicationKey");
            MailMessage mailMessage = new MailMessage("business.management.toko@hotmail.com", emailToRecover);
            mailMessage.Subject = "Toko key forgot";
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = "<center>Hello<br /><br /> We received a request to reset your password.<br /> Enter the following  confirmation code:<br /> <strong>" + codeGenerated + "</strong></center> <br/><br/><br/> If you not asked for this, just ignore this message.<br/><br/> Thank you, respectfully toko staff";
            SmtpClient smtp = new SmtpClient("smtp-mail.outlook.com", 587);
            smtp.Credentials = new System.Net.NetworkCredential()
            {
                UserName = "business.management.toko@hotmail.com",
                Password = emPPs,
            };
            smtp.EnableSsl = true;
            smtp.Send(mailMessage);

            return Ok();
        }

        [Route("forgotPass/ResetPassword")]
        [HttpPost]
        public async Task<object> resetPassword(string codeConfirm , string newPassword)
        {
            if (codeConfirm.Length != 7) return BadRequest();

            var re = await _contextInfo.tblresetPassword.Where(a => a.confirmCode == codeConfirm).SingleOrDefaultAsync();
            if (re == null) return BadRequest();


            ApplicationUser user = await _userManager.FindByNameAsync(re.UserName);
            var passwordToken = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, passwordToken, newPassword);

            if (result.Succeeded)
            {
                _contextInfo.tblresetPassword.Remove(re);
                await _contextInfo.SaveChangesAsync();
                return Ok();
            }

            return BadRequest();
        }

        private string generateCodeConfirm()
        {
            int length = 7;

            // creating a StringBuilder object()
            StringBuilder str_build = new StringBuilder();
            Random random = new Random();

            char letter;

            for (int i = 0; i < length; i++)
            {
                double flt = random.NextDouble();
                int shift = Convert.ToInt32(Math.Floor(25 * flt));
                letter = Convert.ToChar(shift + 65);
                str_build.Append(letter);
            }
            return str_build.ToString();
        }


        [Route("GetInfo")]
        [HttpGet]
        public async Task<object> getInfo()
        {
            var result = await _contextInfo.tblinfoPage.ToListAsync();

            return Ok(result);
        }

    }
}
