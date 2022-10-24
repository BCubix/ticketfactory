<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Page\Page;
use App\Repository\PageRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
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
            'query_builder' => function (EventRepository $pr) {
                return $pr
                    ->createQueryBuilder('p')
                    ->orderBy('p.title', 'ASC')
                ;
            }
        ]);
    }
}
