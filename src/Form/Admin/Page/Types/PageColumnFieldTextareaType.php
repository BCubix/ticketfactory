<?php

namespace App\Form\Admin\Page\Types;

use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class PageColumnFieldTextareaType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'textarea';

    public function getParent(): string
    {
        return TextareaType::class;
    }
}
