<?php

namespace App\Form\Admin\Content\Types;

use App\Form\Admin\Content\ContentFieldsType;

use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldSliderType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'slider';

    public function getParent(): string
    {
        return ContentFieldsType::class;
    }
}
