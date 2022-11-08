<?php

namespace App\Validation\Validator;

use App\Entity\Event\EventDate;
use App\Validation\Constraint\EventDateConstraint;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

#[\Attribute]
class EventDateValidator extends ConstraintValidator
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function validate(mixed $object, Constraint $constraint): void
    {
        if (!$object instanceof EventDate) {
            throw new UnexpectedValueException($receipt, EventDate::class);
        }

        if (!$constraint instanceof EventDateConstraint) {
            throw new UnexpectedTypeException($constraint, EventDateConstraint::class);
        }

        if (empty($value)) {
            return;
        }

        $eventDates = $this->em->getRepository(EventDate::class)->findDuplicatesForAdmin($object);

        if (count($eventDates) > 0) {
            $this->context
                ->buildViolation($constraint->message)
                ->atPath('eventDate')
                ->addViolation()
            ;
        }
    }
}
