<?php

namespace App\Form\Admin\Page\Types;

use App\Entity\Event\Tag;
use App\Repository\TagRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldTagType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'tag';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'class'         => Tag::class,
            'choice_label'  => 'name',
            'multiple'      => false,
            'query_builder' => function (TagRepository $tr) {
                return $tr
                    ->createQueryBuilder('t')
                    ->orderBy('t.name', 'ASC');
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

        return $this->em->getRepository(Tag::class)->find($cf);
    }
}
