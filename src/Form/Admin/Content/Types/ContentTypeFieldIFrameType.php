<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldIFrameType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'iframe';

    public function getParent(): string
    {
        return TextareaType::class;
    }
}
