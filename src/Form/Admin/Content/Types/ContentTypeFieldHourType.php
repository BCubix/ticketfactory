<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldHourType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'time';

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'input_format' => 'H:i',
            'html5' => false,
            'widget' => 'single_text'
        ]);
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
            'minHour' => [
                'class' => TimeType::class,
                'options' => [
                    'input_format' => 'H:i',
                    'html5' => false,
                    'widget' => 'single_text'
                ]
            ],
            'maxHour' => [
                'class' => TimeType::class,
                'options' => [
                    'input_format' => 'H:i',
                    'html5' => false,
                    'widget' => 'single_text'
                ]
            ]
        ];
    }

    public function getParent(): string
    {
        return TimeType::class;
    }
}
