<?php

namespace App\Form\Admin\Page\Types;

use App\Entity\Content\ContentTypeField;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldDateTimeType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'datetime';

    public function getParent(): string
    {
        return DateTimeType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

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
}
