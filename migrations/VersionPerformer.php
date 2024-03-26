<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class VersionPerformer extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE performer (id INT AUTO_INCREMENT NOT NULL, main_img_id INT DEFAULT NULL, lang_id INT NOT NULL, social_image_id INT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(123) NOT NULL, subtitle LONGTEXT DEFAULT NULL, legend LONGTEXT DEFAULT NULL, description LONGTEXT DEFAULT NULL, language_group BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\', meta_title VARCHAR(255) DEFAULT NULL, meta_description VARCHAR(511) DEFAULT NULL, fb_title VARCHAR(255) DEFAULT NULL, fb_description VARCHAR(511) DEFAULT NULL, tw_title VARCHAR(255) DEFAULT NULL, tw_description VARCHAR(511) DEFAULT NULL, indexed TINYINT(1) NOT NULL, UNIQUE INDEX UNIQ_17210BEB989D9B62 (slug), INDEX IDX_17210BEB5F762743 (main_img_id), INDEX IDX_17210BEBB213FA4 (lang_id), INDEX IDX_17210BEBB394B141 (social_image_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE performer ADD CONSTRAINT FK_17210BEB5F762743 FOREIGN KEY (main_img_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE performer ADD CONSTRAINT FK_17210BEBB213FA4 FOREIGN KEY (lang_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE performer ADD CONSTRAINT FK_17210BEBB394B141 FOREIGN KEY (social_image_id) REFERENCES media (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE performer DROP FOREIGN KEY FK_17210BEB5F762743');
        $this->addSql('ALTER TABLE performer DROP FOREIGN KEY FK_17210BEBB213FA4');
        $this->addSql('ALTER TABLE performer DROP FOREIGN KEY FK_17210BEBB394B141');
        $this->addSql('DROP TABLE performer');
    }
}
