<?php

namespace TicketFactory\Module\Info\Form\Admin\Info;

use TicketFactory\Module\Info\Entity\Info\Info;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class InfoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',                    CheckboxType::class,             ['false_values' => ['0']])
            ->add('title',                     TextType::class,                 [])
            ->add('description',               TextareaType::class,             [])
            ->add('url',                       UrlType::class,                  [])
            ->add('beginDate',                 DateType::class,                 [
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'yyyy-MM-dd',
                'html5'          => false
            ])
            ->add('endDate',                   DateType::class,                 [
                'widget'         => 'single_text',
                'model_timezone' => 'UTC',
                'view_timezone'  => 'UTC',
                'format'         => 'yyyy-MM-dd',
                'html5'          => false
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Info::class,
        ]);
    }
}
