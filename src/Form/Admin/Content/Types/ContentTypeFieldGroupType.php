<?php

namespace App\Form\Admin\Content\Types;

use App\Entity\Content\ContentTypeField;
use App\Form\Admin\Content\ContentFieldsType;
use App\Form\Admin\Content\ContentTypeFieldType;
use App\Manager\ContentTypeManager;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldGroupType extends ContentTypeFieldAbstractType
{
    public const SERVICE_NAME = 'group';

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
        $childrenContentType = $ctf->getParameters();
        if (!isset($childrenContentType['fields'])) {
            return [];
        }

        $fields = [];

        foreach ($cf as $childrenCfName => $childrenCf) {
            foreach ($childrenContentType['fields'] as $childrenCt) {

                if ($childrenCfName == $childrenCt->getName()) {
                    $component = $this->ctm->getContentTypeInstanceFromType($childrenCt->getType());

                    if (method_exists($component, 'jsonContentSerialize')) {
                        $fields[$childrenCfName] = $component->jsonContentSerialize($childrenCf, $childrenCt);
                    } else {
                        $fields[$childrenCfName] = $childrenCf;
                    }
                    
                    break;
                }
            }
        }

        return $fields;
    }

    public function jsonContentDeserialize(mixed $cf, ?ContentTypeField $ctf): mixed
    {
        $childrenContentType = $ctf->getParameters();
        if (!isset($childrenContentType['fields'])) {
            return [];
        }

        $fields = [];

        foreach ($cf as $childrenCfName => $childrenCf) {
            foreach ($childrenContentType['fields'] as $childrenCt) {

                if ($childrenCfName == $childrenCt->getName()) {
                    $component = $this->ctm->getContentTypeInstanceFromType($childrenCt->getType());

                    if (method_exists($component, 'jsonContentDeserialize')) {
                        $fields[$childrenCfName] = $component->jsonContentDeserialize($childrenCf, $childrenCt);
                    } else {
                        $fields[$childrenCfName] = $childrenCf;
                    }
                    
                    break;
                }
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
