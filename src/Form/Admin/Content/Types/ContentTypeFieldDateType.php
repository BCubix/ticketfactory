<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldDateType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'date';

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'format'         => 'yyyy-MM-dd',
            'html5' => false,
            'widget' => 'single_text'
        ]);
    }

    public function getParent(): string
    {
        return DateType::class;
    }

    public static function getValidations() {
        return ['lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'];
    }
}
