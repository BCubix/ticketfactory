<?php

namespace App\Form\Admin\Media;

use App\Entity\Media\Media;
use App\Entity\Media\MediaCategory;
use App\Repository\MediaRepository;
use App\Repository\MediaCategoryRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MediaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('alt',                  TextType::class,            [])
            ->add('description',          TextType::class,            [])
            ->add('legend',               TextType::class,            [])
            ->add('title',                TextType::class,            [])
            ->add('subtitle',             TextType::class,            [])
            ->add('mainCategory',         EntityType::class,          [
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
            ->add('mediaCategories',      EntityType::class,          [
                'class'         => MediaCategory::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'query_builder' => function (MediaCategoryRepository $mcr) {
                    return $mcr
                        ->createQueryBuilder('mc')
                        ->orderBy('mc.name', 'ASC')
                    ;
                }
            ])
            ->add('thumbnail',             EntityType::class,          [
                'class'         => Media::class,
                'choice_label'  => 'media',
                'multiple'      => false,
                'query_builder' => function (MediaRepository $mr) {
                    return $mr
                        ->createQueryBuilder('m')
                        ->orderBy('m.title', 'ASC')
                    ;
                }
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Media::class,
        ]);
    }
}
