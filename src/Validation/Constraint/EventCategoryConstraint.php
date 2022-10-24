<?php

namespace App\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class EventCategoryConstraint extends Constraint
{
    public $message = 'Impossible de rattacher cette catégorie comme parent ; cela crée une boucle dans l\'arborescence.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
