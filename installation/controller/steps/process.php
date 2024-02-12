<?php

use Symfony\Component\Dotenv\Dotenv;
use TicketFactory\Installer\Classes\Install\Install;
use TicketFactory\Installer\Classes\Tools\InstallerTools;
use TicketFactory\Installer\Controller\InstallController\InstallController;

class InstallControllerProcess extends InstallController
{
    public Install $model_install;
    public $process_steps = [];

    private Dotenv $dotenv;

    public function init(): void
    {
        $this->model_install = new Install();
        $this->dotenv = new Dotenv();
    }

    public function validate(): bool
    {
        return false;
    }

    public function process(): bool
    {
        if (InstallerTools::getValue('endInstall')) {
            return true;
        }

        if (!$this->session->process_validated) {
            $this->session->process_validated = [];
        }

        if (file_exists(_TF_ROOT_DIR_ . '.env.local')) {
            $this->dotenv->overload(_TF_ROOT_DIR_ . '.env.local');
        }

        try {
            if (InstallerTools::getValue('generateEnvFile')) {
                $this->processGenerateEnvFile();
            } elseif (InstallerTools::getValue('installDatabase') && !empty($this->session->process_validated['generateEnvFile'])) {
                $this->processInstallDatabase();
            } elseif (InstallerTools::getValue('createAdminUser') && !empty($this->session->process_validated['installDatabase'])) {
                $this->processCreateAdminUser();
            }
        } catch (Exception $e) {
            $this->ajaxJsonAnswer(false, $e->getMessage());
        }
        return false;
    }

    public function processGenerateEnvFile()
    {
        $envFile = _TF_ROOT_DIR_ . '.env.local';

        if (!copy(_TF_ROOT_DIR_ . '.env', $envFile)) {
            $this->ajaxJsonAnswer(false);
        }
        if (strpos($this->session->database_server, ':') !== false) {
            list($host, $port) = explode(':', $this->session->database_server);
        } else {
            $host = $this->session->database_server;
            $port = 3306;
        }
        $success = $this->model_install->generateEnvFile(
            $envFile,
            $host,
            $port,
            $this->session->database_login,
            $this->session->database_password,
            $this->session->database_name
        );

        if (!$success) {
            $this->ajaxJsonAnswer(false);
        }
        $this->dotenv->overload(_TF_ROOT_DIR_ . '.env.local');
        $this->session->process_validated = array_merge($this->session->process_validated, ['generateEnvFile' => true]);
        $this->ajaxJsonAnswer(true);
    }

    public function processInstallDatabase()
    {
        if (!$this->model_install->installDatabase() || $this->model_install->getErrors()) {
            $this->ajaxJsonAnswer(false, $this->model_install->getErrors());
        }
        $this->session->process_validated = array_merge($this->session->process_validated, ['installDatabase' => true]);
        $this->ajaxJsonAnswer(true);
    }

    public function processCreateAdminUser()
    {
        $success = $this->model_install->createAdminUser(
            $this->session->admin_email,
            $this->session->admin_firstname,
            $this->session->admin_lastname,
            $this->session->admin_password,
        );
        if (!$success || $this->model_install->getErrors()) {
            $this->ajaxJsonAnswer(false, $this->model_install->getErrors());
        }
        $this->session->process_validated = array_merge($this->session->process_validated, ['createAdminUser' => true]);
        $this->ajaxJsonAnswer(true);
    }

    public function display(): void
    {
        $this->process_steps[] = ['key' => 'generateEnvFile', 'step' => 'Création du fichier d\'environemment'];
        $this->process_steps[] = ['key' => 'installDatabase', 'step' => 'Création des tables de la database'];
        $this->process_steps[] = ['key' => 'createAdminUser', 'step' => 'Création de l\'utilisateur administrateur'];

        if (!InstallerTools::getValue('endInstall')) {
            $this->displayContent('process');
        }
    }
}
