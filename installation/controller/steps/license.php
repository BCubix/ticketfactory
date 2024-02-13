<?php

use TicketFactory\Installer\Classes\Tools\InstallerTools;
use TicketFactory\Installer\Controller\InstallController\InstallController;

class InstallControllerLicense extends InstallController
{
    public function init(): void
    {
        $this->nextButton = false;
    }

    public function processNextStep(): void
    {
        $this->session->licence_agrement = (bool) InstallerTools::getValue('licence_agrement');
    }

    public function validate(): bool
    {
        $this->nextButton = (bool) $this->session->licence_agrement;
        return (bool) $this->session->licence_agrement;
    }

    public function display(): void
    {
        $this->displayContent('license');
    }
}
