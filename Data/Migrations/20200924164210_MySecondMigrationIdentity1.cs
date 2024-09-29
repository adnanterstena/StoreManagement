using Microsoft.EntityFrameworkCore.Migrations;

namespace StoreManagement.Data.Migrations
{
    public partial class MySecondMigrationIdentity1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "NrPersonal",
                table: "AspNetUsers",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "NrPersonal",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                oldClrType: typeof(long));
        }
    }
}
