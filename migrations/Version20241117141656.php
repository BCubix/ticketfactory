<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241117141656 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_profile (user_id INT NOT NULL, profile_id INT NOT NULL, INDEX IDX_D95AB405A76ED395 (user_id), INDEX IDX_D95AB405CCFA12B8 (profile_id), PRIMARY KEY(user_id, profile_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_profile ADD CONSTRAINT FK_D95AB405A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_profile ADD CONSTRAINT FK_D95AB405CCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_user DROP FOREIGN KEY FK_3B5B59DDA76ED395');
        $this->addSql('ALTER TABLE profile_user DROP FOREIGN KEY FK_3B5B59DDCCFA12B8');
        $this->addSql('DROP TABLE profile_user');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE profile_user (profile_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_3B5B59DDCCFA12B8 (profile_id), INDEX IDX_3B5B59DDA76ED395 (user_id), PRIMARY KEY(profile_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE profile_user ADD CONSTRAINT FK_3B5B59DDA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE profile_user ADD CONSTRAINT FK_3B5B59DDCCFA12B8 FOREIGN KEY (profile_id) REFERENCES profile (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_profile DROP FOREIGN KEY FK_D95AB405A76ED395');
        $this->addSql('ALTER TABLE user_profile DROP FOREIGN KEY FK_D95AB405CCFA12B8');
        $this->addSql('DROP TABLE user_profile');
    }
}
