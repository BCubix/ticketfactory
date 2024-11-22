<?php

namespace App\Form\Admin\Page\Types;

use App\Entity\Content\ContentTypeField;
use App\Entity\Media\Media;
use App\Repository\MediaRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldImageType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'image';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'class'         => Media::class,
            'choice_label'  => 'title',
            'multiple'      => false,
            'query_builder' => function (MediaRepository $mr) {
                return $mr
                    ->createQueryBuilder('m')
                    ->orderBy('m.title', 'ASC');
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
}
