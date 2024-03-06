<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Content\ContentTypeField;
use App\Entity\Feature\FeatureValue;
use App\Repository\FeatureValueRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldFeatureType extends ContentTypeFieldAbstractType
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

    public static function getOptions()
    {
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

    public static function getParameters()
    {
        return [
            'feature' => ['class' => TextType::class]
        ];
    }
}
