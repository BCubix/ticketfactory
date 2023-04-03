<?php

namespace App\Form\Admin\Content\Types;

use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldListType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'list';

    public function getParent(): string
    {
        return ChoiceType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $choices = [];

        $resolver->setDefaults([
            'expanded' => false,
            'multiple' => false,
            'choices'  => $choices
        ]);
    }

    public static function getOptions() {
        return [
            'disabled' => [
                'class' => CheckboxType::class,
                'options' => [
                    'false_values' => ['0', 'null', 'false']
                ]
            ],
            'required' => [
                'class' => CheckboxType::class,
                'options' => [
                    'false_values' => ['0', 'null', 'false']
                ]
            ],
            'multiple' => [
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
