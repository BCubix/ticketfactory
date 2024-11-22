<?php

namespace App\Form\Admin\Page\Types;

use App\Entity\Content\ContentTypeField;
use App\Entity\Page\Page;
use App\Repository\PageRepository;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PageColumnFieldPageType extends PageColumnFieldAbstractType
{
    public const SERVICE_NAME = 'page';

    public function getParent(): string
    {
        return EntityType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);

        $resolver->setDefaults([
            'class'         => Page::class,
            'choice_label'  => 'title',
            'multiple'      => false,
            'query_builder' => function (PageRepository $pr) {
                return $pr
                    ->createQueryBuilder('p')
                    ->orderBy('p.title', 'ASC');
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
}
