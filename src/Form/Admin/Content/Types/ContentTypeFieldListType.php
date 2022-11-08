<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldListType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'list';

    public function getParent(): string
    {
        return ChoiceType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $choices = [];

        $resolver->setDefaults([
            'expanded' => false,
            'multiple' => true,
            'choices'  => $choices
        ]);
    }

    public static function getParameters() {
        return ['choices' => 'string'];
    }
}
