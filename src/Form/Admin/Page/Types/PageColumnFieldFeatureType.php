<?php

namespace App\Form\Admin\Page\Types;

use App\Entity\Content\ContentTypeField;
use App\Entity\Feature\FeatureValue;
use App\Repository\FeatureValueRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldFeatureType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'feature';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'class'         => FeatureValue::class,
            'choice_label'  => 'title',
            'multiple'      => false,
            'query_builder' => function (FeatureValueRepository $fr) {
                return $fr
                    ->createQueryBuilder('f')
                    ->orderBy('f.value', 'ASC');
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

    public function jsonContentDeserialize(mixed &$cf, ?ContentTypeField $ctf): mixed
    {
        if (empty($cf)) {
            return null;
        }

        return $this->em->getRepository(FeatureValue::class)->find($cf);
    }
}
