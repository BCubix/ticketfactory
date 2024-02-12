<?php

namespace TicketFactory\Installer\Classes\Step;

use TicketFactory\Installer\Classes\Exception\InstallerException;

class Step
{
    protected string $name;
    protected string $displayName;
    protected string $controllerName;
    protected ?object $instance = null;

    public function __toString(): string
    {
        return (string) $this->displayName;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getdisplayName(): string
    {
        return $this->displayName;
    }

    public function getControllerName(): string
    {
        return $this->controllerName;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function setDisplayName(string $displayName): self
    {
        $this->displayName = $displayName;

        return $this;
    }

    public function setControllerName(string $controllerName): self
    {
        $this->controllerName = $controllerName;

        return $this;
    }

    public function getControllerInstance(): object
    {
        if (null == $this->instance) {
            if (!file_exists(_TF_INSTALL_CONTROLLERS_PATH_ . 'steps/' . $this->name . '.php')) {
                throw new InstallerException("Controller file '{$this->name}.php' not found");
            }

            require_once _TF_INSTALL_CONTROLLERS_PATH_ . 'steps/' . $this->name . '.php';

            $this->instance = new $this->controllerName();
        }

        return $this->instance;
    }
}
