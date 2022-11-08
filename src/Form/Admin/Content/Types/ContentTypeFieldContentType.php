<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Content\Content;
use App\Repository\ContentRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldContentType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'content';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'class'         => Content::class,
            'choice_label'  => 'title',
            'multiple'      => false,
            'query_builder' => function (ContentRepository $cr) {
                return $cr
                    ->createQueryBuilder('c')
                    ->orderBy('c.title', 'ASC')
                ;
            }
        ]);
    }
}
