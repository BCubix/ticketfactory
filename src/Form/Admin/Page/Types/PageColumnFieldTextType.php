<?php

namespace App\Form\Admin\Page\Types;

use Symfony\Component\Form\Extension\Core\Type\TextType;

class PageColumnFieldTextType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'text';

    public function getParent(): string
    {
        return TextType::class;
    }
}
