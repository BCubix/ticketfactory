<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Event\Event;
use App\Repository\EventRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldEventType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'event';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'class'         => Event::class,
            'choice_label'  => 'name',
            'multiple'      => false,
            'query_builder' => function (EventRepository $er) {
                return $er
                    ->createQueryBuilder('e')
                    ->orderBy('e.name', 'ASC')
                ;
            }
        ]);
    }
}
