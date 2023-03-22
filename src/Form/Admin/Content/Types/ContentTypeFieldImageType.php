<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Content\ContentTypeField;
use App\Entity\Media\Media;
use App\Repository\MediaRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldImageType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'image';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'class'         => Media::class,
            'choice_label'  => 'title',
            'multiple'      => false,
            'query_builder' => function (MediaRepository $mr) {
                return $mr
                    ->createQueryBuilder('m')
                    ->orderBy('m.title', 'ASC')
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

        return $this->em->getRepository(Media::class)->find($cf);
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
            ],
        ];
    }

    public static function getValidations() {
        return [
            'minSize' => ['class' => IntegerType::class],
            'maxSize' => ['class' => IntegerType::class],
            'minLength' => ['class' => IntegerType::class],
            'maxLength' => ['class' => IntegerType::class],
            'minHeight' => ['class' => IntegerType::class],
            'maxHeight' => ['class' => IntegerType::class],
            'type' => ['class' => TextType::class]
        ];
    }
}
