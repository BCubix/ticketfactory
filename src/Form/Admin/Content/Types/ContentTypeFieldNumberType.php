<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldNumberType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'number';

    public function getParent(): string
    {
        return NumberType::class;
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
            ],
            'scale' => [
                'class' => IntegerType::class
            ]
        ];
    }

    public static function getValidations() {
        return [
            'lessThan' => ['class' => NumberType::class],
            'lessThanOrEqual' => ['class' => NumberType::class],
            'greaterThan' => ['class' => NumberType::class],
            'greaterThanOrEqual' => ['class' => NumberType::class]
        ];
    }
}
