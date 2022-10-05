<?php

namespace App\Form\Admin\Event;

use App\Entity\Event\EventPriceBlock;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventPriceBlockType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name',                 TextType::class,            [])
            ->add('eventPrices',          CollectionType::class,      [
                'entry_type'   => EventPriceType::class,
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
            'data_class' => EventPriceBlock::class,
        ]);
    }
}
