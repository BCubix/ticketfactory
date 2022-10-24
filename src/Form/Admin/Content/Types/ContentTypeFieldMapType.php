<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldMapType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'map';

    public function getParent(): string
    {
        return TextareaType::class;
    }

    public static function getParameters() {
        return ['token' => 'string', 'mapStyle' => 'string'];
    }
}
