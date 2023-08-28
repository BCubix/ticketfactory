<?php

namespace App\Form\Website\Event;

use App\Entity\Event\EventDate;
use App\Entity\Event\EventPrice;
use App\Repository\EventDateRepository;
use App\Repository\EventPriceRepository;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventReservationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $eventId = $options['eventId'];

        $builder
            ->add('eventDate',            EntityType::class,              [
                'label'         => "Date",
                'class'         => EventDate::class,
                'required'      => false,
                'multiple'      => false,
                'placeholder'   => "Date",
                'choice_label'  => 'id',
                'query_builder' => function (EventDateRepository $edr) use ($eventId) {
                    return $edr->findAllByEventForWebsiteOption($eventId);
                },
                'attr'          => ['class' => "form_input_hidden js-event-reservation-date-input"],
                'label_attr'    => ['class' => "form_label_hidden"],
            ])
            ->add('eventPrices',            CollectionType::class,            [
                'entry_type'    => EventReservationSeatsType::class,
                'entry_options' => ["eventId" => $eventId],
                'allow_add'     => true,
                'allow_delete'  => true,
                'delete_empty'  => true,
                'by_reference'  => false,
                'attr'          => ['class' => "form_input_hidden js-event-reservation-prices-list"],
            ])
            ->add('add',                 SubmitType::class,               [
                'label'         => 'Ajouter au panier',
                'label_html'    => true,
                "label"         => "<span><i class='icon icon-cart'></i> Ajouter au panier</span>",
                "attr"          => ["class" => "submit-button"]
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
