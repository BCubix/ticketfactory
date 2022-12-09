<?php

namespace App\Event\Admin;

use Symfony\Contracts\EventDispatcher\Event;

class HookEvent extends Event
{
    public const NAME = 'tf.hook';

    private $params;

    public function __construct(array $params)
    {
        $this->params = $params;
    }

    public function getParams(): array
    {
        return $this->params;
    }

    public function getParam(string $paramName): mixed
    {
        return !isset($this->params[$paramName]) ? null : $this->params[$paramName];
    }
}