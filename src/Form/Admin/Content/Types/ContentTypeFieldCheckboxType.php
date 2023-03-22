<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
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
        return [
            'isTrue' => [
                'class' => CheckboxType::class,
                'options' => [
                    'false_values' => ['0', 'null', 'false']
                ]
            ]
        ];
    }

    public static function getParameters() {
        return [
            'choices' => ['class' => TextType::class]
        ];
    }

    public static function getChoicesFromString(string $choices): array
    {
        $lineList = [];
        $resultList = [];
        
        $choices = str_replace("\r", "", $choices);
        $lineList = explode("\n", $choices);

        foreach ($lineList as $line) {
            $result = explode(" : ", $line);

            if (count($result) == 2) {
                $resultList[$result[1]] = $result[0];
            }
        }

        return $resultList;
    }
}
