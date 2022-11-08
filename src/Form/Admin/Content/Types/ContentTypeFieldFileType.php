<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldFileType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'file';

    public function getParent(): string
    {
        return FileType::class;
    }
}
