<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class VersionRelatedEvent010100 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE event_link (id INT AUTO_INCREMENT NOT NULL, event_from_id INT NOT NULL, event_to_id INT NOT NULL, link_position INT NOT NULL, INDEX IDX_2967D55AFD9970A4 (event_from_id), INDEX IDX_2967D55A712EFB49 (event_to_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE event_link ADD CONSTRAINT FK_2967D55AFD9970A4 FOREIGN KEY (event_from_id) REFERENCES event (id)');
        $this->addSql('ALTER TABLE event_link ADD CONSTRAINT FK_2967D55A712EFB49 FOREIGN KEY (event_to_id) REFERENCES event (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event_link DROP FOREIGN KEY FK_2967D55AFD9970A4');
        $this->addSql('ALTER TABLE event_link DROP FOREIGN KEY FK_2967D55A712EFB49');
        $this->addSql('DROP TABLE event_link');
    }
}
