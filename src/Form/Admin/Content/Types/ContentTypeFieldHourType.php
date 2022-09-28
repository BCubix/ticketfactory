<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldHourType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'time';

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'input_format' => 'H:i',
            'html5' => false,
            'widget' => 'single_text'
        ]);
    }

    public function getParent(): string
    {
        return TimeType::class;
    }
}
