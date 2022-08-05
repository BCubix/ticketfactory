<?php

namespace App\Event\Admin;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * The object.instantiated event is dispatched each time an object accessible
 * in a CRUD controller is instantiated
 */
class CrudObjectInstantiatedEvent extends Event
{
    public const NAME = 'tf.object.instantiated';

    protected $object;
    protected $state;

    public function __construct(Object $object, string $state)
    {
        $this->object = $object;
        $this->state = $state;
    }

    public function getObject(): Object
    {
        return $this->object;
    }

    public function getState(): string
    {
        return $this->state;
    }
}
