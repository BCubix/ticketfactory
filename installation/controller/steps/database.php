<?php

use TicketFactory\Installer\Classes\Database\Database;
use TicketFactory\Installer\Classes\Tools\InstallerTools;
use TicketFactory\Installer\Classes\Validate\Validate;
use TicketFactory\Installer\Controller\InstallController\InstallController;

class InstallControllerDatabase extends InstallController
{
    public Database $model_database;
    public string $database_server;
    public string $database_name;
    public string $database_login;
    public string $database_password;

    public function init(): void
    {
        $this->model_database = new Database();
    }

    public function processNextStep(): void
    {
        $this->session->database_server = trim(InstallerTools::getValue('dbServer'));
        $this->session->database_name = trim(InstallerTools::getValue('dbName'));
        $this->session->database_login = trim(InstallerTools::getValue('dbLogin'));
        $this->session->database_password = trim(InstallerTools::getValue('dbPassword'));
    }

    public function validate(): bool
    {
        if ($this->session->database_server && !Validate::isDbAddress($this->session->database_server)) {
            $this->errors['db_server'] = 'L\'adresse de la base est invalide. (Ne peut pas contenir le caractère "/")';
        }
        if ($this->session->database_name && !Validate::isDbName($this->session->database_name)) {
            $this->errors['db_name'] = 'Le nom de la base est invalide. (Ne peut pas contenir le caractère "?")';
        }
        if ($this->session->database_login && !Validate::isDbLogin($this->session->database_login)) {
            $this->errors['db_login'] = 'L\'identifiant est invalide. (Ne peut pas contenir le caractère ":")';
        }
        if ($this->session->database_password && !Validate::isDbPassword($this->session->database_password)) {
            $this->errors['db_password'] = 'Le mot de passe est invalide. (Ne peut pas contenir le caractère "@")';
        }

        if (count($this->errors)) {
            return false;
        }

        $this->errors['db_connection'] = $this->model_database->testDatabaseSettings(
            $this->session->database_server,
            $this->session->database_name,
            $this->session->database_login,
            $this->session->database_password,
        );

        return count($this->errors['db_connection']) ? false : true;
    }

    public function process(): void
    {
        if (InstallerTools::getValue('checkDb')) {
            $this->processCheckDb();
        } elseif (InstallerTools::getValue('createDb')) {
            $this->processCreateDb();
        }
    }

    public function processCheckDb(): void
    {
        $server = InstallerTools::getValue('dbServer');
        $database = InstallerTools::getValue('dbName');
        $login = InstallerTools::getValue('dbLogin');
        $password = InstallerTools::getValue('dbPassword');

        $errors = $this->model_database->testDatabaseSettings($server, $database, $login, $password);

        $this->ajaxJsonAnswer(
            (count($errors)) ? false : true,
            (count($errors)) ? implode('<br />', $errors) : 'Database is connected'
        );
    }

    public function processCreateDb(): void
    {
        $server = InstallerTools::getValue('dbServer');
        $database = InstallerTools::getValue('dbName');
        $login = InstallerTools::getValue('dbLogin');
        $password = InstallerTools::getValue('dbPassword');

        $success = $this->model_database->createDatabase($server, $database, $login, $password);

        $this->ajaxJsonAnswer(
            $success,
            $success ? 'Database is created' : 'Cannot create the database automatically'
        );
    }

    public function display(): void
    {
        if ($this->session->database_server) {
            $this->database_server = $this->session->database_server;
            $this->database_name = $this->session->database_name;
            $this->database_login = $this->session->database_login;
            $this->database_password = $this->session->database_password;
        }

        $this->displayContent('database');
    }

    public function displayError(string $field): ?string
    {
        if (!isset($this->errors[$field])) {
            return null;
        }

        return '<span class="result errorTxt">' . $this->errors[$field] . '</span>';
    }
}
