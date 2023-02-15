<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldEmailType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'email';

    public function getParent(): string
    {
        return EmailType::class;
    }
}
