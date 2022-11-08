<?php

namespace App\Form\Admin\Content\Types;

use App\Form\Admin\Content\ContentFieldsType;

use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldGroupType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'group';

    public function getParent(): string
    {
        return ContentFieldsType::class;
    }

    public static function getParameters() {
        return ['fields' => 'array'];
    }
}
