<?php

namespace App\Form\Admin\Event;

use App\Form\Admin\SEOAble\SEOAbleType;

use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Entity\Event\Season;
use App\Entity\Event\Tag;
use App\Entity\Language\Language;
use App\Repository\EventCategoryRepository;
use App\Repository\RoomRepository;
use App\Repository\SeasonRepository;
use App\Repository\TagRepository;
use App\Repository\LanguageRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
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
            ->add('slug',                 TextType::class,            [])
            ->add('chapo',                TextareaType::class,        [])
            ->add('description',          TextareaType::class,        [])
            ->add('eventDateBlocks',      CollectionType::class,      [
                'entry_type'   => EventDateBlockType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
            ->add('eventPriceBlocks',     CollectionType::class,      [
                'entry_type'   => EventPriceBlockType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
            ->add('mainCategory',         EntityType::class,          [
                'class'         => EventCategory::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (EventCategoryRepository $ecr) {
                    return $ecr
                        ->createQueryBuilder('ec')
                        ->orderBy('ec.name', 'ASC')
                    ;
                }
            ])
            ->add('eventCategories',      EntityType::class,          [
                'class'         => EventCategory::class,
                'choice_label'  => 'name',
                'multiple'      => true,
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
                'multiple'      => false,
                'query_builder' => function (SeasonRepository $sr) {
                    return $sr
                        ->createQueryBuilder('s')
                        ->orderBy('s.name', 'ASC')
                    ;
                }
            ])
            ->add('tags',                 EntityType::class,          [
                'class'         => Tag::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'query_builder' => function (TagRepository $tr) {
                    return $tr
                        ->createQueryBuilder('t')
                        ->orderBy('t.name', 'ASC')
                    ;
                }
            ])
            ->add('eventMedias',          CollectionType::class,      [
                'entry_type'    => EventMediaType::class,
                'allow_add'     => true,
                'allow_delete'  => true,
                'delete_empty'  => true,
                'by_reference'  => false
            ])
            ->add('lang',                 EntityType::class,          [
                'class'         => Language::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (LanguageRepository $lr) {
                    return $lr
                        ->createQueryBuilder('l')
                        ->orderBy('l.name', 'ASC')
                    ;
                }
            ])
            ->add('languageGroup',        UuidType::class,            [])
            ->add('seo',                  SEOAbleType::class,         [
                'data_class' => Event::class,
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
