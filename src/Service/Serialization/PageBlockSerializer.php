<?php

namespace App\Service\Serialization;

use App\Entity\Page\PageBlock;
use App\Entity\Page\PageBlockType;
use App\Entity\Page\PageColumn;
use App\Manager\ContentTypeManager;
use Doctrine\ORM\EntityManagerInterface;

class PageBlockSerializer
{
    public const SERVICE_NAME = 'pageBlockSerializer';

    protected $em;
    protected $ctm;

    public function __construct(EntityManagerInterface $em, ContentTypeManager $ctm)
    {
        $this->em = $em;
        $this->ctm = $ctm;
    }

    public function serializePageBlock(PageBlock &$pageBlock): void
    {
        $columns = [];
        foreach ($pageBlock->getColumns() as $column) {
            $serializedColumn = [
                'xs'      => $column->getXs(),
                's'       => $column->getS(),
                'm'       => $column->getM(),
                'l'       => $column->getL(),
                'xl'      => $column->getXl(),
                'class'   => $column->getClass(),
                'type'    => $column->getType(),
                'content' => $column->getcontent(),
            ];

            $columns[] = $serializedColumn;
        }

        $pageBlock->setColumns($columns);

        if (null !== $pageBlock->getFields() && count($pageBlock->getFields()) > 0) {
            $this->handlePageBlockContent($pageBlock, 'jsonContentSerialize');
        }
    }

    public function deSerializePageBlock(PageBlock &$pageBlock): void
    {
        $columns = [];
        foreach ($pageBlock->getColumns() as $serializedColumn) {
            $column = new PageColumn();
            $column->setXs($serializedColumn['xs']);
            $column->setS($serializedColumn['s']);
            $column->setM($serializedColumn['m']);
            $column->setL($serializedColumn['l']);
            $column->setXl($serializedColumn['xl']);
            $column->setClass($serializedColumn['class'] ?? "");
            $column->setType($serializedColumn['type'] ?? "");
            $column->setContent($serializedColumn['content']);

            $columns[] = $column;
        }

        $pageBlock->setColumns($columns);

        $this->handlePageBlockContent($pageBlock, 'jsonContentDeserialize');
    }

    private function handlePageBlockContent(PageBlock &$pageBlock, string $methodName): void
    {
        $fields = [];
        $pageBlockType = $pageBlock->getPageBlockType();
        if (null === $pageBlockType) {
            $pageBlock->setFields([]);
        }
        
        foreach ($pageBlock->getFields() as $contentFieldName => $contentField) {

            $contentTypeFields = $pageBlockType->getFields();
            if ((count($contentTypeFields) > 0) && is_array($contentTypeFields[0])) {
                $pageBlockType = PageBlockType::jsonDeserialize($pageBlockType);
                $contentTypeFields = $pageBlockType->getFields();
            }

            foreach ($pageBlockType->getFields() as $pageBlockTypeField) {

                if ($contentFieldName == $pageBlockTypeField->getName()) {
                    $component = $this->ctm->getContentTypeInstanceFromType($pageBlockTypeField->getType());

                    if (method_exists($component, $methodName)) {
                        $fields[$contentFieldName] = $component->$methodName($contentField, $pageBlockTypeField);
                    } else {
                        $fields[$contentFieldName] = $contentField;
                    }
                    
                    break;
                }
            }
        }


        $pageBlock->setFields($fields);
    }
}
