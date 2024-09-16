<?php

namespace App\Form\Admin\Product;

use App\Entity\Product\ProductCategory;
use App\Entity\Language\Language;
use App\Form\Admin\AdminBaseFormType;
use App\Form\Admin\SEOAble\SEOAbleType;
use App\Repository\ProductCategoryRepository;
use App\Repository\LanguageRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductCategoryType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('name',                 TextType::class,            [])
            ->add('slug',                 TextType::class,            [])
            ->add('keyword',              TextType::class,            [])
            ->add('parent',               EntityType::class,          [
                'class'         => ProductCategory::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (ProductCategoryRepository $ecr) {
                    return $ecr
                        ->createQueryBuilder('ec')
                        ->orderBy('ec.name', 'ASC');
                }
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
                'data_class' => ProductCategory::class,
            ]);

            $builder->addEventListener(
                FormEvents::PRE_SET_DATA,
                function (FormEvent $event) {
                    $this->fm->onPreSetData($event);
                }
            );
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ProductCategory::class,
            'csrf_protection' => false
        ]);
    }
}
