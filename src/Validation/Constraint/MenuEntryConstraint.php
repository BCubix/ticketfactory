<?php

namespace App\Validation\Constraint;

use App\Validation\Validator\MenuEntryValidator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class MenuEntryConstraint extends Constraint
{
    public $entityMessage = 'L\'entrée de menu doit pointer vers un objet valide.';
    public $externalMessage = 'L\'entrée de menu est de type URL externe : un lien doit être renseigné.';
    public $noneMessage = 'L\'entrée de menu est de type none : aucune valeur ne doit être renseignée.';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }

    public function validatedBy()
    {
        return MenuEntryValidator::class;
    }
}
