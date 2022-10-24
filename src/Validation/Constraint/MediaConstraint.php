<?php

namespace App\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class FileConstraint extends Constraint
{
    public $sizeMessage = 'Le poids du fichier est trop important.';
    public $mimeMessage = 'Le type du fichier n\'est pas accepté.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
