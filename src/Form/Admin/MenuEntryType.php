<?php

namespace App\Form\Admin;

use App\Entity\MenuEntry;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
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
            ->add('menuType',             TextType::class,            [])
            ->add('value',                TextType::class,            [])
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
