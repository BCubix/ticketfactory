<?php

namespace App\Form\Admin\Page\Types;

use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldDateType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'date';

    public function getParent(): string
    {
        return DateType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'format' => 'yyyy-MM-dd',
            'html5' => false,
            'widget' => 'single_text'
        ]);
    }

    public function jsonContentSerialize(mixed $cf): mixed
    {
        return [
            'date' => $cf->format('Y-m-d'),
            'timezone' => $cf->format('e')
        ];
    }

    public function jsonContentDeserialize(mixed $cf): mixed
    {
        $tz = new \DateTimeZone($cf['timezone']);

        return new \DateTime($cf['date'], $tz);
    }
}
