<?php

namespace App\Form\Admin\Content;

use App\Entity\Content\ContentType;
use App\Entity\Page\Page;
use App\Repository\PageRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('name',                 TextType::class,            [])
            ->add('pageType',             CheckboxType::class,        ['false_values' => ['0']])
            ->add('displayBlocks',        CheckboxType::class,        ['false_values' => ['0']])
            ->add('maxObjectNb',          IntegerType::class,         [])
            ->add('keyword',              TextType::class,            [])
            ->add('pageParent',           EntityType::class,          [
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
            ->add('fields',               CollectionType::class,      [
                'entry_type'   => ContentTypeFieldType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ContentType::class
        ]);
    }
}
