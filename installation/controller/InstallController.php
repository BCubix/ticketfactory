<?php

namespace TicketFactory\Installer\Controller\InstallController;

use TicketFactory\Installer\Classes\Exception\InstallerException;
use TicketFactory\Installer\Classes\Session\InstallSession;
use TicketFactory\Installer\Classes\StepList\StepList;
use TicketFactory\Installer\Classes\Tools\InstallerTools;

class InstallController
{
    public InstallSession $session;
    public array $errors = [];
    public bool $nextButton = true;
    public bool $previousButton = true;

    protected static ?StepList $steps = null;
    protected string $content;
    protected string $step;

    private array $stepConfig = [
        [
            'name' => 'license',
            'displayName' => 'Licence',
            'controllerName' => 'InstallControllerLicense',
        ],
        [
            'name' => 'requirement',
            'displayName' => 'Prérequis système',
            'controllerName' => 'InstallControllerRequirement',
        ],
        [
            'name' => 'user',
            'displayName' => 'Création de l\'utilisateur admin',
            'controllerName' => 'InstallControllerUser',
        ],
        [
            'name' => 'database',
            'displayName' => 'Configuration de la base de données',
            'controllerName' => 'InstallControllerDatabase',
        ],
        [
            'name' => 'process',
            'displayName' => 'Installation',
            'controllerName' => 'InstallControllerProcess',
        ],
    ];


    public function __construct()
    {
        $this->session = InstallSession::getInstance();

        if (empty(self::getSteps())) {
            $this->initSteps();
        }

        $this->init();
    }

    final public static function execute()
    {
        $self = new static();

        $session = InstallSession::getInstance();
        if (empty($session->lastStep)) {
            $session->lastStep = self::getSteps()->current()->getName();
        }

        // Get current step
        if (InstallerTools::getValue('step')) {
            self::getSteps()->setOffsetFromStepName(InstallerTools::getValue('step'));
            $session->step = self::getSteps()->current()->getName();
        } elseif (!empty($session->step)) {
            self::getSteps()->setOffsetFromStepName($session->step);
        }

        // Validate all steps until current step. If step is not valid, use it as current step.
        foreach (self::getSteps() as $key => $checkStep) {
            if (self::getSteps()->current() == $checkStep) {
                break;
            }

            if (!$checkStep->getControllerInstance()->validate()) {
                self::getSteps()->setOffset($key);
                $session->step = $session->lastStep = self::getSteps()->current()->getName();
                break;
            }
        }

        if (InstallerTools::getValue('submitNext')) {
            self::getSteps()->current()->getControllerInstance()->processNextStep();

            if (self::getSteps()->current()->getControllerInstance()->validate()) {
                self::getSteps()->next();
            }

            $session->step = self::getSteps()->current()->getName();

            if (self::getSteps()->getOffset() > $self->getStepOffset($session->lastStep)) {
                $session->lastStep = self::getSteps()->current()->getName();
            }
        } elseif (InstallerTools::getValue('submitPrevious') && !$self->isFirstStep()) {
            self::getSteps()->previous();
            $session->step = self::getSteps()->current()->getName();
        }

        if (self::getSteps()->current()->getControllerInstance()->process()) {
            return true;
        }
        self::getSteps()->current()->getControllerInstance()->display();
        return false;
    }

    public function setCurrentStep($step)
    {
        $this->step = $step;

        return $this;
    }

    public function display(): void
    {
    }

    public function validate(): bool
    {
        return true;
    }

    public function init(): void
    {
    }

    public function process(): bool
    {
        return false;
    }

    public function processNextStep(): void
    {
    }

    public static function getSteps(): ?StepList
    {
        return static::$steps;
    }

    public function getLastStep()
    {
        return $this->session->last_step;
    }

    public function getStepOffset($step)
    {
        return self::getSteps()->getOffsetFromStepName($step);
    }

    public function redirect(string $step)
    {
        header('location: index.php?step=' . $step);
        exit;
    }

    public function isFirstStep()
    {
        return self::getSteps()->isFirstStep();
    }

    public function isLastStep()
    {
        return self::getSteps()->isLastStep();
    }

    public function isStepFinished(string $step): bool
    {
        return $this->getStepOffset($step) < self::getSteps()->getOffset();
    }

    /**
     * Send AJAX response in JSON format {success: bool, message: string}
     *
     * @param bool $success
     * @param string $message
     */
    public function ajaxJsonAnswer(bool $success, $message = ''): void
    {
        if (!$success && empty($message)) {
            $message = print_r(@error_get_last(), true);
        }

        die(json_encode([
            'success' => (bool) $success,
            'message' => $message,
        ]));
    }

    /**
     * Display a template
     *
     * @param string $template Template name
     */
    public function getTemplate(string $template): string
    {
        $path = _TF_INSTALL_PATH_ . 'theme/views/';

        if (file_exists($path . $template . '.php')) {
            return $this->renderTemplate($path, $template);
        }

        throw new InstallerException("Template '{$template}.php' not found");
    }

    public function displayContent(string $content): void
    {
        $this->setContent($this->getTemplate($content));
        echo $this->getTemplate('layout');
    }

    protected function setContent(string $content): void
    {
        $this->content = $content;
    }

    protected function getContent(): string
    {
        return $this->content;
    }

    protected function renderTemplate(string $path, string $template): string
    {
        ob_start();

        include $path . $template . '.php';

        $content = ob_get_contents();
        if (ob_get_level() && ob_get_length() > 0) {
            ob_end_clean();
        }

        return $content;
    }

    private function initSteps()
    {
        static::$steps = new StepList($this->stepConfig);
    }
}
