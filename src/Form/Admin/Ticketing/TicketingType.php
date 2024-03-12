<?php

namespace App\Form\Admin\Ticketing;

use App\Entity\Ticketing\Ticketing;
use App\Form\Type\TicketingDataType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TicketingType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('name',                 TextType::class,            [])
            ->add('type',                 ChoiceType::class,          [
                'choices'  => array_flip(Ticketing::TYPE_MAPPING)
            ])
            ->add('data',                 TicketingDataType::class,     []);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Ticketing::class,
        ]);
    }
}
