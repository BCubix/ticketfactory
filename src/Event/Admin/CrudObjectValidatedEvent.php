<?php

namespace App\Event\Admin;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * The object.validated event is dispatched each time an object accessible
 * in a CRUD controller is validated
 */
class CrudObjectValidatedEvent extends Event
{
    public const NAME = 'tf.object.validated';

    protected $object;

    public function __construct(Object $object)
    {
        $this->object = $object;
    }

    public function getObject(): Object
    {
        return $this->object;
    }
}
