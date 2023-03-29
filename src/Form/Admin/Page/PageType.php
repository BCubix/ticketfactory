<?php

namespace App\Form\Admin\Page;

use App\Entity\Page\Page;
use App\Entity\Language\Language;
use App\Repository\LanguageRepository;
use App\Form\Admin\SEOAble\SEOAbleType;

use App\Repository\PageRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('title',                TextType::class,            [])
            ->add('subtitle',             TextareaType::class,        [])
            ->add('parent',               EntityType::class,          [
                'class'         => Page::class,
                'choice_label'  => 'title',
                'multiple'      => false,
                'query_builder' => function (PageRepository $pr) {
                    return $pr
                        ->createQueryBuilder('p')
                        ->orderBy('p.title', 'ASC')
                    ;
                }
            ])
            ->add('slug',                 TextType::class,            [])
            ->add('pageBlocks',           CollectionType::class,      [
                'entry_type'   => PageBlockType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
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
                'data_class' => Page::class,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Page::class,
        ]);
    }
}
