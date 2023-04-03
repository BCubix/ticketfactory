<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Content\ContentTypeField;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldDateTimeType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'datetime';

    public function getParent(): string
    {
        return DateTimeType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'format' => 'yyyy-MM-dd HH:mm',
            'html5' => false,
            'widget' => 'single_text'
        ]);
    }

    public function jsonContentSerialize(mixed $cf, ?ContentTypeField $ctf): mixed
    {
        return [
            'date' => $cf->format('Y-m-d H:i:s'),
            'timezone' => $cf->format('e')
        ];
    }

    public function jsonContentDeserialize(mixed $cf, ?ContentTypeField $ctf): mixed
    {
        $tz = new \DateTimeZone($cf['timezone']);
        
        return new \DateTime($cf['date'], $tz);
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
            ]
        ];
    }

    public static function getValidations() {
        return [
            'disablePast' => [
                'class' => CheckboxType::class
            ],
            'minDate' => [
                'class' => DateTimeType::class,
                'options' => [
                    'format' => 'yyyy-MM-dd HH:mm',
                    'html5' => false,
                    'widget' => 'single_text'
                ]
            ],
            'maxDate' => [
                'class' => DateTimeType::class,
                'options' => [
                    'format' => 'yyyy-MM-dd HH:mm',
                    'html5' => false,
                    'widget' => 'single_text'
                ]
            ]
        ];
    }
}
