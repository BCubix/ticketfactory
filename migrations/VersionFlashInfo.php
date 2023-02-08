<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class VersionFlashInfo extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE flash_info (id INT AUTO_INCREMENT NOT NULL, lang_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, title VARCHAR(255) NOT NULL, slug VARCHAR(123) NOT NULL, description LONGTEXT NOT NULL, begin_date DATETIME DEFAULT NULL, end_date DATETIME DEFAULT NULL, language_group BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\', UNIQUE INDEX UNIQ_F0CC3F04989D9B62 (slug), INDEX IDX_F0CC3F04B213FA4 (lang_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE flash_info ADD CONSTRAINT FK_F0CC3F04B213FA4 FOREIGN KEY (lang_id) REFERENCES language (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE flash_info DROP FOREIGN KEY FK_F0CC3F04B213FA4');
        $this->addSql('DROP TABLE flash_info');
    }
}
