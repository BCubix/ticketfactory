<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Content\ContentTypeField;
use App\Entity\Media\Media;
use App\Form\Admin\Content\ContentFieldsType;
use App\Manager\ContentTypeManager;
use App\Repository\MediaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldSliderType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'slider';

    protected $ctm;

    public function __construct(EntityManagerInterface $em, ContentTypeManager $ctm)
    {
        parent::__construct($em);

        $this->ctm = $ctm;
    }

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

    public function jsonContentSerialize(mixed $cf, ?ContentTypeField $ctf): mixed
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

    public function jsonContentDeserialize(mixed $cf, ?ContentTypeField $ctf): mixed
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

    public static function getValidations()
    {
        return [
            'minLength' => ['class' => NumberType::class],
            'maxLength' => ['class' => NumberType::class],
        ];
    }
}
