<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class VersionTicketFactory010000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE product_row (id INT AUTO_INCREMENT NOT NULL, product_id INT NOT NULL, cart_id INT NOT NULL, total DOUBLE PRECISION NOT NULL, quantity INT NOT NULL, INDEX IDX_641FA2C44584665A (product_id), INDEX IDX_641FA2C41AD5CDBF (cart_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_row_voucher (product_row_id INT NOT NULL, voucher_id INT NOT NULL, INDEX IDX_D730AEECE1DE2856 (product_row_id), INDEX IDX_D730AEEC28AA1B6F (voucher_id), PRIMARY KEY(product_row_id, voucher_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE product_row ADD CONSTRAINT FK_641FA2C44584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE product_row ADD CONSTRAINT FK_641FA2C41AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('ALTER TABLE product_row_voucher ADD CONSTRAINT FK_D730AEECE1DE2856 FOREIGN KEY (product_row_id) REFERENCES product_row (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product_row_voucher ADD CONSTRAINT FK_D730AEEC28AA1B6F FOREIGN KEY (voucher_id) REFERENCES voucher (id) ON DELETE CASCADE');

        $this->addSql("INSERT INTO parameter (name, type, param_key, param_value, available_value, validations, tab_name, block_name, breakpoints_value, general_parameter) VALUES ('Version de Ticket Factory', 'string', 'core_ticket_factory_version', '1.0.0', NULL, NULL, NULL, NULL, NULL, 0)");
        $this->addSql("INSERT INTO parameter (name, type, param_key, param_value, available_value, validations, tab_name, block_name, breakpoints_value, general_parameter) VALUES ('Url de la marketplace', 'string', 'core_marketplace_url', 'https://www.ticketfactory.fr', NULL, NULL, NULL, NULL, NULL, 0)");
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product_row DROP FOREIGN KEY FK_641FA2C44584665A');
        $this->addSql('ALTER TABLE product_row DROP FOREIGN KEY FK_641FA2C41AD5CDBF');
        $this->addSql('ALTER TABLE product_row_voucher DROP FOREIGN KEY FK_D730AEECE1DE2856');
        $this->addSql('ALTER TABLE product_row_voucher DROP FOREIGN KEY FK_D730AEEC28AA1B6F');
        $this->addSql('DROP TABLE product_row');
        $this->addSql('DROP TABLE product_row_voucher');

        $this->addSql("DELETE FROM parameter WHERE param_key = 'core_ticket_factory_version'");
        $this->addSql("DELETE FROM parameter WHERE param_key = 'core_marketplace_url'");
    }
}
