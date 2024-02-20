<?php

namespace TicketFactory\Installer\Classes\Install;

use App\Service\Db\Db;
use TicketFactory\Installer\Classes\Uuid\UUID;

class Install
{
    private $errors = [];

    public function generateEnvFile($envFile, $db_host, $db_port, $db_user, $db_password, $db_name)
    {
        $varName = 'DATABASE_URL=';
        $url = '"mysql://' . $db_user . ':' . $db_password . '@';
        $url .= $db_host . ':' . $db_port . '/' . $db_name . '?charset=utf8mb4"';

        $content = file_get_contents($envFile);
        $newContent = '';

        $position = strpos($content, $varName);
        if ($position !== 0) {
            $varName = PHP_EOL . $varName;
            $position = strpos($content, $varName);
        }
        $position += strlen($varName);
        $newContent = substr($content, 0, $position) . $url;

        $content = substr($content, $position);
        $position = strpos($content, PHP_EOL);

        if ($position !== false) {
            $newContent .= substr($content, $position);
        }

        return file_put_contents($envFile, $newContent) !== false;
    }

    public function installDatabase()
    {
        $output = [];
        if (false === exec('php ../bin/console doctrine:schema:update --force', $output)) {
            $this->setError($output);

            return false;
        }

        return true;
    }

    public function populateDatabase(string $structureId)
    {
        try {
            foreach (new \DirectoryIterator(_TF_INSTALL_DATA_PATH_) as $file) {
                if (preg_match('/^.+\.sql$/u', $file->getFilename())) {
                    Db::getInstance()->query(file_get_contents(_TF_INSTALL_DATA_PATH_ . $file->getFilename()));
                }
            }
            foreach (['event', 'media', 'product'] as $entity) {
                $this->addCategoryToDatabase($entity . '_category');
            }
            $this->addMenuEntryToDatabase();
            $this->addPageToDatabase();
            $this->addContentToDatabase();
            $this->updateStructureTypeParameter($structureId);
        } catch (\Exception $e) {
            $this->setError($e->getMessage());
            return false;
        }
        return true;
    }

    public function createAdminUser(string $email, string $firstname, string $lastname, string $password): bool
    {
        if (!isset($email) || !isset($firstname) || !isset($lastname) || !isset($password)) {
            return false;
        }

        $nowFormatted = (new \DateTime())->format('Y-m-d H:i:s');

        $sql = sprintf(
            "INSERT INTO `user` (
                created_at, updated_at, active, email, first_name, last_name, roles, password
            )
            VALUES ('%s', '%s', 1, '%s', '%s', '%s', '[\"ROLE_ADMIN\"]', '%s');",
            $nowFormatted,
            $nowFormatted,
            $email,
            $firstname,
            $lastname,
            password_hash($password, PASSWORD_BCRYPT)
        );

        try {
            Db::getInstance()->query($sql);
        } catch (\Exception $e) {
            $this->setError($e->getMessage());
            return false;
        }
        return true;
    }

    public function setError($errors)
    {
        if (!is_array($errors)) {
            $errors = [$errors];
        }

        $this->errors = array_merge($this->errors, $errors);
    }

    public function getErrors()
    {
        return $this->errors;
    }

    private function addCategoryToDatabase(string $table)
    {
        $nowFormatted = (new \DateTime())->format('Y-m-d H:i:s');

        $sql = sprintf(
            "INSERT INTO
            `%s` (
                id, tree_root, parent_id, created_at, updated_at, active, name, slug, lft, rgt, lvl, lang_id, language_group, position
            )
            VALUES (1, 1, NULL, '%s', '%s', 1, 'Catégories', 'categories', 1, 14, 0, 1, 0x4DC0AA4F890044E893651930886CB470, 0);",
            $table,
            $nowFormatted,
            $nowFormatted
        );

        Db::getInstance()->query($sql);
    }

    private function addMenuEntryToDatabase()
    {
        $values = [
            "(1, 1, NULL, 'Footer', 'none', NULL, 1, 20, 0, 1, 0x4DC0AA4F890044E893651930886CB470, 0, 'footer')",
            "(2, 2, NULL, 'Menu principal', 'none', NULL, 1, 34, 0, 1, 0x672CE0960CD648EA9BAE2AEED118FAFC, 0, 'main')",
            "(3, 2, 2, 'Page principale', 'page', 1, 2, 9, 1, 1, 0x816D0F3F6045478390D4CC4B120E93A2, 0, NULL)"
        ];

        foreach ($values as $value) {
            $sql = sprintf(
                "INSERT INTO
            `menu_entry` (
                id, tree_root, parent_id, name, menu_type, value, lft, rgt, lvl, lang_id, language_group, blank, keyword
            )
            VALUES %s;",
                $value
            );

            Db::getInstance()->query($sql);
        }
    }

    private function addPageToDatabase()
    {
        $nowFormatted = (new \DateTime())->format('Y-m-d H:i:s');

        $values = [
            "(1, '%s', '%s', 1, 'Page principale', 1, NULL, '', 0x4DC0AA4F890044E893651930886CB470, 'home', 'App\\\\Controller\\\\Website\\\\HomeController::index')",
            "(2, '%s', '%s', 1, 'Le Théâtre', 1, NULL, 'le-theatre', 0x672CE0960CD648EA9BAE2AEED118FAFC, 'theater', NULL)",
        ];

        foreach ($values as $value) {
            $value = sprintf($value, $nowFormatted, $nowFormatted);

            $sql = sprintf(
                "INSERT INTO
            `page` (
            id, created_at, updated_at, active, title, lang_id, parent_id, slug, language_group, keyword, controller
            )
            VALUES %s;",
                $value
            );

            Db::getInstance()->query($sql);
        }
    }

    private function addContentToDatabase()
    {
        $nowFormatted = (new \DateTime())->format('Y-m-d H:i:s');

        Db::getInstance()->query(sprintf(
            "INSERT INTO
                `content` (
                  id, content_type_id, created_at, updated_at, active, title, slug, fields, lang_id, language_group, page_id
                )
                VALUES (1, 1, '%s', '%s', 1, 'Théatre Online', 'theatre-online', '%s', 1, 0x4DC0AA4F890044E893651930886CB470, 1);",
            $nowFormatted,
            $nowFormatted,
            '{"theater": {"image": 20, "title": "Le Théatre", "button": {"link": 13, "label": "En savoir plus"}, "content": "<div class=\\\\"tcard__description\\\\">\\\\r\\\\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\\\\r\\\\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\\\\r\\\\n</div>", "subtitle": "Un théâtre de toute beauté !"}, "columnsBlock": {"blocks": []}}'
        ));
    }

    private function updateStructureTypeParameter(string $structureId)
    {
        Db::getInstance()->query(sprintf(
            "UPDATE `parameter`
            SET param_value='%s'
            WHERE id=22;",
            $structureId
        ));
    }
}
