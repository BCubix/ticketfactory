<?php

namespace App\Form\Admin\Page\Types;

use Symfony\Component\Form\Extension\Core\Type\EmailType;

class PageColumnFieldEmailType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'email';

    public function getParent(): string
    {
        return EmailType::class;
    }
}
