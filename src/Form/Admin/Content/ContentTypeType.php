<?php

namespace App\Form\Admin\Content;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Content\ContentType;
use App\Entity\Page\Page;
use App\Repository\PageRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeType extends AdminBaseFormType
{
    protected const ENTITY_CLASS = ContentType::class;

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('name',                 TextType::class,            [])
            ->add('pageType',             CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('displayBlocks',        CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('maxObjectNb',          IntegerType::class,         [])
            ->add('keyword',              TextType::class,            [])
            ->add('pageParent',           EntityType::class,          [
                'class'         => Page::class,
                'choice_label'  => 'title',
                'multiple'      => false,
                'query_builder' => function (PageRepository $pr) {
                    return $pr
                        ->createQueryBuilder('p')
                        ->orderBy('p.title', 'ASC');
                }
            ])
            ->add('fields',               CollectionType::class,      [
                'entry_type'   => ContentTypeFieldType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
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
            'data_class' => ContentType::class,
            'csrf_protection' => false
        ]);
    }
}
