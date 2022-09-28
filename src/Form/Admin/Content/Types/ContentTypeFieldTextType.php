<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldTextType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'text';

    public function getParent(): string
    {
        return TextType::class;
    }

    public static function getValidations() {
        $validations = parent::getValidations();

        return array_merge($validations, ['minLength', 'maxLength', 'regex']);
    }
}
