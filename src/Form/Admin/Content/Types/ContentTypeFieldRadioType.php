<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldRadioType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'radio';

    public function getParent(): string
    {
        return ChoiceType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $choices = [];

        $resolver->setDefaults([
            'expanded' => true,
            'multiple' => false,
            'choices'  => $choices
        ]);
    }

    public static function getParameters() {
        return [
            'choices' => ['class' => TextType::class]
        ];
    }
}
