<?php

namespace App\Form\Admin\Product;

use App\Entity\Product\Product;
use App\Entity\Product\ProductCategory;
use App\Entity\Language\Language;
use App\Entity\Ticketing\Ticketing;
use App\Form\Admin\AdminBaseFormType;
use App\Form\Admin\Feature\FeatureLinkType;
use App\Form\Admin\SEOAble\SEOAbleType;
use App\Repository\ProductCategoryRepository;
use App\Repository\LanguageRepository;
use App\Repository\TicketingRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',                 CheckboxType::class,        ['false_values' => ['0']])
            ->add('name',                   TextType::class,            [])
            ->add('slug',                   TextType::class,            [
                'empty_data' => '',
            ])
            ->add('chapo',                  TextareaType::class,        [])
            ->add('description',            TextareaType::class,        [])
            ->add('ticketingReference',     TextType::class,            [])
            ->add('displayBuyingButton',    CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
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
            ->add('ticketing',                   EntityType::class,          [
                'class'         => Ticketing::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (TicketingRepository $tr) {
                    return $tr
                        ->createQueryBuilder('t')
                        ->orderBy('t.name', 'ASC');
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
                'data_class' => Product::class,
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
            'data_class' => Product::class,
            'csrf_protection' => false
        ]);
    }
}
