<?php

use TicketFactory\Installer\Classes\Tools\InstallerTools;
use TicketFactory\Installer\Classes\Validate\Validate;
use TicketFactory\Installer\Controller\InstallController\InstallController;

class InstallControllerUser extends InstallController
{
    public function processNextStep(): void
    {
        $this->session->admin_firstname = trim(InstallerTools::getValue('admin_firstname'));
        $this->session->admin_lastname = trim(InstallerTools::getValue('admin_lastname'));
        $this->session->admin_email = trim(InstallerTools::getValue('admin_email'));
        $this->session->admin_structure = trim(InstallerTools::getValue('admin_structure'));

        // If password fields are empty, but are already stored in session, do not fill them again
        if (!$this->session->admin_password || trim(InstallerTools::getValue('admin_password'))) {
            $this->session->admin_password = trim(InstallerTools::getValue('admin_password'));
        }

        if (!$this->session->admin_password_confirm || trim(InstallerTools::getValue('admin_password_confirm'))) {
            $this->session->admin_password_confirm = trim(InstallerTools::getValue('admin_password_confirm'));
        }
    }

    public function validate(): bool
    {
        $required_fields = ['admin_firstname', 'admin_lastname', 'admin_email', 'admin_password', 'admin_password_confirm', 'admin_structure'];
        foreach ($required_fields as $field) {
            if (!is_string($this->session->$field) || strlen($this->session->$field) <= 0) {
                $this->errors[$field] = 'Champ requis';
            }
        }

        if ($this->session->admin_firstname && !Validate::isName($this->session->admin_firstname)) {
            $this->errors['admin_firstname'] = 'Le champ contient des caractères invalides';
        }

        if ($this->session->admin_lastname && !Validate::isName($this->session->admin_lastname)) {
            $this->errors['admin_lastname'] = 'Le champ contient des caractères invalides';
        }

        if ($this->session->admin_password) {
            if (!Validate::isPasswordValid($this->session->admin_password)) {
                $this->errors['admin_password'] = 'Le mot de passe est invalide';
            } elseif ($this->session->admin_password != $this->session->admin_password_confirm) {
                $this->errors['admin_password_confirm'] = 'Le champ de confirmation est différent du mot de passe';
            }
        }

        if ($this->session->admin_email && !Validate::isEmail($this->session->admin_email)) {
            $this->errors['admin_email'] = 'L\'adresse e-mail est invalide';
        }

        if ($this->session->admin_structure && !Validate::isStructureType($this->session->admin_structure)) {
            $this->errors['admin_structure'] = 'La valeur sélectionnée est invalide';
        }

        return count($this->errors) ? false : true;
    }

    public function display(): void
    {
        $this->displayContent('user');
    }

    public function displayError(string $field): ?string
    {
        if (!isset($this->errors[$field])) {
            return null;
        }

        return '<span class="result errorTxt">' . $this->errors[$field] . '</span>';
    }
}
