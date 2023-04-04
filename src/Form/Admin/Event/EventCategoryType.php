<?php

namespace App\Form\Admin\Event;

use App\Entity\Event\EventCategory;
use App\Entity\Language\Language;
use App\Repository\EventCategoryRepository;
use App\Repository\LanguageRepository;
use App\Form\Admin\SEOAble\SEOAbleType;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventCategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('name',                 TextType::class,            [])
            ->add('slug',                 TextType::class,            [])
            ->add('keyword',              TextType::class,            [])
            ->add('parent',               EntityType::class,          [
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
                'data_class' => EventCategory::class,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => EventCategory::class,
        ]);
    }
}
