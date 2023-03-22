<?php

namespace App\Service\Serializer;

use App\Entity\Content\Content;
use App\Entity\Content\ContentType;
use App\Manager\ContentTypeManager;

class ContentSerializer
{
    protected $ctm;

    public function __construct(ContentTypeManager $ctm)
    {
        $this->ctm = $ctm;
    }

    public function serializeContent(Content &$content): void
    {
        $this->handleContent($content, 'jsonContentSerialize');
    }

    public function deSerializeContent(Content &$content): void
    {
        $this->handleContent($content, 'jsonContentDeserialize');
    }

    private function handleContent(Content &$content, string $methodName): void
    {
        $fields = [];
        $contentType = $content->getContentType();
        
        foreach ($content->getFields() as $contentFieldName => $contentField) {

            $contentTypeFields = $contentType->getFields();
            if ((count($contentTypeFields) > 0) && is_array($contentTypeFields[0])) {
                $contentType = ContentType::jsonDeserialize($contentType);
                $contentTypeFields = $contentType->getFields();
            }

            foreach ($contentType->getFields() as $contentTypeField) {

                if ($contentFieldName == $contentTypeField->getName()) {
                    $component = $this->ctm->getContentTypeInstanceFromType($contentTypeField->getType());

                    if (method_exists($component, $methodName)) {
                        $fields[$contentFieldName] = $component->$methodName($contentField, $contentTypeField);
                    } else {
                        $fields[$contentFieldName] = $contentField;
                    }
                    
                    break;
                }
            }
        }

        $content->setFields($fields);
    }
}