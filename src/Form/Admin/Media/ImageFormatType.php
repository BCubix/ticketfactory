<?php

namespace App\Form\Admin\Media;

use App\Form\Admin\AdminBaseFormType;
use App\Entity\Media\ImageFormat;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ImageFormatType extends AdminBaseFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('slug',                 TextType::class,            [
                'empty_data' => '',
            ])
            ->add('imageToCrop',          CheckboxType::class,        ['false_values' => ['0', 'null', 'false']])
            ->add('name',                 TextType::class,            [])
            ->add('width',                IntegerType::class,         [])
            ->add('height',               IntegerType::class,         [])
            ->add('themeUse',             CheckboxType::class,        ['false_values' => ['0', 'null', 'false']]);

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
            'data_class' => ImageFormat::class,
            'csrf_protection' => false
        ]);
    }
}
