<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldPasswordType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'password';

    public function getParent(): string
    {
        return PasswordType::class;
    }
}
