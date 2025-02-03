<?php

namespace App\Form\Admin\Page\Types;

use App\Entity\Content\Content;
use App\Repository\ContentRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldContentType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'content';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'class'         => Content::class,
            'choice_label'  => 'title',
            'multiple'      => false,
            'query_builder' => function (ContentRepository $cr) {
                return $cr
                    ->createQueryBuilder('c')
                    ->orderBy('c.title', 'ASC');
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

        return $this->em->getRepository(Content::class)->find($cf);
    }
}
