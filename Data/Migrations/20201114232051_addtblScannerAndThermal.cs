using Microsoft.EntityFrameworkCore.Migrations;

namespace StoreManagement.Data.Migrations
{
    public partial class addtblScannerAndThermal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ScannerAndThermal",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScannerKey = table.Column<long>(nullable: false),
                    CuponQrCode = table.Column<long>(nullable: false),
                    Vat = table.Column<decimal>(nullable: false),
                    VendorId = table.Column<string>(maxLength: 50, nullable: true),
                    DeviceModel = table.Column<string>(maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScannerAndThermal", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ScannerAndThermal");
        }
    }
}
