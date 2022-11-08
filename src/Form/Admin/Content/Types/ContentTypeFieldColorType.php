<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldColorType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'color';

    public function getParent(): string
    {
        return TextType::class;
    }
}
