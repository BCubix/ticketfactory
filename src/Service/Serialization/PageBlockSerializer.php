<?php

namespace App\Service\Serialization;

use App\Entity\Page\PageBlock;
use App\Entity\Page\PageColumn;
use App\Entity\Media\Media;

use Doctrine\ORM\EntityManagerInterface;

class PageBlockSerializer
{
    protected $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
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
                'xl'      => $column->getXl()
            ];

            if ($pageBlock->getBlockType() == 1) { // Slider block
                $serializedColumn['content'] = (is_string($column->getContent()) ? $column->getContent() : $column->getContent()->getId());
            } else {
                $serializedColumn['content'] = $column->getcontent();
            }

            $columns[] = $serializedColumn;
        }

        $pageBlock->setColumns($columns);
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

            if ($pageBlock->getBlockType() == 1) { // Slider block
                $id = $serializedColumn['content'];
                $content = $this->em->getRepository(Media::class)->find($id);

                $column->setContent($content);
            } else {
                $column->setContent($serializedColumn['content']);
            }

            $columns[] = $column;
        }

        $pageBlock->setColumns($columns);
    }
}
