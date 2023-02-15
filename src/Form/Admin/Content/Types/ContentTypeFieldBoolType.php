<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldBoolType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'checkbox';

    public function getParent(): string
    {
        return CheckboxType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'false_values' => ['0', null, false]
        ]);
    }

    public static function getValidations() {
        return [
            'isTrue' => [
                'class' => CheckboxType::class,
                'options' => [
                    'false_values' => ['0', null, false]
                ]
            ]
        ];
    }
}
