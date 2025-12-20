using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Core.Migrations
{
    /// <inheritdoc />
    public partial class RenameBasketProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BasketId",
                table: "Baskets",
                newName: "BasketPublicId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BasketPublicId",
                table: "Baskets",
                newName: "BasketId");
        }
    }
}
