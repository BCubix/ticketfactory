<?php

namespace App\Form\Admin\Ticketing;

use App\Entity\Addon\Module;
use App\Entity\Ticketing\Ticketing;
use App\Repository\ModuleRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TicketingType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,          ['false_values' => ['0', 'null', 'false']])
            ->add('name',                 TextType::class,              [])
            ->add('type',                 ChoiceType::class,            [
                'choices'  => array_flip(Ticketing::TYPE_MAPPING)
            ])
            ->add('data',            TicketingDataType::class,      [])
            ->add('module',               EntityType::class,            [
                'class'         => Module::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (ModuleRepository $m) {
                    return $m
                        ->createQueryBuilder('m')
                        ->orderBy('m.name', 'ASC');
                }
            ]);

    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Ticketing::class,
            'csrf_protection' => false
        ]);
    }
}
