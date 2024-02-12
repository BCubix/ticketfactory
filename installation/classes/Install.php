<?php

namespace TicketFactory\Installer\Classes\Install;

use App\Service\Db\Db;

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
}
