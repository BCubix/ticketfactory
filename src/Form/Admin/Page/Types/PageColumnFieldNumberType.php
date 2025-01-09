<?php

namespace App\Form\Admin\Page\Types;

use Symfony\Component\Form\Extension\Core\Type\NumberType;

class PageColumnFieldNumberType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'number';

    public function getParent(): string
    {
        return NumberType::class;
    }
}
