<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\NumberType;
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
            'attr'      => [
                'type'  => 'array',
                'label' => 'Attributs HTML'
            ],
            'disabled'  => [
                'type'  => 'boolean',
                'label' => 'Champ désactivé'
            ],
            'required'  => [
                'type'  => 'boolean',
                'label' => 'Champ requis'
            ],
            'scale'     => [
                'type'  => 'integer',
                'label' => 'Nombre de chiffres après la virgule'
            ]
        ];
    }

    public static function getValidations() {
        return ['lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'];
    }
}
