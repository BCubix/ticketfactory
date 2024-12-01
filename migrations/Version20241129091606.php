<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241129091606 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE subscription (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, event_nb SMALLINT NOT NULL, price DOUBLE PRECISION NOT NULL, begin_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL, duration SMALLINT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subscription_event (subscription_id INT NOT NULL, event_id INT NOT NULL, INDEX IDX_C1960BD49A1887DC (subscription_id), INDEX IDX_C1960BD471F7E88B (event_id), PRIMARY KEY(subscription_id, event_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE subscription_event ADD CONSTRAINT FK_C1960BD49A1887DC FOREIGN KEY (subscription_id) REFERENCES subscription (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE subscription_event ADD CONSTRAINT FK_C1960BD471F7E88B FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE event ADD subscription_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA79A1887DC FOREIGN KEY (subscription_id) REFERENCES subscription (id)');
        $this->addSql('CREATE INDEX IDX_3BAE0AA79A1887DC ON event (subscription_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA79A1887DC');
        $this->addSql('ALTER TABLE subscription_event DROP FOREIGN KEY FK_C1960BD49A1887DC');
        $this->addSql('ALTER TABLE subscription_event DROP FOREIGN KEY FK_C1960BD471F7E88B');
        $this->addSql('DROP TABLE subscription');
        $this->addSql('DROP TABLE subscription_event');
        $this->addSql('DROP INDEX IDX_3BAE0AA79A1887DC ON event');
        $this->addSql('ALTER TABLE event DROP subscription_id');
    }
}
