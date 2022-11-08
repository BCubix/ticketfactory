<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldTextareaType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'textarea';

    public function getParent(): string
    {
        return TextareaType::class;
    }

    public static function getValidations() {
        return ['minLength', 'maxLength', 'regex'];
    }
}
