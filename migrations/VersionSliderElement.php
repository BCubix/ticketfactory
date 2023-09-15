<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class VersionSliderElement extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE slider_element (id INT AUTO_INCREMENT NOT NULL, image_id INT DEFAULT NULL, lang_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, name VARCHAR(255) NOT NULL, slug VARCHAR(123) NOT NULL, slider_position INT NOT NULL, title LONGTEXT NOT NULL, subtitle LONGTEXT DEFAULT NULL, url VARCHAR(255) NOT NULL, dates VARCHAR(255) DEFAULT NULL, language_group BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\', UNIQUE INDEX UNIQ_3FBB7B95989D9B62 (slug), INDEX IDX_3FBB7B953DA5256D (image_id), INDEX IDX_3FBB7B95B213FA4 (lang_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE slider_element ADD CONSTRAINT FK_3FBB7B953DA5256D FOREIGN KEY (image_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE slider_element ADD CONSTRAINT FK_3FBB7B95B213FA4 FOREIGN KEY (lang_id) REFERENCES language (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE slider_element DROP FOREIGN KEY FK_3FBB7B953DA5256D');
        $this->addSql('ALTER TABLE slider_element DROP FOREIGN KEY FK_3FBB7B95B213FA4');
        $this->addSql('DROP TABLE slider_element');
    }
}
