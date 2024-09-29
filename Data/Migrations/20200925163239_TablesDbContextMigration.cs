using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace StoreManagement.Data.Migrations
{
    public partial class TablesDbContextMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "firma",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdminEmail = table.Column<string>(nullable: true),
                    EmriFirmes = table.Column<string>(maxLength: 200, nullable: true),
                    Paguar = table.Column<bool>(nullable: false),
                    DataFillimit = table.Column<DateTime>(nullable: false),
                    DataPageses = table.Column<DateTime>(nullable: false),
                    DataMbarimit = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_firma", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "kategorite",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdFirma = table.Column<long>(nullable: false),
                    AdminEmail = table.Column<string>(nullable: true),
                    LlojiKategorise = table.Column<string>(maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_kategorite", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "porosite",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdFirma = table.Column<long>(nullable: false),
                    WorkerEmail = table.Column<string>(nullable: true),
                    AdminEmail = table.Column<string>(nullable: true),
                    TotaliSasise = table.Column<int>(nullable: false),
                    TotaliCmimit = table.Column<decimal>(nullable: false),
                    TotaliZbritjeve = table.Column<decimal>(nullable: false),
                    DataPorosise = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_porosite", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "produktet",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdFirma = table.Column<long>(nullable: false),
                    IdKategoria = table.Column<long>(nullable: false),
                    AdminEmail = table.Column<string>(nullable: true),
                    EmriProduktit = table.Column<string>(maxLength: 200, nullable: false),
                    Barkodi = table.Column<long>(nullable: false),
                    Sasia = table.Column<int>(nullable: false),
                    SasiaEShitur = table.Column<int>(nullable: false),
                    Cmimi = table.Column<decimal>(nullable: false),
                    Zbritja = table.Column<decimal>(nullable: false),
                    DataProdhimit = table.Column<DateTime>(nullable: false),
                    DataSkadimit = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_produktet", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "firma");

            migrationBuilder.DropTable(
                name: "kategorite");

            migrationBuilder.DropTable(
                name: "porosite");

            migrationBuilder.DropTable(
                name: "produktet");
        }
    }
}
