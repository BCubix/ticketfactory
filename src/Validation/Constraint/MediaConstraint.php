<?php

namespace App\Validation\Constraint;

use App\Validation\Validator\MediaValidator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class MediaConstraint extends Constraint
{
    public $sizeMessage = 'Le poids du fichier est trop important.';
    public $mimeMessage = 'Le type du fichier n\'est pas accepté.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }

    public function validatedBy()
    {
        return MediaValidator::class;
    }
}
