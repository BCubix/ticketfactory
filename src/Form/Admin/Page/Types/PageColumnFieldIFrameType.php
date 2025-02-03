<?php

namespace App\Form\Admin\Page\Types;

use Symfony\Component\Form\Extension\Core\Type\TextareaType;

class PageColumnFieldIFrameType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'iframe';

    public function getParent(): string
    {
        return TextareaType::class;
    }
}
