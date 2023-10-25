<?php

namespace App\Form\Website\Event;

use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Repository\EventCategoryRepository;
use App\Repository\RoomRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventFilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $months = $options['months'];
        $sort = $options['sort'];

        $builder
            ->add('month',                     ChoiceType::class,               [
                'label'       => " ",
                'required'    => false,
                'multiple'    => false,
                'expanded'    => false,
                'placeholder' => "Par Date",
                'choices'     => $months
            ])
            ->add('category',                  EntityType::class,               [
                'label'         => " ",
                'class'         => EventCategory::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'placeholder'   => "Par Catégorie",
                'query_builder' => function (EventCategoryRepository $ecr) {
                    return $ecr
                        ->createQueryBuilder('ec')
                        ->where('ec.lvl > 0')
                        ->orderBy('ec.name', 'ASC');
                }
            ])
            ->add('room',                      EntityType::class,               [
                'label'         => " ",
                'class'         => Room::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'placeholder' => "Par Salle",
                'query_builder' => function (RoomRepository $rr) {
                    return $rr
                        ->createQueryBuilder('r')
                        ->orderBy('r.name', 'ASC');
                }
            ])
            ->add('sort',                     ChoiceType::class,               [
                'label'       => " ",
                'required'    => false,
                'multiple'    => false,
                'expanded'    => false,
                'placeholder' => "Tri",
                'choices'     => $sort
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => null,
            'months' => [],
            'sort' => []
        ]);
    }
}
