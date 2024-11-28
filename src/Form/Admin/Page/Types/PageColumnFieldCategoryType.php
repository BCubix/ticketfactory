<?php

namespace App\Form\Admin\Page\Types;

use App\Entity\Event\EventCategory;
use App\Repository\EventCategoryRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldCategoryType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'category';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'class'         => EventCategory::class,
            'choice_label'  => 'name',
            'multiple'      => false,
            'query_builder' => function (EventCategoryRepository $ecr) {
                return $ecr
                    ->createQueryBuilder('ec')
                    ->orderBy('ec.name', 'ASC');
            }
        ]);
    }

    public function jsonContentSerialize(mixed $cf): mixed
    {
        if (empty($cf)) {
            return null;
        }

        return $cf->getId();
    }

    public function jsonContentDeserialize(mixed $cf): mixed
    {
        if (empty($cf)) {
            return null;
        }

        return $this->em->getRepository(EventCategory::class)->find($cf);
    }
}
