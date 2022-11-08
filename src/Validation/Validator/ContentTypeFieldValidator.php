<?php

namespace App\Validation\Validator;

use App\Entity\Content\ContentTypeField;
use App\Manager\ContentTypeManager;
use App\Validation\Constraint\ContentTypeFieldConstraint;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

#[\Attribute]
class ContentTypeFieldValidator extends ConstraintValidator
{
    private $ctm;

    public function __construct(ContentTypeManager $ctm)
    {
        $this->ctm = $ctm;
    }

    public function validate(mixed $object, Constraint $constraint): void
    {
        if (!$object instanceof ContentTypeField) {
            throw new UnexpectedValueException($receipt, ContentTypeField::class);
        }

        if (!$constraint instanceof ContentTypeFieldConstraint) {
            throw new UnexpectedTypeException($constraint, ContentTypeFieldConstraint::class);
        }

        if (empty($value)) {
            return;
        }

        $contentTypes = array_keys($this->ctm->getFieldsSelect());
        if (!in_array($this->getType(), $contentTypes)) {
            $this->context
                ->buildViolation($constraint->typeMessage)
                ->atPath('type')
                ->addViolation()
            ;
        }

        $component = $this->ctm->getContentTypeFieldFromType($object->getType());
        $expectedParameters = $component::getParameters();
        foreach ($expectedParameters as $expectedParameterKey => $expectedParameterValue) {
            $parameterFound = false;

            foreach ($object->getParameters() as $effectiveParameter) {
                if ($effectiveParameter->getName() == $expectedParameterKey) {
                    $parameterFound = true;
                    break;
                }
            }

            if (!$parameterFound) {
                $this->context
                    ->buildViolation($constraint->parametersMessage)
                    ->atPath('parameters')
                    ->addViolation()
                ;
            }
        }
    }
}
