<?php

namespace App\Validation\Constraint;

use App\Validation\Validator\EventDateValidator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class EventDateConstraint extends Constraint
{
    public $message = 'Un événement est déjà déclaré à cette date là dans la même salle.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }

    public function validatedBy()
    {
        return EventDateValidator::class;
    }
}
