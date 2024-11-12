<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class VersionNewsletter010000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE newsletter (id INT AUTO_INCREMENT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, email VARCHAR(123) NOT NULL, first_name VARCHAR(255) DEFAULT NULL, last_name VARCHAR(255) DEFAULT NULL, birthday DATE DEFAULT NULL, gender VARCHAR(16) DEFAULT NULL, phone VARCHAR(32) DEFAULT NULL, interests LONGTEXT DEFAULT NULL, address VARCHAR(255) DEFAULT NULL, zipcode INT DEFAULT NULL, country VARCHAR(32) DEFAULT NULL, optin TINYINT(1) NOT NULL, misc JSON DEFAULT NULL, UNIQUE INDEX UNIQ_7E8585C8E7927C74 (email), UNIQUE INDEX UNIQ_7E8585C8444F97DD (phone), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE newsletter');
    }
}
