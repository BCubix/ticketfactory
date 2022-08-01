<?php

namespace App\Form\Admin;

use App\Entity\Event;
use App\Entity\EventCategory;
use App\Entity\Room;
use App\Entity\Season;
use App\Repository\EventCategoryRepository;
use App\Repository\RoomRepository;
use App\Repository\SeasonRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('name',                 TextType::class,            [])
            ->add('description',          TextareaType::class,        [])
            ->add('eventDates',           CollectionType::class,      [
                'entry_type'   => EventDateType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
            ->add('eventPrices',          CollectionType::class,      [
                'entry_type'   => EventPriceType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
            ->add('eventCategory',        EntityType::class,          [
                'class'         => EventCategory::class,
                'choice_label'  => 'name',
                'expanded'      => false,
                'multiple'      => false,
                'query_builder' => function (EventCategoryRepository $ecr) {
                    return $ecr
                        ->createQueryBuilder('ec')
                        ->orderBy('ec.name', 'ASC')
                    ;
                }
            ])
            ->add('room',                 EntityType::class,          [
                'class'         => Room::class,
                'choice_label'  => 'name',
                'expanded'      => false,
                'multiple'      => false,
                'query_builder' => function (RoomRepository $rr) {
                    return $rr
                        ->createQueryBuilder('r')
                        ->orderBy('r.name', 'ASC')
                    ;
                }
            ])
            ->add('season',               EntityType::class,          [
                'class'         => Season::class,
                'choice_label'  => 'name',
                'expanded'      => false,
                'multiple'      => false,
                'query_builder' => function (SeasonRepository $sr) {
                    return $sr
                        ->createQueryBuilder('s')
                        ->orderBy('s.name', 'ASC')
                    ;
                }
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Event::class,
        ]);
    }
}
