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
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'expanded' => true,
            'multiple' => false,
            'choices'  => []
        ]);
    }

    public static function getParameters()
    {
        return [
            'choices' => ['class' => TextType::class]
        ];
    }
}
