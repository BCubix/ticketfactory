<?php

namespace App\Validation\Validator;

use App\Entity\Menu\MenuEntry;
use App\Validation\Constraint\MenuEntryConstraint;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

#[\Attribute]
class MenuEntryValidator extends ConstraintValidator
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function validate(mixed $object, Constraint $constraint): void
    {
        if (!$object instanceof MenuEntry) {
            throw new UnexpectedValueException($receipt, MenuEntry::class);
        }

        if (!$constraint instanceof MenuEntryConstraint) {
            throw new UnexpectedTypeException($constraint, MenuEntryConstraint::class);
        }

        if (empty($value)) {
            return;
        }

        if ($object->getMenuType() == 'external' && !is_string($object->getValue())) {
            $this->context
                ->buildViolation($constraint->externalMessage)
                ->atPath('value')
                ->addViolation()
            ;

            return;
        }

        if ($object->getMenuType() == 'none' && !empty($object->getValue())) {
            $this->context
                ->buildViolation($constraint->noneMessage)
                ->atPath('value')
                ->addViolation()
            ;

            return;
        }

        $element = null;
        if (isset(MenuEntry::TYPES_MAPPING[$object->getMenuType()])) {
            $className = MenuEntry::TYPES_MAPPING[$object->getMenuType()];
            $element = $this->em->getRepository($className)->findOneForAdmin($object->getValue());
        }

        if (null === $element) {
            $this->context
                ->buildViolation($constraint->entityMessage)
                ->atPath('value')
                ->addViolation()
            ;
        }
    }
}
