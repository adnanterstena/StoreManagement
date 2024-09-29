using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StoreManagement.Models
{
    [Table("resetPassword")]
    public class tblresetPassword
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public string confirmCode { get; set; }
        public string UserName { get; set; }
    }
}
