<?php

namespace App\Form\Website\Event;

use App\Entity\Event\EventDate;
use App\Entity\Event\EventPrice;
use App\Repository\EventDateRepository;
use App\Repository\EventPriceRepository;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventReservationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $eventId = $options['eventId'];

        $builder
            ->add('eventDate',            EntityType::class,               [
                'label'         => "Date",
                'class'         => EventDate::class,
                'required'      => true,
                'multiple'      => false,
                'placeholder'   => "Date",
                'choice_label'  => 'id',
                'query_builder' => function (EventDateRepository $edr) use ($eventId) {
                    return $edr->findAllByEventForWebsiteOption($eventId);
                },
                'attr'           => ['class' => "form_input_hidden js-event-reservation-date-input"],
                'label_attr'     => ['class' => "form_label_hidden"]
            ])
            ->add('eventPrice',            EntityType::class,               [
                'label'         => "Prix",
                'class'         => EventPrice::class,
                'choice_label'  => 'id',
                'required'      => true,
                'multiple'      => false,
                'placeholder'   => "Prix",
                'query_builder' => function (EventPriceRepository $epr) use ($eventId) {
                    return $epr->findAllByEventForWebsiteOption($eventId);
                },
                'attr'           => ['class' => "form_input_hidden js-event-reservation-price-input"],
                'label_attr'     => ['class' => "form_label_hidden"]
            ])
            ->add('quantity',             NumberType::class,           [
                'label' => 'Quantité',
                'required' => true
            ])
            ->add('add',                 SubmitType::class,               [
                'label' => 'Ajouter au panier'
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null,
            'eventId' => null,
        ]);
    }
}
