<?php

namespace App\Form\Admin\Content\Types;

use App\Form\Admin\Content\ContentFieldsType;
use App\Form\Admin\Content\ContentTypeFieldType;

use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ContentTypeFieldGroupType extends ContentTypeFieldAbstractType
{
    public const FIELD_NAME = 'group';

    public function getParent(): string
    {
        return ContentFieldsType::class;
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
