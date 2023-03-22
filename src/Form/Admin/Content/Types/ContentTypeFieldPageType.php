<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Content\ContentTypeField;
use App\Entity\Page\Page;
use App\Repository\PageRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldPageType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'page';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'class'         => Page::class,
            'choice_label'  => 'title',
            'multiple'      => false,
            'query_builder' => function (PageRepository $pr) {
                return $pr
                    ->createQueryBuilder('p')
                    ->orderBy('p.title', 'ASC')
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

    public function jsonContentDeserialize(mixed &$cf, ?ContentTypeField $ctf): mixed
    {
        if (empty($cf)) {
            return null;
        }

        return $this->em->getRepository(Page::class)->find($cf);
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
}
