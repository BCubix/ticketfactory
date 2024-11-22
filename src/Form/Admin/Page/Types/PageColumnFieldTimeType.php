<?php

namespace App\Form\Admin\Page\Types;

use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldTimeType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'time';

    public function getParent(): string
    {
        return TimeType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'input_format' => 'H:i',
            'html5' => false,
            'widget' => 'single_text'
        ]);
    }
}
