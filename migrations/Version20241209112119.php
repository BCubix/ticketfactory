<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241209112119 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE delivery_mode (id INT AUTO_INCREMENT NOT NULL, module_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, name VARCHAR(255) NOT NULL, manager VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, INDEX IDX_46568F31AFC2B591 (module_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE event_row (id INT AUTO_INCREMENT NOT NULL, event_id INT NOT NULL, event_date_id INT NOT NULL, seating_plan_id INT DEFAULT NULL, cart_id INT NOT NULL, total DOUBLE PRECISION NOT NULL, INDEX IDX_95FF330871F7E88B (event_id), INDEX IDX_95FF33083DC09FC4 (event_date_id), INDEX IDX_95FF330819E3A7BA (seating_plan_id), INDEX IDX_95FF33081AD5CDBF (cart_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE event_seat (id INT AUTO_INCREMENT NOT NULL, event_price_id INT NOT NULL, event_row_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, INDEX IDX_22977ACD90F82E37 (event_price_id), INDEX IDX_22977ACDB13B1EA0 (event_row_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, type VARCHAR(255) NOT NULL, object_id INT DEFAULT NULL, readed TINYINT(1) NOT NULL, INDEX IDX_BF5476CAA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE page_block_type (id INT AUTO_INCREMENT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, name VARCHAR(255) NOT NULL, keyword VARCHAR(123) DEFAULT NULL, fields JSON NOT NULL, UNIQUE INDEX UNIQ_415034CC5A93713B (keyword), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_row (id INT AUTO_INCREMENT NOT NULL, product_id INT NOT NULL, cart_id INT NOT NULL, total DOUBLE PRECISION NOT NULL, quantity INT NOT NULL, INDEX IDX_641FA2C44584665A (product_id), INDEX IDX_641FA2C41AD5CDBF (cart_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_row_voucher (product_row_id INT NOT NULL, voucher_id INT NOT NULL, INDEX IDX_D730AEECE1DE2856 (product_row_id), INDEX IDX_D730AEEC28AA1B6F (voucher_id), PRIMARY KEY(product_row_id, voucher_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_stock_movement (id INT AUTO_INCREMENT NOT NULL, product_id INT NOT NULL, order_id INT DEFAULT NULL, quantity INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_E872BF994584665A (product_id), INDEX IDX_E872BF998D9F6D38 (order_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile (id INT AUTO_INCREMENT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE profile_role (profile_id INT NOT NULL, role_id INT NOT NULL, INDEX IDX_E1A105FECCFA12B8 (profile_id), INDEX IDX_E1A105FED60322AC (role_id), PRIMARY KEY(profile_id, role_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE role (id INT AUTO_INCREMENT NOT NULL, module_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, label VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, group_name VARCHAR(255) NOT NULL, INDEX IDX_57698A6AAFC2B591 (module_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subscription (id INT AUTO_INCREMENT NOT NULL, lang_id INT NOT NULL, media_id INT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, event_nb SMALLINT NOT NULL, price DOUBLE PRECISION NOT NULL, language_group BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\', begin_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL, duration SMALLINT NOT NULL, INDEX IDX_A3C664D3B213FA4 (lang_id), INDEX IDX_A3C664D3EA9FDD75 (media_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subscription_event (subscription_id INT NOT NULL, event_id INT NOT NULL, INDEX IDX_C1960BD49A1887DC (subscription_id), INDEX IDX_C1960BD471F7E88B (event_id), PRIMARY KEY(subscription_id, event_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subscription_row (id INT AUTO_INCREMENT NOT NULL, subscription_id INT NOT NULL, cart_id INT NOT NULL, total DOUBLE PRECISION NOT NULL, quantity INT NOT NULL, INDEX IDX_601B18309A1887DC (subscription_id), INDEX IDX_601B18301AD5CDBF (cart_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subscription_row_voucher (subscription_row_id INT NOT NULL, voucher_id INT NOT NULL, INDEX IDX_460540644A547175 (subscription_row_id), INDEX IDX_4605406428AA1B6F (voucher_id), PRIMARY KEY(subscription_row_id, voucher_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subscription_usage (id INT AUTO_INCREMENT NOT NULL, subscription_row_id INT NOT NULL, event_seat_id INT NOT NULL, event_id INT NOT NULL, linked_order_id INT NOT NULL, INDEX IDX_2AD35F034A547175 (subscription_row_id), UNIQUE INDEX UNIQ_2AD35F03448D579A (event_seat_id), INDEX IDX_2AD35F0371F7E88B (event_id), INDEX IDX_2AD35F03E39F23E7 (linked_order_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_profile (user_id INT NOT NULL, profile_id INT NOT NULL, INDEX IDX_D95AB405A76ED395 (user_id), INDEX IDX_D95AB405CCFA12B8 (profile_id), PRIMARY KEY(user_id, profile_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE voucher_event_row (voucher_id INT NOT NULL, event_row_id INT NOT NULL, INDEX IDX_105AFD428AA1B6F (voucher_id), INDEX IDX_105AFD4B13B1EA0 (event_row_id), PRIMARY KEY(voucher_id, event_row_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE delivery_mode ADD CONSTRAINT FK_46568F31AFC2B591 FOREIGN KEY (module_id) REFERENCES module (id)');
        $this->addSql('ALTER TABLE event_row ADD CONSTRAINT FK_95FF330871F7E88B FOREIGN KEY (event_id) REFERENCES event (id)');
        $this->addSql('ALTER TABLE event_row ADD CONSTRAINT FK_95FF33083DC09FC4 FOREIGN KEY (event_date_id) REFERENCES event_date (id)');
        $this->addSql('ALTER TABLE event_row ADD CONSTRAINT FK_95FF330819E3A7BA FOREIGN KEY (seating_plan_id) REFERENCES seating_plan (id)');
        $this->addSql('ALTER TABLE event_row ADD CONSTRAINT FK_95FF33081AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('ALTER TABLE event_seat ADD CONSTRAINT FK_22977ACD90F82E37 FOREIGN KEY (event_price_id) REFERENCES event_price (id)');
        $this->addSql('ALTER TABLE event_seat ADD CONSTRAINT FK_22977ACDB13B1EA0 FOREIGN KEY (event_row_id) REFERENCES event_row (id)');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE product_row ADD CONSTRAINT FK_641FA2C44584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE product_row ADD CONSTRAINT FK_641FA2C41AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('ALTER TABLE product_row_voucher ADD CONSTRAINT FK_D730AEECE1DE2856 FOREIGN KEY (product_row_id) REFERENCES product_row (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product_row_voucher ADD CONSTRAINT FK_D730AEEC28AA1B6F FOREIGN KEY (voucher_id) REFERENCES voucher (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product_stock_movement ADD CONSTRAINT FK_E872BF994584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE product_stock_movement ADD CONSTRAINT FK_E872BF998D9F6D38 FOREIGN KEY (order_id) REFERENCES `order` (id)');
        $this->addSql('ALTER TABLE profile_role ADD CONSTRAINT FK_E1A105FECCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_role ADD CONSTRAINT FK_E1A105FED60322AC FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE role ADD CONSTRAINT FK_57698A6AAFC2B591 FOREIGN KEY (module_id) REFERENCES module (id)');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D3B213FA4 FOREIGN KEY (lang_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D3EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE subscription_event ADD CONSTRAINT FK_C1960BD49A1887DC FOREIGN KEY (subscription_id) REFERENCES subscription (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE subscription_event ADD CONSTRAINT FK_C1960BD471F7E88B FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE subscription_row ADD CONSTRAINT FK_601B18309A1887DC FOREIGN KEY (subscription_id) REFERENCES subscription (id)');
        $this->addSql('ALTER TABLE subscription_row ADD CONSTRAINT FK_601B18301AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('ALTER TABLE subscription_row_voucher ADD CONSTRAINT FK_460540644A547175 FOREIGN KEY (subscription_row_id) REFERENCES subscription_row (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE subscription_row_voucher ADD CONSTRAINT FK_4605406428AA1B6F FOREIGN KEY (voucher_id) REFERENCES voucher (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE subscription_usage ADD CONSTRAINT FK_2AD35F034A547175 FOREIGN KEY (subscription_row_id) REFERENCES subscription_row (id)');
        $this->addSql('ALTER TABLE subscription_usage ADD CONSTRAINT FK_2AD35F03448D579A FOREIGN KEY (event_seat_id) REFERENCES event_seat (id)');
        $this->addSql('ALTER TABLE subscription_usage ADD CONSTRAINT FK_2AD35F0371F7E88B FOREIGN KEY (event_id) REFERENCES event (id)');
        $this->addSql('ALTER TABLE subscription_usage ADD CONSTRAINT FK_2AD35F03E39F23E7 FOREIGN KEY (linked_order_id) REFERENCES `order` (id)');
        $this->addSql('ALTER TABLE user_profile ADD CONSTRAINT FK_D95AB405A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_profile ADD CONSTRAINT FK_D95AB405CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voucher_event_row ADD CONSTRAINT FK_105AFD428AA1B6F FOREIGN KEY (voucher_id) REFERENCES voucher (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voucher_event_row ADD CONSTRAINT FK_105AFD4B13B1EA0 FOREIGN KEY (event_row_id) REFERENCES event_row (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE cart_row DROP FOREIGN KEY FK_B420E59819E3A7BA');
        $this->addSql('ALTER TABLE cart_row DROP FOREIGN KEY FK_B420E5981AD5CDBF');
        $this->addSql('ALTER TABLE cart_row DROP FOREIGN KEY FK_B420E5983DC09FC4');
        $this->addSql('ALTER TABLE cart_row DROP FOREIGN KEY FK_B420E59871F7E88B');
        $this->addSql('ALTER TABLE cart_seat DROP FOREIGN KEY FK_D2B9365F8D260BAD');
        $this->addSql('ALTER TABLE cart_seat DROP FOREIGN KEY FK_D2B9365F90F82E37');
        $this->addSql('ALTER TABLE voucher_cart_row DROP FOREIGN KEY FK_2A87BD1128AA1B6F');
        $this->addSql('ALTER TABLE voucher_cart_row DROP FOREIGN KEY FK_2A87BD118D260BAD');
        $this->addSql('DROP TABLE cart_row');
        $this->addSql('DROP TABLE cart_seat');
        $this->addSql('DROP TABLE voucher_cart_row');
        $this->addSql('ALTER TABLE address ADD cart_id INT DEFAULT NULL, ADD first_name VARCHAR(255) NOT NULL, ADD last_name VARCHAR(255) NOT NULL, ADD phone VARCHAR(255) NOT NULL, CHANGE customer_id customer_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F811AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D4E6F811AD5CDBF ON address (cart_id)');
        $this->addSql('ALTER TABLE cart ADD delivery_mode_id INT DEFAULT NULL, ADD delivery_price DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE cart ADD CONSTRAINT FK_BA388B77DFB3A94 FOREIGN KEY (delivery_mode_id) REFERENCES delivery_mode (id)');
        $this->addSql('CREATE INDEX IDX_BA388B77DFB3A94 ON cart (delivery_mode_id)');
        $this->addSql('ALTER TABLE content DROP FOREIGN KEY FK_FEC530A9C4663E4');
        $this->addSql('DROP INDEX IDX_FEC530A9C4663E4 ON content');
        $this->addSql('ALTER TABLE content ADD publication_status VARCHAR(255) NOT NULL, DROP page_id, DROP tw_title, DROP tw_description, CHANGE fields fields JSON NOT NULL');
        $this->addSql('ALTER TABLE content_type DROP page_type, DROP display_blocks, CHANGE fields fields JSON NOT NULL, CHANGE keyword keyword VARCHAR(123) DEFAULT NULL');
        $this->addSql('ALTER TABLE customer CHANGE roles roles JSON NOT NULL');
        $this->addSql('ALTER TABLE event ADD subscription_id INT DEFAULT NULL, DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA79A1887DC FOREIGN KEY (subscription_id) REFERENCES subscription (id)');
        $this->addSql('CREATE INDEX IDX_3BAE0AA79A1887DC ON event (subscription_id)');
        $this->addSql('ALTER TABLE event_category DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE image_format ADD image_to_crop TINYINT(1) NOT NULL, CHANGE height height INT DEFAULT NULL, CHANGE width width INT DEFAULT NULL');
        $this->addSql('ALTER TABLE newsletter CHANGE email email VARCHAR(123) NOT NULL, CHANGE zipcode zipcode INT DEFAULT NULL, CHANGE misc misc JSON DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7E8585C8444F97DD ON newsletter (phone)');
        $this->addSql('ALTER TABLE `order` CHANGE order_data order_data JSON DEFAULT NULL, CHANGE ticketing_reference ticketing_reference BIGINT DEFAULT NULL');
        $this->addSql('ALTER TABLE page ADD publication_status VARCHAR(255) NOT NULL, DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE page_block ADD page_block_type_id INT DEFAULT NULL, ADD fields JSON NOT NULL, ADD class VARCHAR(255) NOT NULL, DROP block_type, CHANGE columns columns JSON NOT NULL');
        $this->addSql('ALTER TABLE page_block ADD CONSTRAINT FK_E59A68F42EB50856 FOREIGN KEY (page_block_type_id) REFERENCES page_block_type (id)');
        $this->addSql('CREATE INDEX IDX_E59A68F42EB50856 ON page_block (page_block_type_id)');
        $this->addSql('ALTER TABLE parameter ADD translated_parameter TINYINT(1) NOT NULL, CHANGE available_value available_value JSON DEFAULT NULL, CHANGE validations validations JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD stock INT DEFAULT NULL, DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE product_category DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE room DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE season DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE slider_element ADD product_id INT DEFAULT NULL, ADD display_product TINYINT(1) NOT NULL, CHANGE title title LONGTEXT DEFAULT NULL, CHANGE url url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE slider_element ADD CONSTRAINT FK_3FBB7B954584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('CREATE INDEX IDX_3FBB7B954584665A ON slider_element (product_id)');
        $this->addSql('ALTER TABLE tag DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE ticketing CHANGE data data JSON NOT NULL');
        $this->addSql('ALTER TABLE user DROP roles, CHANGE email email VARCHAR(123) NOT NULL');
        $this->addSql('ALTER TABLE versionned_entity CHANGE fields fields JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cart DROP FOREIGN KEY FK_BA388B77DFB3A94');
        $this->addSql('ALTER TABLE page_block DROP FOREIGN KEY FK_E59A68F42EB50856');
        $this->addSql('ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA79A1887DC');
        $this->addSql('CREATE TABLE cart_row (id INT AUTO_INCREMENT NOT NULL, seating_plan_id INT DEFAULT NULL, cart_id INT NOT NULL, event_id INT NOT NULL, event_date_id INT NOT NULL, total DOUBLE PRECISION NOT NULL, INDEX IDX_B420E59819E3A7BA (seating_plan_id), INDEX IDX_B420E5981AD5CDBF (cart_id), INDEX IDX_B420E5983DC09FC4 (event_date_id), INDEX IDX_B420E59871F7E88B (event_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE cart_seat (id INT AUTO_INCREMENT NOT NULL, event_price_id INT NOT NULL, cart_row_id INT NOT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_D2B9365F8D260BAD (cart_row_id), INDEX IDX_D2B9365F90F82E37 (event_price_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE voucher_cart_row (voucher_id INT NOT NULL, cart_row_id INT NOT NULL, INDEX IDX_2A87BD1128AA1B6F (voucher_id), INDEX IDX_2A87BD118D260BAD (cart_row_id), PRIMARY KEY(voucher_id, cart_row_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE cart_row ADD CONSTRAINT FK_B420E59819E3A7BA FOREIGN KEY (seating_plan_id) REFERENCES seating_plan (id)');
        $this->addSql('ALTER TABLE cart_row ADD CONSTRAINT FK_B420E5981AD5CDBF FOREIGN KEY (cart_id) REFERENCES cart (id)');
        $this->addSql('ALTER TABLE cart_row ADD CONSTRAINT FK_B420E5983DC09FC4 FOREIGN KEY (event_date_id) REFERENCES event_date (id)');
        $this->addSql('ALTER TABLE cart_row ADD CONSTRAINT FK_B420E59871F7E88B FOREIGN KEY (event_id) REFERENCES event (id)');
        $this->addSql('ALTER TABLE cart_seat ADD CONSTRAINT FK_D2B9365F8D260BAD FOREIGN KEY (cart_row_id) REFERENCES cart_row (id)');
        $this->addSql('ALTER TABLE cart_seat ADD CONSTRAINT FK_D2B9365F90F82E37 FOREIGN KEY (event_price_id) REFERENCES event_price (id)');
        $this->addSql('ALTER TABLE voucher_cart_row ADD CONSTRAINT FK_2A87BD1128AA1B6F FOREIGN KEY (voucher_id) REFERENCES voucher (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE voucher_cart_row ADD CONSTRAINT FK_2A87BD118D260BAD FOREIGN KEY (cart_row_id) REFERENCES cart_row (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE delivery_mode DROP FOREIGN KEY FK_46568F31AFC2B591');
        $this->addSql('ALTER TABLE event_row DROP FOREIGN KEY FK_95FF330871F7E88B');
        $this->addSql('ALTER TABLE event_row DROP FOREIGN KEY FK_95FF33083DC09FC4');
        $this->addSql('ALTER TABLE event_row DROP FOREIGN KEY FK_95FF330819E3A7BA');
        $this->addSql('ALTER TABLE event_row DROP FOREIGN KEY FK_95FF33081AD5CDBF');
        $this->addSql('ALTER TABLE event_seat DROP FOREIGN KEY FK_22977ACD90F82E37');
        $this->addSql('ALTER TABLE event_seat DROP FOREIGN KEY FK_22977ACDB13B1EA0');
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CAA76ED395');
        $this->addSql('ALTER TABLE product_row DROP FOREIGN KEY FK_641FA2C44584665A');
        $this->addSql('ALTER TABLE product_row DROP FOREIGN KEY FK_641FA2C41AD5CDBF');
        $this->addSql('ALTER TABLE product_row_voucher DROP FOREIGN KEY FK_D730AEECE1DE2856');
        $this->addSql('ALTER TABLE product_row_voucher DROP FOREIGN KEY FK_D730AEEC28AA1B6F');
        $this->addSql('ALTER TABLE product_stock_movement DROP FOREIGN KEY FK_E872BF994584665A');
        $this->addSql('ALTER TABLE product_stock_movement DROP FOREIGN KEY FK_E872BF998D9F6D38');
        $this->addSql('ALTER TABLE profile_role DROP FOREIGN KEY FK_E1A105FECCFA12B8');
        $this->addSql('ALTER TABLE profile_role DROP FOREIGN KEY FK_E1A105FED60322AC');
        $this->addSql('ALTER TABLE role DROP FOREIGN KEY FK_57698A6AAFC2B591');
        $this->addSql('ALTER TABLE subscription DROP FOREIGN KEY FK_A3C664D3B213FA4');
        $this->addSql('ALTER TABLE subscription DROP FOREIGN KEY FK_A3C664D3EA9FDD75');
        $this->addSql('ALTER TABLE subscription_event DROP FOREIGN KEY FK_C1960BD49A1887DC');
        $this->addSql('ALTER TABLE subscription_event DROP FOREIGN KEY FK_C1960BD471F7E88B');
        $this->addSql('ALTER TABLE subscription_row DROP FOREIGN KEY FK_601B18309A1887DC');
        $this->addSql('ALTER TABLE subscription_row DROP FOREIGN KEY FK_601B18301AD5CDBF');
        $this->addSql('ALTER TABLE subscription_row_voucher DROP FOREIGN KEY FK_460540644A547175');
        $this->addSql('ALTER TABLE subscription_row_voucher DROP FOREIGN KEY FK_4605406428AA1B6F');
        $this->addSql('ALTER TABLE subscription_usage DROP FOREIGN KEY FK_2AD35F034A547175');
        $this->addSql('ALTER TABLE subscription_usage DROP FOREIGN KEY FK_2AD35F03448D579A');
        $this->addSql('ALTER TABLE subscription_usage DROP FOREIGN KEY FK_2AD35F0371F7E88B');
        $this->addSql('ALTER TABLE subscription_usage DROP FOREIGN KEY FK_2AD35F03E39F23E7');
        $this->addSql('ALTER TABLE user_profile DROP FOREIGN KEY FK_D95AB405A76ED395');
        $this->addSql('ALTER TABLE user_profile DROP FOREIGN KEY FK_D95AB405CCFA12B8');
        $this->addSql('ALTER TABLE voucher_event_row DROP FOREIGN KEY FK_105AFD428AA1B6F');
        $this->addSql('ALTER TABLE voucher_event_row DROP FOREIGN KEY FK_105AFD4B13B1EA0');
        $this->addSql('DROP TABLE delivery_mode');
        $this->addSql('DROP TABLE event_row');
        $this->addSql('DROP TABLE event_seat');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE page_block_type');
        $this->addSql('DROP TABLE product_row');
        $this->addSql('DROP TABLE product_row_voucher');
        $this->addSql('DROP TABLE product_stock_movement');
        $this->addSql('DROP TABLE profile');
        $this->addSql('DROP TABLE profile_role');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE subscription');
        $this->addSql('DROP TABLE subscription_event');
        $this->addSql('DROP TABLE subscription_row');
        $this->addSql('DROP TABLE subscription_row_voucher');
        $this->addSql('DROP TABLE subscription_usage');
        $this->addSql('DROP TABLE user_profile');
        $this->addSql('DROP TABLE voucher_event_row');
        $this->addSql('ALTER TABLE address DROP FOREIGN KEY FK_D4E6F811AD5CDBF');
        $this->addSql('DROP INDEX UNIQ_D4E6F811AD5CDBF ON address');
        $this->addSql('ALTER TABLE address DROP cart_id, DROP first_name, DROP last_name, DROP phone, CHANGE customer_id customer_id INT NOT NULL');
        $this->addSql('DROP INDEX IDX_BA388B77DFB3A94 ON cart');
        $this->addSql('ALTER TABLE cart DROP delivery_mode_id, DROP delivery_price');
        $this->addSql('ALTER TABLE content ADD page_id INT DEFAULT NULL, ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL, DROP publication_status, CHANGE fields fields LONGTEXT NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE content ADD CONSTRAINT FK_FEC530A9C4663E4 FOREIGN KEY (page_id) REFERENCES page (id)');
        $this->addSql('CREATE INDEX IDX_FEC530A9C4663E4 ON content (page_id)');
        $this->addSql('ALTER TABLE content_type ADD page_type TINYINT(1) NOT NULL, ADD display_blocks TINYINT(1) NOT NULL, CHANGE keyword keyword VARCHAR(191) DEFAULT NULL, CHANGE fields fields LONGTEXT NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE customer CHANGE roles roles LONGTEXT NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('DROP INDEX IDX_3BAE0AA79A1887DC ON event');
        $this->addSql('ALTER TABLE event ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL, DROP subscription_id');
        $this->addSql('ALTER TABLE event_category ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE image_format DROP image_to_crop, CHANGE height height INT NOT NULL, CHANGE width width INT NOT NULL');
        $this->addSql('DROP INDEX UNIQ_7E8585C8444F97DD ON newsletter');
        $this->addSql('ALTER TABLE newsletter CHANGE email email VARCHAR(255) NOT NULL, CHANGE zipcode zipcode SMALLINT DEFAULT NULL, CHANGE misc misc LONGTEXT DEFAULT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE `order` CHANGE order_data order_data LONGTEXT DEFAULT NULL COLLATE `utf8mb4_bin`, CHANGE ticketing_reference ticketing_reference INT DEFAULT NULL');
        $this->addSql('ALTER TABLE page ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL, DROP publication_status');
        $this->addSql('DROP INDEX IDX_E59A68F42EB50856 ON page_block');
        $this->addSql('ALTER TABLE page_block ADD block_type INT NOT NULL, DROP page_block_type_id, DROP fields, DROP class, CHANGE columns columns LONGTEXT NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE parameter DROP translated_parameter, CHANGE available_value available_value LONGTEXT DEFAULT NULL COLLATE `utf8mb4_bin`, CHANGE validations validations LONGTEXT DEFAULT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE product ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL, DROP stock');
        $this->addSql('ALTER TABLE product_category ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE room ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE season ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE slider_element DROP FOREIGN KEY FK_3FBB7B954584665A');
        $this->addSql('DROP INDEX IDX_3FBB7B954584665A ON slider_element');
        $this->addSql('ALTER TABLE slider_element DROP product_id, DROP display_product, CHANGE title title LONGTEXT NOT NULL, CHANGE url url VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE tag ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE ticketing CHANGE data data LONGTEXT NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE user ADD roles LONGTEXT NOT NULL COLLATE `utf8mb4_bin`, CHANGE email email VARCHAR(180) NOT NULL');
        $this->addSql('ALTER TABLE versionned_entity CHANGE fields fields LONGTEXT NOT NULL COLLATE `utf8mb4_bin`');
    }
}
