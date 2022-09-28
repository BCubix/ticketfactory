<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldDateTimeType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'datetime';

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'format' => 'dd/MM/yyyy HH:mm',
            'html5' => false,
            'widget' => 'single_text'
        ]);
    }

    public function getParent(): string
    {
        return DateTimeType::class;
    }

    public static function getValidations() {
        return ['lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'];
    }
}
