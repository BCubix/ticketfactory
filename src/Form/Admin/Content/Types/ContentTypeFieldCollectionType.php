<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Content\ContentTypeField;
use App\Form\Admin\Content\ContentFieldsType;
use App\Form\Admin\Content\ContentTypeFieldType;
use App\Manager\ContentTypeManager;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldCollectionType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'collection';

    protected $ctm;

    public function __construct(EntityManagerInterface $em, ContentTypeManager $ctm)
    {
        parent::__construct($em);

        $this->ctm = $ctm;
    }

    public function getParent(): string
    {
        return CollectionType::class;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'contentTypes' => [],
            'entry_type'   => ContentFieldsType::class,
            'allow_add'    => true,
            'allow_delete' => true,
            'delete_empty' => true,
            'by_reference' => false
        ]);
    }

    public function jsonContentSerialize(mixed $cf, ?ContentTypeField $ctf): mixed
    {
        $childrenContentType = $ctf->getParameters();
        if (!isset($childrenContentType['fields']) || !isset($childrenContentType['fields'][0])) {
            return [];
        }

        $fieldType = $childrenContentType['fields'][0];
        $fields = [];

        foreach ($cf as $childrenCf) {
            $component = $this->ctm->getContentTypeInstanceFromType($fieldType->getType());

            if (method_exists($component, 'jsonContentSerialize')) {
                $fields[] = $component->jsonContentSerialize($childrenCf, $fieldType);
            } else {
                $fields[] = $childrenCf;
            }
        }

        return $fields;
    }

    public function jsonContentDeserialize(mixed $cf, ?ContentTypeField $ctf): mixed
    {
        $childrenContentType = $ctf->getParameters();
        if (!isset($childrenContentType['fields']) || !isset($childrenContentType['fields'][0])) {
            return [];
        }

        $fieldType = $childrenContentType['fields'][0];
        $fields = [];

        foreach ($cf as $childrenCf) {
            $component = $this->ctm->getContentTypeInstanceFromType($fieldType->getType());

            if (method_exists($component, 'jsonContentDeserialize')) {
                $fields[] = $component->jsonContentDeserialize($childrenCf, $fieldType);
            } else {
                $fields[] = $childrenCf;
            }
        }

        return $fields;
    }

    public static function getOptions() {
        return [];
    }

    public static function getParameters() {
        return [
            'fields' => [
                'class' => CollectionType::class,
                'options' => [
                    'entry_type'   => ContentTypeFieldType::class,
                    'allow_add'    => true,
                    'allow_delete' => true,
                    'delete_empty' => true,
                    'by_reference' => false
                ]
            ]
        ];
    }
}
