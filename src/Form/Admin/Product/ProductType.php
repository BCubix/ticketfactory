<?php

namespace App\Form\Admin\Product;

use App\Entity\Product\Product;
use App\Entity\Product\ProductCategory;
use App\Entity\Language\Language;
use App\Form\Admin\Feature\FeatureLinkType;
use App\Form\Admin\SEOAble\SEOAbleType;
use App\Repository\ProductCategoryRepository;
use App\Repository\LanguageRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',                 CheckboxType::class,        ['false_values' => ['0']])
            ->add('name',                   TextType::class,            [])
            ->add('slug',                   TextType::class,            [])
            ->add('chapo',                  TextareaType::class,        [])
            ->add('description',            TextareaType::class,        [])
            ->add('price',                  MoneyType::class,           [])
            ->add('mainCategory',           EntityType::class,          [
                'class'         => ProductCategory::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (ProductCategoryRepository $ecr) {
                    return $ecr
                        ->createQueryBuilder('ec')
                        ->orderBy('ec.name', 'ASC');
                }
            ])
            ->add('productCategories',      EntityType::class,          [
                'class'         => ProductCategory::class,
                'choice_label'  => 'name',
                'multiple'      => true,
                'query_builder' => function (ProductCategoryRepository $ecr) {
                    return $ecr
                        ->createQueryBuilder('ec')
                        ->orderBy('ec.name', 'ASC');
                }
            ])
            ->add('featureLinks',           CollectionType::class,      [
                'entry_type'   => FeatureLinkType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
            ->add('productMedias',          CollectionType::class,      [
                'entry_type'    => ProductMediaType::class,
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
                        ->orderBy('l.name', 'ASC');
                }
            ])
            ->add('languageGroup',        UuidType::class,            [])
            ->add('seo',                  SEOAbleType::class,         [
                'data_class' => Product::class,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
            'csrf_protection' => false
        ]);
    }
}
