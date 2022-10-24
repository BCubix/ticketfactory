<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Event\EventCategory;
use App\Repository\EventCategoryRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldCategoryType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'category';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'class'         => EventCategory::class,
            'choice_label'  => 'name',
            'multiple'      => false,
            'query_builder' => function (EventCategoryRepository $ecr) {
                return $ecr
                    ->createQueryBuilder('ec')
                    ->orderBy('ec.name', 'ASC')
                ;
            }
        ]);
    }
}
