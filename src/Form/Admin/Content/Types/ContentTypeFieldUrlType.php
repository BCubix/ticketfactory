<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldUrlType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'url';

    public function getParent(): string
    {
        return TextType::class;
    }

    public static function getOptions() {
        $options = parent::getOptions();

        return array_merge($options, ['default_protocol' => [
            'type'  => 'string',
            'label' => 'Protocole par défaut'
        ]]);
    }

    public static function getValidations() {
        return ['url'];
    }
}
