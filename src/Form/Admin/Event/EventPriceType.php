<?php

namespace App\Form\Admin\Event;

use App\Entity\Event\EventPrice;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EventPriceType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name',                  TextType::class,            [])
            ->add('annotation',            TextType::class,            [])
            ->add('price',                 MoneyType::class,           [
                'currency' => 'EUR'
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => EventPrice::class,
        ]);
    }
}
