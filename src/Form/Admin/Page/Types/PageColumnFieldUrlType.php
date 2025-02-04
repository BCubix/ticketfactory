<?php

namespace App\Form\Admin\Page\Types;

use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldUrlType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'externalLink';

    public function getParent(): string
    {
        return UrlType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'default_protocol' => ''
        ]);
    }
}
