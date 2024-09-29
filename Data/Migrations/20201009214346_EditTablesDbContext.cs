using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StoreManagement.Data.Migrations
{
    public partial class EditTablesDbContext : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataPorosise",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "TotaliCmimit",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "TotaliSasise",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "TotaliZbritjeve",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "WorkerEmail",
                table: "porosite");

            migrationBuilder.AddColumn<string>(
                name: "OtherInformation1",
                table: "produktet",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtherInformation2",
                table: "produktet",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtherInformation3",
                table: "produktet",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DhjetorTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "GushtTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "JanarTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "KorrikTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MajTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MarsTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "NentorTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PrillTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "QershorTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ShkurtTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ShtatorTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TetorTotali",
                table: "porosite",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "NrKategorive",
                table: "firma",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NrProdukteve",
                table: "firma",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NrUseraveWorkers",
                table: "firma",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "RuatjaTotalitPer12Mujorin",
                table: "firma",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RuatjaTotalitPer6Mujorin",
                table: "firma",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "konfigurimet",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LimitAdminsCompany = table.Column<int>(nullable: false),
                    LimitWorkersForCompany = table.Column<int>(nullable: false),
                    ProductNumber = table.Column<int>(nullable: false),
                    CategoryNumbers = table.Column<int>(nullable: false),
                    YearsForPayment = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_konfigurimet", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "konfigurimet");

            migrationBuilder.DropColumn(
                name: "OtherInformation1",
                table: "produktet");

            migrationBuilder.DropColumn(
                name: "OtherInformation2",
                table: "produktet");

            migrationBuilder.DropColumn(
                name: "OtherInformation3",
                table: "produktet");

            migrationBuilder.DropColumn(
                name: "DhjetorTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "GushtTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "JanarTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "KorrikTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "MajTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "MarsTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "NentorTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "PrillTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "QershorTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "ShkurtTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "ShtatorTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "TetorTotali",
                table: "porosite");

            migrationBuilder.DropColumn(
                name: "NrKategorive",
                table: "firma");

            migrationBuilder.DropColumn(
                name: "NrProdukteve",
                table: "firma");

            migrationBuilder.DropColumn(
                name: "NrUseraveWorkers",
                table: "firma");

            migrationBuilder.DropColumn(
                name: "RuatjaTotalitPer12Mujorin",
                table: "firma");

            migrationBuilder.DropColumn(
                name: "RuatjaTotalitPer6Mujorin",
                table: "firma");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataPorosise",
                table: "porosite",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "TotaliCmimit",
                table: "porosite",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "TotaliSasise",
                table: "porosite",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TotaliZbritjeve",
                table: "porosite",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "WorkerEmail",
                table: "porosite",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
