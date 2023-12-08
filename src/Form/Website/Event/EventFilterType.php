<?php

namespace App\Form\Website\Event;

use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Repository\EventCategoryRepository;
use App\Repository\RoomRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventFilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $months = $options['months'];
        $sort = $options['sort'];

        $builder
            ->add('beginDate',                 DateType::class,                 [
                'label'          => "A partir du :",
                'label_attr'     => ['class' => 'filters_label'],
                'required'       => false,
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'dd/MM/yyyy',
                'html5'          => false,
                'attr'           => ['placeholder' => 'JJ/MM/YYYY', 'class' => 'filters_input datepicker']
            ])
            ->add('endDate',                   DateType::class,                 [
                'label'          => "Jusqu'au :",
                'label_attr'     => ['class' => 'filters_label'],
                'required'       => false,
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'dd/MM/yyyy',
                'html5'          => false,
                'attr'           => ['placeholder' => 'JJ/MM/YYYY', 'class' => 'filters_input datepicker']
            ])
            ->add('month',                     ChoiceType::class,               [
                'label'       => " ",
                'label_attr'    => ['class' => 'filters_label'],
                'required'    => false,
                'multiple'    => false,
                'expanded'    => false,
                'placeholder' => "Par Date",
                'choices'     => $months
            ])
            ->add('category',                  EntityType::class,               [
                'label'         => "Du genre :",
                'label_attr'    => ['class' => 'filters_label'],
                'class'         => EventCategory::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'expanded'      => true,
                'placeholder'   => "Toutes les catégories",
                'query_builder' => function (EventCategoryRepository $ecr) {
                    return $ecr
                        ->createQueryBuilder('ec')
                        ->where('ec.lvl > 0')
                        ->orderBy('ec.name', 'ASC');
                }
            ])
            ->add('room',                      EntityType::class,               [
                'label'         => "Dans la salle :",
                'label_attr'    => ['class' => 'filters_label'],
                'class'         => Room::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'placeholder'   => "Toutes les salles",
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
