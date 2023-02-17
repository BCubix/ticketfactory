<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldImageType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'image';

    public function getParent(): string
    {
        return FileType::class;
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
            'multiple' => [
                'class' => CheckboxType::class,
                'options' => [
                    'false_values' => ['0', 'null', 'false']
                ]
            ],
        ];
    }

    public static function getValidations() {
        return [
            'minSize' => ['class' => IntegerType::class],
            'maxSize' => ['class' => IntegerType::class],
            'minLength' => ['class' => IntegerType::class],
            'maxLength' => ['class' => IntegerType::class],
            'minHeight' => ['class' => IntegerType::class],
            'maxHeight' => ['class' => IntegerType::class],
            'type' => ['class' => TextType::class]
        ];
    }
}
