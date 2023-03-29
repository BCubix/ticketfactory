<?php

namespace App\Service\File;

class Tree
{
    /**
     * Build a tree from path
     *
     * @param string $path
     *
     * @return array
     */
    public static function build(string $path): array
    {
        $tree = [];

        $dir = new \DirectoryIterator($path);
        foreach ($dir as $node) {
            if ($node->isDot()) {
                continue;
            }

            $name = $node->getFilename();

            if ($node->isFile()) {
                $tree[] = $name;
            } else if ($node->isDir()) {
                $tree[$name] = static::build($node->getPathname());
            }
        }

        return $tree;
    }
}