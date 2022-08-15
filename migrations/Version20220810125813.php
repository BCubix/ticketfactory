<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220810125813 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media (id INT AUTO_INCREMENT NOT NULL, alt VARCHAR(255) DEFAULT NULL, description LONGTEXT DEFAULT NULL, legend LONGTEXT DEFAULT NULL, title VARCHAR(255) NOT NULL, document_file_name VARCHAR(255) NOT NULL, document_type VARCHAR(255) NOT NULL, document_size VARCHAR(255) NOT NULL, document_url VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB');
        $this->addSql('DROP TABLE tag_event');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE tag_event (tag_id INT NOT NULL, event_id INT NOT NULL, INDEX IDX_194213A171F7E88B (event_id), INDEX IDX_194213A1BAD26311 (tag_id), PRIMARY KEY(tag_id, event_id)) DEFAULT CHARACTER SET utf8mb3 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE tag_event ADD CONSTRAINT FK_194213A171F7E88B FOREIGN KEY (event_id) REFERENCES event (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tag_event ADD CONSTRAINT FK_194213A1BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('DROP TABLE media');
    }
}
