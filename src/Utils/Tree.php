<?php

namespace App\Utils;

class Tree
{
    public static function build(string $path)
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