<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class ContentTypeFieldWysiwygType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'wysiwyg';

    public function getParent(): string
    {
        return TextareaType::class;
    }
}
