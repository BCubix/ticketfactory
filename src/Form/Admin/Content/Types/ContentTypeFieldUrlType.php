<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldUrlType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'externalLink';

    public function getParent(): string
    {
        return UrlType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'default_protocol' => 'https'
        ]);
    }
}
