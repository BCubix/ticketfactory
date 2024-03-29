<?php

namespace App\Form\Admin\Menu;

use App\Entity\Menu\MenuEntry;
use App\Entity\Language\Language;
use App\Repository\LanguageRepository;

use Symfony\Component\Form\AbstractType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\UuidType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MenuEntryType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name',                 TextType::class,            [])
            ->add('keyword',              TextType::class,            [])
            ->add('menuType',             TextType::class,            [])
            ->add('value',                TextType::class,            [])
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

        $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            [$this, 'onPreSetData']
        );

        $builder->addEventListener(
            FormEvents::PRE_SUBMIT,
            [$this, 'onPreSubmit']
        );
    }

    public function onPreSetData(FormEvent $event): void
    {
        $object = $event->getData();
        $form = $event->getForm();

        if (null != $object && count($object->getChildren()) > 0) {
            $form
                ->add('children',             CollectionType::class,      [
                    'entry_type'   => MenuEntryType::class,
                    'allow_add'    => true,
                    'allow_delete' => true,
                    'delete_empty' => true,
                    'by_reference' => false
                ])
            ;
        }
    }

    public function onPreSubmit(FormEvent $event): void
    {
        $object = $event->getData();
        $form = $event->getForm();

        if (!empty($object['children']) && count($object['children']) > 0) {
            $form
                ->add('children',             CollectionType::class,      [
                    'entry_type'   => MenuEntryType::class,
                    'allow_add'    => true,
                    'allow_delete' => true,
                    'delete_empty' => true,
                    'by_reference' => false
                ])
            ;
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => MenuEntry::class,
        ]);
    }
}
