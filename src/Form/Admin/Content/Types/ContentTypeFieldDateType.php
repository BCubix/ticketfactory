<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldDateType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'date';

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'format' => 'yyyy-MM-dd',
            'html5' => false,
            'widget' => 'single_text'
        ]);
    }

    public function getParent(): string
    {
        return DateType::class;
    }

    public static function getOptions() {
        return [
            'disabled' => [
                'class' => CheckboxType::class,
                'options' => [
                    'false_values' => ['0', 'null', 'false']
                ]
            ],
            'required' => [
                'class' => CheckboxType::class,
                'options' => [
                    'false_values' => ['0', 'null', 'false']
                ]
            ]
        ];
    }

    public static function getValidations() {
        return [
            'disablePast' => ['class' => CheckboxType::class],
            'minDate' => [
                'class' => DateType::class,
                'options' => [
                    'format' => 'yyyy-MM-dd',
                    'html5' => false,
                    'widget' => 'single_text'
                ]
            ],
            'maxDate' => [
                'class' => DateType::class,
                'options' => [
                    'format' => 'yyyy-MM-dd',
                    'html5' => false,
                    'widget' => 'single_text'
                ]
            ]
        ];
    }
}
