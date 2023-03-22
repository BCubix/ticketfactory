<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Content\ContentTypeField;
use App\Form\Admin\Content\ContentFieldsType;
use App\Manager\ContentTypeManager;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldSliderType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'slider';

    protected $ctm;

    public function __construct(EntityManagerInterface $em, ContentTypeManager $ctm)
    {
        parent::__construct($em);

        $this->ctm = $ctm;
    }

    public function getParent(): string
    {
        return ContentFieldsType::class;
    }

    public function jsonContentSerialize(mixed $cf, ?ContentTypeField $ctf): mixed
    {
        $fields = [];

        foreach ($cf as $childrenCfName => $childrenCf) {
            $component = $this->ctm->getContentTypeInstanceFromType('image');
            $fields[$childrenCfName] = $component->jsonContentSerialize($childrenCf, null);
        }

        return $fields;
    }

    public function jsonContentDeserialize(mixed $cf, ?ContentTypeField $ctf): mixed
    {
        $fields = [];

        foreach ($cf as $childrenCfName => $childrenCf) {
            $component = $this->ctm->getContentTypeInstanceFromType($childrenCt->getType());
            $fields[$childrenCfName] = $component->jsonContentDeserialize($childrenCf, null);
        }

        return $fields;
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

    public static function getValidations() {
        return [
            'minLength' => ['class' => NumberType::class],
            'maxLength' => ['class' => NumberType::class],
        ];
    }
}
