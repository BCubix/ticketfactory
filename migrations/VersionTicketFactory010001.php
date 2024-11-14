<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241113102139 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE delivery_mode (id INT AUTO_INCREMENT NOT NULL, module_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, name VARCHAR(255) NOT NULL, manager VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, INDEX IDX_46568F31AFC2B591 (module_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_stock_movement (id INT AUTO_INCREMENT NOT NULL, product_id INT NOT NULL, order_id INT DEFAULT NULL, quantity INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_E872BF994584665A (product_id), INDEX IDX_E872BF998D9F6D38 (order_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE profile ADD created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD active TINYINT(1) NOT NULL');
        $this->addSql('CREATE TABLE profile_user (profile_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_3B5B59DDCCFA12B8 (profile_id), INDEX IDX_3B5B59DDA76ED395 (user_id), PRIMARY KEY(profile_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile_role (profile_id INT NOT NULL, role_id INT NOT NULL, INDEX IDX_E1A105FECCFA12B8 (profile_id), INDEX IDX_E1A105FED60322AC (role_id), PRIMARY KEY(profile_id, role_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE role (id INT AUTO_INCREMENT NOT NULL, module_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, label VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, group_name VARCHAR(255) NOT NULL, INDEX IDX_57698A6AAFC2B591 (module_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE delivery_mode ADD CONSTRAINT FK_46568F31AFC2B591 FOREIGN KEY (module_id) REFERENCES module (id)');
        $this->addSql('ALTER TABLE product_stock_movement ADD CONSTRAINT FK_E872BF994584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE product_stock_movement ADD CONSTRAINT FK_E872BF998D9F6D38 FOREIGN KEY (order_id) REFERENCES `order` (id)');
        $this->addSql('ALTER TABLE profile_user ADD CONSTRAINT FK_3B5B59DDCCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_user ADD CONSTRAINT FK_3B5B59DDA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_role ADD CONSTRAINT FK_E1A105FECCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_role ADD CONSTRAINT FK_E1A105FED60322AC FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE role ADD CONSTRAINT FK_57698A6AAFC2B591 FOREIGN KEY (module_id) REFERENCES module (id)');
        $this->addSql('ALTER TABLE event_link DROP FOREIGN KEY FK_2967D55A712EFB49');
        $this->addSql('ALTER TABLE event_link DROP FOREIGN KEY FK_2967D55AFD9970A4');
        $this->addSql('DROP TABLE event_link');
        $this->addSql('ALTER TABLE address ADD cart_id INT DEFAULT NULL, ADD first_name VARCHAR(255) NOT NULL, ADD last_name VARCHAR(255) NOT NULL, ADD phone VARCHAR(255) NOT NULL, CHANGE customer_id customer_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F811AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D4E6F811AD5CDBF ON address (cart_id)');
        $this->addSql('ALTER TABLE cart ADD delivery_mode_id INT DEFAULT NULL, ADD delivery_price DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE cart ADD CONSTRAINT FK_BA388B77DFB3A94 FOREIGN KEY (delivery_mode_id) REFERENCES delivery_mode (id)');
        $this->addSql('CREATE INDEX IDX_BA388B77DFB3A94 ON cart (delivery_mode_id)');
        $this->addSql('ALTER TABLE `order` CHANGE ticketing_reference ticketing_reference BIGINT DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user DROP roles');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cart DROP FOREIGN KEY FK_BA388B77DFB3A94');
        $this->addSql('CREATE TABLE event_link (id INT AUTO_INCREMENT NOT NULL, event_from_id INT NOT NULL, event_to_id INT NOT NULL, link_position INT NOT NULL, INDEX IDX_2967D55A712EFB49 (event_to_id), INDEX IDX_2967D55AFD9970A4 (event_from_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE event_link ADD CONSTRAINT FK_2967D55A712EFB49 FOREIGN KEY (event_to_id) REFERENCES event (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE event_link ADD CONSTRAINT FK_2967D55AFD9970A4 FOREIGN KEY (event_from_id) REFERENCES event (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE delivery_mode DROP FOREIGN KEY FK_46568F31AFC2B591');
        $this->addSql('ALTER TABLE product_stock_movement DROP FOREIGN KEY FK_E872BF994584665A');
        $this->addSql('ALTER TABLE product_stock_movement DROP FOREIGN KEY FK_E872BF998D9F6D38');
        $this->addSql('ALTER TABLE profile_user DROP FOREIGN KEY FK_3B5B59DDCCFA12B8');
        $this->addSql('ALTER TABLE profile_user DROP FOREIGN KEY FK_3B5B59DDA76ED395');
        $this->addSql('ALTER TABLE profile_role DROP FOREIGN KEY FK_E1A105FECCFA12B8');
        $this->addSql('ALTER TABLE profile_role DROP FOREIGN KEY FK_E1A105FED60322AC');
        $this->addSql('ALTER TABLE role DROP FOREIGN KEY FK_57698A6AAFC2B591');
        $this->addSql('DROP TABLE delivery_mode');
        $this->addSql('DROP TABLE product_stock_movement');
        $this->addSql('DROP TABLE profile');
        $this->addSql('DROP TABLE profile_user');
        $this->addSql('DROP TABLE profile_role');
        $this->addSql('DROP TABLE role');
        $this->addSql('ALTER TABLE address DROP FOREIGN KEY FK_D4E6F811AD5CDBF');
        $this->addSql('DROP INDEX UNIQ_D4E6F811AD5CDBF ON address');
        $this->addSql('ALTER TABLE address DROP cart_id, DROP first_name, DROP last_name, DROP phone, CHANGE customer_id customer_id INT NOT NULL');
        $this->addSql('DROP INDEX IDX_BA388B77DFB3A94 ON cart');
        $this->addSql('ALTER TABLE cart DROP delivery_mode_id, DROP delivery_price');
        $this->addSql('ALTER TABLE `order` CHANGE ticketing_reference ticketing_reference INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product DROP stock');
        $this->addSql('ALTER TABLE user ADD roles JSON NOT NULL');
    }
}
