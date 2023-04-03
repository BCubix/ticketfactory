<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldMapType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'map';

    public function getParent(): string
    {
        return TextareaType::class;
    }

    public static function getParameters() {
        return [
            'token'    => ['class' => TextType::class],
            'mapStyle' => ['class' => TextType::class]
        ];
    }
}
