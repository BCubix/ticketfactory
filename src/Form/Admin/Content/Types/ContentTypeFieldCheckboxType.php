<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldCheckboxType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'checkbox';

    public function getParent(): string
    {
        return ChoiceType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $choices = [];

        $resolver->setDefaults([
            'expanded' => true,
            'multiple' => true,
            'choices'  => $choices
        ]);
    }

    public static function getValidations() {
        return ['isTrue'];
    }

    public static function getParameters() {
        return ['choices' => 'string'];
    }
}
