<?php

namespace App\Form\Admin\Page\Types;

use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class PageColumnFieldWysiwygType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'wysiwyg';

    public function getParent(): string
    {
        return TextareaType::class;
    }
}
