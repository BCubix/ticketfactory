<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class VersionModuleTCE extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE spectacle_blog (id INT AUTO_INCREMENT NOT NULL, image_id INT NOT NULL, spectacle_id INT NOT NULL, lang_id INT NOT NULL, date DATE DEFAULT NULL, slug VARCHAR(123) NOT NULL, title VARCHAR(255) NOT NULL, sub_title VARCHAR(255) DEFAULT NULL, description LONGTEXT DEFAULT NULL, language_group BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\', UNIQUE INDEX UNIQ_2165019C989D9B62 (slug), INDEX IDX_2165019C3DA5256D (image_id), INDEX IDX_2165019CC682915D (spectacle_id), INDEX IDX_2165019CB213FA4 (lang_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE spectacle_link (id INT AUTO_INCREMENT NOT NULL, spectacle_from_id INT NOT NULL, spectacle_to_id INT NOT NULL, link_position INT NOT NULL, INDEX IDX_D7DCC92E14A5878F (spectacle_from_id), INDEX IDX_D7DCC92E26B8F570 (spectacle_to_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE spectacle_press (id INT AUTO_INCREMENT NOT NULL, spectacle_id INT NOT NULL, lang_id INT NOT NULL, title VARCHAR(255) NOT NULL, content LONGTEXT DEFAULT NULL, language_group BINARY(16) NOT NULL COMMENT \'(DC2Type:uuid)\', INDEX IDX_6B49C3A8C682915D (spectacle_id), INDEX IDX_6B49C3A8B213FA4 (lang_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tag_event (tag_id INT NOT NULL, event_id INT NOT NULL, INDEX IDX_194213A1BAD26311 (tag_id), INDEX IDX_194213A171F7E88B (event_id), PRIMARY KEY(tag_id, event_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE spectacle_blog ADD CONSTRAINT FK_2165019C3DA5256D FOREIGN KEY (image_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE spectacle_blog ADD CONSTRAINT FK_2165019CC682915D FOREIGN KEY (spectacle_id) REFERENCES event (id)');
        $this->addSql('ALTER TABLE spectacle_blog ADD CONSTRAINT FK_2165019CB213FA4 FOREIGN KEY (lang_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE spectacle_link ADD CONSTRAINT FK_D7DCC92E14A5878F FOREIGN KEY (spectacle_from_id) REFERENCES event (id)');
        $this->addSql('ALTER TABLE spectacle_link ADD CONSTRAINT FK_D7DCC92E26B8F570 FOREIGN KEY (spectacle_to_id) REFERENCES event (id)');
        $this->addSql('ALTER TABLE spectacle_press ADD CONSTRAINT FK_6B49C3A8C682915D FOREIGN KEY (spectacle_id) REFERENCES event (id)');
        $this->addSql('ALTER TABLE spectacle_press ADD CONSTRAINT FK_6B49C3A8B213FA4 FOREIGN KEY (lang_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE tag_event ADD CONSTRAINT FK_194213A1BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tag_event ADD CONSTRAINT FK_194213A171F7E88B FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE content ADD social_image_id INT DEFAULT NULL, ADD meta_title VARCHAR(255) DEFAULT NULL, ADD meta_description VARCHAR(511) DEFAULT NULL, ADD fb_title VARCHAR(255) DEFAULT NULL, ADD fb_description VARCHAR(511) DEFAULT NULL, ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE content ADD CONSTRAINT FK_FEC530A9B394B141 FOREIGN KEY (social_image_id) REFERENCES media (id)');
        $this->addSql('CREATE INDEX IDX_FEC530A9B394B141 ON content (social_image_id)');
        $this->addSql('ALTER TABLE event ADD seating_plan_id INT DEFAULT NULL, ADD social_image_id INT DEFAULT NULL, ADD crm_id BIGINT DEFAULT NULL, ADD italic_title TINYINT(1) NOT NULL, ADD short_title VARCHAR(255) NOT NULL, ADD short_subtitle VARCHAR(255) DEFAULT NULL, ADD calendar_title VARCHAR(255) DEFAULT NULL, ADD title LONGTEXT NOT NULL, ADD tweet_sentence LONGTEXT NOT NULL, ADD program_url VARCHAR(255) DEFAULT NULL, ADD distribution LONGTEXT DEFAULT NULL, ADD program LONGTEXT DEFAULT NULL, ADD to_read LONGTEXT DEFAULT NULL, ADD poster_displayed TINYINT(1) NOT NULL, ADD calendar_displayed TINYINT(1) NOT NULL, ADD young_displayed TINYINT(1) NOT NULL, ADD subscription_active TINYINT(1) NOT NULL, ADD phone_booking_only TINYINT(1) NOT NULL, ADD information LONGTEXT DEFAULT NULL, ADD meta_title VARCHAR(255) DEFAULT NULL, ADD meta_description VARCHAR(511) DEFAULT NULL, ADD fb_title VARCHAR(255) DEFAULT NULL, ADD fb_description VARCHAR(511) DEFAULT NULL, ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA719E3A7BA FOREIGN KEY (seating_plan_id) REFERENCES seating_plan (id)');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7B394B141 FOREIGN KEY (social_image_id) REFERENCES media (id)');
        $this->addSql('CREATE INDEX IDX_3BAE0AA719E3A7BA ON event (seating_plan_id)');
        $this->addSql('CREATE INDEX IDX_3BAE0AA7B394B141 ON event (social_image_id)');
        $this->addSql('ALTER TABLE event_category ADD social_image_id INT DEFAULT NULL, ADD meta_title VARCHAR(255) DEFAULT NULL, ADD meta_description VARCHAR(511) DEFAULT NULL, ADD fb_title VARCHAR(255) DEFAULT NULL, ADD fb_description VARCHAR(511) DEFAULT NULL, ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE event_category ADD CONSTRAINT FK_40A0F011B394B141 FOREIGN KEY (social_image_id) REFERENCES media (id)');
        $this->addSql('CREATE INDEX IDX_40A0F011B394B141 ON event_category (social_image_id)');
        $this->addSql('ALTER TABLE event_media ADD main_img_calendar TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE event_price ADD young_price TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE page ADD social_image_id INT DEFAULT NULL, ADD type INT NOT NULL, ADD subtitle LONGTEXT DEFAULT NULL, ADD meta_title VARCHAR(255) DEFAULT NULL, ADD meta_description VARCHAR(511) DEFAULT NULL, ADD fb_title VARCHAR(255) DEFAULT NULL, ADD fb_description VARCHAR(511) DEFAULT NULL, ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE page ADD CONSTRAINT FK_140AB620B394B141 FOREIGN KEY (social_image_id) REFERENCES media (id)');
        $this->addSql('CREATE INDEX IDX_140AB620B394B141 ON page (social_image_id)');
        $this->addSql('ALTER TABLE page_block ADD image_id INT DEFAULT NULL, ADD description LONGTEXT DEFAULT NULL, ADD button1_label VARCHAR(255) DEFAULT NULL, ADD button1_url VARCHAR(255) DEFAULT NULL, ADD button2_label VARCHAR(255) DEFAULT NULL, ADD button2_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE page_block ADD CONSTRAINT FK_E59A68F43DA5256D FOREIGN KEY (image_id) REFERENCES media (id)');
        $this->addSql('CREATE INDEX IDX_E59A68F43DA5256D ON page_block (image_id)');
        $this->addSql('ALTER TABLE room ADD social_image_id INT DEFAULT NULL, ADD meta_title VARCHAR(255) DEFAULT NULL, ADD meta_description VARCHAR(511) DEFAULT NULL, ADD fb_title VARCHAR(255) DEFAULT NULL, ADD fb_description VARCHAR(511) DEFAULT NULL, ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE room ADD CONSTRAINT FK_729F519BB394B141 FOREIGN KEY (social_image_id) REFERENCES media (id)');
        $this->addSql('CREATE INDEX IDX_729F519BB394B141 ON room (social_image_id)');
        $this->addSql('ALTER TABLE season ADD logo_id INT DEFAULT NULL, ADD header_id INT DEFAULT NULL, ADD social_image_id INT DEFAULT NULL, ADD translation_enabled TINYINT(1) NOT NULL, ADD primary_color VARCHAR(7) NOT NULL, ADD secondary_color VARCHAR(7) NOT NULL, ADD meta_title VARCHAR(255) DEFAULT NULL, ADD meta_description VARCHAR(511) DEFAULT NULL, ADD fb_title VARCHAR(255) DEFAULT NULL, ADD fb_description VARCHAR(511) DEFAULT NULL, ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE season ADD CONSTRAINT FK_F0E45BA9F98F144A FOREIGN KEY (logo_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE season ADD CONSTRAINT FK_F0E45BA92EF91FD8 FOREIGN KEY (header_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE season ADD CONSTRAINT FK_F0E45BA9B394B141 FOREIGN KEY (social_image_id) REFERENCES media (id)');
        $this->addSql('CREATE INDEX IDX_F0E45BA9F98F144A ON season (logo_id)');
        $this->addSql('CREATE INDEX IDX_F0E45BA92EF91FD8 ON season (header_id)');
        $this->addSql('CREATE INDEX IDX_F0E45BA9B394B141 ON season (social_image_id)');
        $this->addSql('ALTER TABLE seating_plan ADD plan_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE seating_plan ADD CONSTRAINT FK_DD693D37E899029B FOREIGN KEY (plan_id) REFERENCES media (id)');
        $this->addSql('CREATE INDEX IDX_DD693D37E899029B ON seating_plan (plan_id)');
        $this->addSql('ALTER TABLE tag ADD social_image_id INT DEFAULT NULL, ADD title VARCHAR(255) NOT NULL, ADD meta_title VARCHAR(255) DEFAULT NULL, ADD meta_description VARCHAR(511) DEFAULT NULL, ADD fb_title VARCHAR(255) DEFAULT NULL, ADD fb_description VARCHAR(511) DEFAULT NULL, ADD tw_title VARCHAR(255) DEFAULT NULL, ADD tw_description VARCHAR(511) DEFAULT NULL');
        $this->addSql('ALTER TABLE tag ADD CONSTRAINT FK_389B783B394B141 FOREIGN KEY (social_image_id) REFERENCES media (id)');
        $this->addSql('CREATE INDEX IDX_389B783B394B141 ON tag (social_image_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE spectacle_blog DROP FOREIGN KEY FK_2165019C3DA5256D');
        $this->addSql('ALTER TABLE spectacle_blog DROP FOREIGN KEY FK_2165019CC682915D');
        $this->addSql('ALTER TABLE spectacle_blog DROP FOREIGN KEY FK_2165019CB213FA4');
        $this->addSql('ALTER TABLE spectacle_link DROP FOREIGN KEY FK_D7DCC92E14A5878F');
        $this->addSql('ALTER TABLE spectacle_link DROP FOREIGN KEY FK_D7DCC92E26B8F570');
        $this->addSql('ALTER TABLE spectacle_press DROP FOREIGN KEY FK_6B49C3A8C682915D');
        $this->addSql('ALTER TABLE spectacle_press DROP FOREIGN KEY FK_6B49C3A8B213FA4');
        $this->addSql('ALTER TABLE tag_event DROP FOREIGN KEY FK_194213A1BAD26311');
        $this->addSql('ALTER TABLE tag_event DROP FOREIGN KEY FK_194213A171F7E88B');
        $this->addSql('DROP TABLE spectacle_blog');
        $this->addSql('DROP TABLE spectacle_link');
        $this->addSql('DROP TABLE spectacle_press');
        $this->addSql('DROP TABLE tag_event');
        $this->addSql('ALTER TABLE content DROP FOREIGN KEY FK_FEC530A9B394B141');
        $this->addSql('DROP INDEX IDX_FEC530A9B394B141 ON content');
        $this->addSql('ALTER TABLE content DROP social_image_id, DROP meta_title, DROP meta_description, DROP fb_title, DROP fb_description, DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA719E3A7BA');
        $this->addSql('ALTER TABLE event DROP FOREIGN KEY FK_3BAE0AA7B394B141');
        $this->addSql('DROP INDEX IDX_3BAE0AA719E3A7BA ON event');
        $this->addSql('DROP INDEX IDX_3BAE0AA7B394B141 ON event');
        $this->addSql('ALTER TABLE event DROP seating_plan_id, DROP social_image_id, DROP crm_id, DROP italic_title, DROP short_title, DROP short_subtitle, DROP calendar_title, DROP title, DROP tweet_sentence, DROP program_url, DROP distribution, DROP program, DROP to_read, DROP poster_displayed, DROP calendar_displayed, DROP young_displayed, DROP subscription_active, DROP phone_booking_only, DROP information, DROP meta_title, DROP meta_description, DROP fb_title, DROP fb_description, DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE event_category DROP FOREIGN KEY FK_40A0F011B394B141');
        $this->addSql('DROP INDEX IDX_40A0F011B394B141 ON event_category');
        $this->addSql('ALTER TABLE event_category DROP social_image_id, DROP meta_title, DROP meta_description, DROP fb_title, DROP fb_description, DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE event_media DROP main_img_calendar');
        $this->addSql('ALTER TABLE event_price DROP young_price');
        $this->addSql('ALTER TABLE page DROP FOREIGN KEY FK_140AB620B394B141');
        $this->addSql('DROP INDEX IDX_140AB620B394B141 ON page');
        $this->addSql('ALTER TABLE page DROP social_image_id, DROP type, DROP subtitle, DROP meta_title, DROP meta_description, DROP fb_title, DROP fb_description, DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE page_block DROP FOREIGN KEY FK_E59A68F43DA5256D');
        $this->addSql('DROP INDEX IDX_E59A68F43DA5256D ON page_block');
        $this->addSql('ALTER TABLE page_block DROP image_id, DROP description, DROP button1_label, DROP button1_url, DROP button2_label, DROP button2_url');
        $this->addSql('ALTER TABLE room DROP FOREIGN KEY FK_729F519BB394B141');
        $this->addSql('DROP INDEX IDX_729F519BB394B141 ON room');
        $this->addSql('ALTER TABLE room DROP social_image_id, DROP meta_title, DROP meta_description, DROP fb_title, DROP fb_description, DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE season DROP FOREIGN KEY FK_F0E45BA9F98F144A');
        $this->addSql('ALTER TABLE season DROP FOREIGN KEY FK_F0E45BA92EF91FD8');
        $this->addSql('ALTER TABLE season DROP FOREIGN KEY FK_F0E45BA9B394B141');
        $this->addSql('DROP INDEX IDX_F0E45BA9F98F144A ON season');
        $this->addSql('DROP INDEX IDX_F0E45BA92EF91FD8 ON season');
        $this->addSql('DROP INDEX IDX_F0E45BA9B394B141 ON season');
        $this->addSql('ALTER TABLE season DROP logo_id, DROP header_id, DROP social_image_id, DROP translation_enabled, DROP primary_color, DROP secondary_color, DROP meta_title, DROP meta_description, DROP fb_title, DROP fb_description, DROP tw_title, DROP tw_description');
        $this->addSql('ALTER TABLE seating_plan DROP FOREIGN KEY FK_DD693D37E899029B');
        $this->addSql('DROP INDEX IDX_DD693D37E899029B ON seating_plan');
        $this->addSql('ALTER TABLE seating_plan DROP plan_id');
        $this->addSql('ALTER TABLE tag DROP FOREIGN KEY FK_389B783B394B141');
        $this->addSql('DROP INDEX IDX_389B783B394B141 ON tag');
        $this->addSql('ALTER TABLE tag DROP social_image_id, DROP title, DROP meta_title, DROP meta_description, DROP fb_title, DROP fb_description, DROP tw_title, DROP tw_description');
    }
}
