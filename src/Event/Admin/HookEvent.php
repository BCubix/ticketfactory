<?php

namespace App\Event\Admin;

class HookEvent
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
}