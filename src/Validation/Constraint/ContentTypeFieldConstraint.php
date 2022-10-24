<?php

namespace App\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class ContentTypeFieldConstraint extends Constraint
{
    public $typeMessage = 'Le type de champ n\'est pas reconnu.';
    public $parametersMessage = 'Certains paramètres n\'ont pas été renseignés.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
