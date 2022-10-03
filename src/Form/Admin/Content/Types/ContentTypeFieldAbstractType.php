<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\AbstractType;

abstract class ContentTypeFieldAbstractType extends AbstractType
{
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
            'trim'      => [
                'type'  => 'boolean',
                'label' => 'Epurer les espaces'
            ]
        ];
    }

    public static function getValidations() {
        return [];
    }
}
