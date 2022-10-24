<?php

namespace App\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class EventDateConstraint extends Constraint
{
    public $message = 'Un événement est déjà déclaré à cette date là dans la même salle.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
