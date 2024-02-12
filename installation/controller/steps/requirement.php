<?php

use TicketFactory\Installer\Classes\Requirements\Requirements;
use TicketFactory\Installer\Controller\InstallController\InstallController;

class InstallControllerRequirement extends InstallController
{
    public $tests = [];
    public $testsRender = [
        'phpversion' => 'Version de PHP inférieur à ' . _PHP_MIN_VERSION_,
        'system' => 'Impossibilité de créer de nouveaux fihiers ou dossiers',
        'root_dir' => 'Permissions d\'écriture dans le dossier racine manquantes',
    ];

    public function validate(): bool
    {
        if (0 === count($this->tests)) {
            $this->tests = Requirements::checkRequirements();
        }

        return $this->tests['success'];
    }

    public function process(): void
    {
        $this->tests = Requirements::checkRequirements();
    }

    public function display(): void
    {
        // If tests failed, disable next button
        if (!$this->tests['success']) {
            $this->nextButton = false;
        }

        $this->displayContent('requirement');
    }
}
