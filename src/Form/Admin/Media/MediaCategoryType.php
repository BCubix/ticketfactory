<?php

namespace App\Form\Admin\Media;

use App\Entity\Language\Language;
use App\Entity\Media\MediaCategory;
use App\Repository\LanguageRepository;
use App\Repository\MediaCategoryRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MediaCategoryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('name',                 TextType::class,            [])
            ->add('shortDescription',     TextType::class,            [])
            ->add('slug',                 TextType::class,            [])
            ->add('keyword',              TextType::class,            [])
            ->add('parent',               EntityType::class,          [
                'class'         => MediaCategory::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (MediaCategoryRepository $mcr) {
                    return $mcr
                        ->createQueryBuilder('mc')
                        ->orderBy('mc.name', 'ASC')
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
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => MediaCategory::class,
        ]);
    }
}
