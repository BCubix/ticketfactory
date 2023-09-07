<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class VersionNews extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE news (id INT AUTO_INCREMENT NOT NULL, main_img_id INT NOT NULL, news_category_id INT NOT NULL, lang_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, title VARCHAR(255) NOT NULL, slug VARCHAR(123) NOT NULL, header_news TINYINT(1) NOT NULL, type VARCHAR(255) NOT NULL, publication_date DATETIME NOT NULL, reading_time INT NOT NULL, introduction LONGTEXT NOT NULL, short_description LONGTEXT NOT NULL, content LONGTEXT NOT NULL, language_group BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\', UNIQUE INDEX UNIQ_1DD39950989D9B62 (slug), INDEX IDX_1DD399505F762743 (main_img_id), INDEX IDX_1DD399503B732BAD (news_category_id), INDEX IDX_1DD39950B213FA4 (lang_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE news_category (id INT AUTO_INCREMENT NOT NULL, lang_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', active TINYINT(1) NOT NULL, name VARCHAR(255) NOT NULL, language_group BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\', INDEX IDX_4F72BA90B213FA4 (lang_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD399505F762743 FOREIGN KEY (main_img_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD399503B732BAD FOREIGN KEY (news_category_id) REFERENCES news_category (id)');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD39950B213FA4 FOREIGN KEY (lang_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE news_category ADD CONSTRAINT FK_4F72BA90B213FA4 FOREIGN KEY (lang_id) REFERENCES language (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE news DROP FOREIGN KEY FK_1DD399505F762743');
        $this->addSql('ALTER TABLE news DROP FOREIGN KEY FK_1DD399503B732BAD');
        $this->addSql('ALTER TABLE news DROP FOREIGN KEY FK_1DD39950B213FA4');
        $this->addSql('ALTER TABLE news_category DROP FOREIGN KEY FK_4F72BA90B213FA4');
        $this->addSql('DROP TABLE news');
        $this->addSql('DROP TABLE news_category');
    }
}
