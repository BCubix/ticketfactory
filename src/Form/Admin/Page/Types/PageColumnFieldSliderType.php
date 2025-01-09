<?php

namespace App\Form\Admin\Page\Types;

use App\Entity\Media\Media;
use App\Repository\MediaRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldSliderType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'slider';

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
            'multiple'      => true,
            'query_builder' => function (MediaRepository $mr) {
                return $mr
                    ->createQueryBuilder('m')
                    ->orderBy('m.title', 'ASC');
            }
        ]);
    }

    public function jsonContentSerialize(mixed $cf): mixed
    {
        $result = "";
        foreach ($cf as $media) {
            if (!empty($result)) {
                $result .= ",";
            }

            $result .= $media->getId();
        }

        return $result;
    }

    public function jsonContentDeserialize(mixed $cf): mixed
    {
        if (empty($cf)) {
            return [];
        }

        $results = [];
        $listId = explode(",", $cf);

        foreach ($listId as $id) {
            $media = $this->em->getRepository(Media::class)->find($id);
            if (null !== $media) {
                $results[] = $media;
            }
        }

        return $results;
    }
}
