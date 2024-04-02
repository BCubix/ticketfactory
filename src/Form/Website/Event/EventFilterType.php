<?php

namespace App\Form\Website\Event;

use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Entity\Event\Season;
use App\Form\Website\WebsiteBaseFormType;
use App\Repository\EventCategoryRepository;
use App\Repository\RoomRepository;
use App\Repository\SeasonRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventFilterType extends WebsiteBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $sort = $options['sort'];
        $filterParams = $options['filterParams'];

        if ($filterParams['beginDateFilter']) {
            $builder->add('beginDate',                 DateType::class,                 [
                'label'          => "A partir du :",
                'label_attr'     => ['class' => 'filters_label'],
                'required'       => false,
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'dd/MM/yyyy',
                'html5'          => false,
                'attr'           => ['placeholder' => 'JJ/MM/YYYY', 'class' => 'filters_input datepicker']
            ]);
        }

        if ($filterParams['endDateFilter']) {
            $builder->add('endDate',                   DateType::class,                 [
                'label'          => "Jusqu'au :",
                'label_attr'     => ['class' => 'filters_label'],
                'required'       => false,
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'dd/MM/yyyy',
                'html5'          => false,
                'attr'           => ['placeholder' => 'JJ/MM/YYYY', 'class' => 'filters_input datepicker']
            ]);
        }

        if ($filterParams['categoryFilter']) {
            $builder->add('category',                  EntityType::class,               [
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
            ]);
        }

        if ($filterParams['roomFilter']) {
            $builder->add('room',                      EntityType::class,               [
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
            ]);
        }

        if ($filterParams['seasonFilter']) {
            $builder->add('season',                    EntityType::class,               [
                'label'         => "Saison :",
                'label_attr'    => ['class' => 'filters_label'],
                'class'         => Season::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'placeholder'   => "Toutes les saisons",
                'query_builder' => function (SeasonRepository $rr) {
                    return $rr
                        ->createQueryBuilder('r')
                        ->orderBy('r.name', 'ASC');
                }
            ]);
        }

        $builder->add('sort',                     ChoiceType::class,               [
            'label'       => " ",
            'required'    => false,
            'multiple'    => false,
            'expanded'    => false,
            'placeholder' => "Tri",
            'choices'     => $sort
        ]);

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function (FormEvent $event) {
                $this->fm->onPreSetData($event, "WebsiteEventFilter");
            }
        );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class'        => null,
            'csrf_protection'   => false,
            'sort'              => [],
            'filterParams'      => []
        ]);
    }
}
