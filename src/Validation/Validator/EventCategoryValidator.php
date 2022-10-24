<?php

namespace App\Validation\Validator;

use App\Entity\Event\EventCategory;
use App\Validation\Constraint\EventCategoryConstraint;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

#[\Attribute]
class EventCategoryValidator extends ConstraintValidator
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function validate(mixed $object, Constraint $constraint): void
    {
        if (!$object instanceof EventCategory) {
            throw new UnexpectedValueException($receipt, EventCategory::class);
        }

        if (!$constraint instanceof EventCategoryConstraint) {
            throw new UnexpectedTypeException($constraint, EventCategoryConstraint::class);
        }

        if (empty($value)) {
            return;
        }

        $parentId = $value->getParent()->getId();

        $childrenCategories = $this->em->getRepository(EventCategory::class)->getChildren($value, false, null, 'asc', true);
        foreach ($childrenCategories as $category) {
            if ($category->getId() == $parentId) {
                $this->context
                    ->buildViolation($constraint->message)
                    ->atPath('parent')
                    ->addViolation()
                ;
            }
        }
    }
}
