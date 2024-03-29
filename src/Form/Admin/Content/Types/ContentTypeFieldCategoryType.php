<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Event\EventCategory;
use App\Entity\Content\ContentTypeField;
use App\Repository\EventCategoryRepository;

use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldCategoryType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'category';

    public function getParent(): string
    {
        return EntityType::class;
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
        ];
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

    public function jsonContentSerialize(mixed $cf, ?ContentTypeField $ctf): mixed
    {
        if (empty($cf)) {
            return null;
        }

        return $cf->getId();
    }

    public function jsonContentDeserialize(mixed $cf, ?ContentTypeField $ctf): mixed
    {
        if (empty($cf)) {
            return null;
        }

        return $this->em->getRepository(EventCategory::class)->find($cf);
    }
}
