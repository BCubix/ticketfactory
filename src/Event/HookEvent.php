<?php

namespace App\Event;

use Symfony\Contracts\EventDispatcher\Event;

class HookEvent extends Event
{
    public const NAME = 'tf.hook';

    private $params;
    private $responses;

    public function __construct(array $params)
    {
        $this->params = $params;
        $this->responses = [];
    }

    public function getParams(): array
    {
        return $this->params;
    }

    public function getParam(string $paramName): mixed
    {
        return !isset($this->params[$paramName]) ? null : $this->params[$paramName];
    }

    public function addResponse($response)
    {
        $this->responses[] = $response;
    }

    public function getResponses()
    {
        return $this->responses;
    }
}
