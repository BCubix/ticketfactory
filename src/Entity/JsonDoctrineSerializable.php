<?php

namespace App\Entity;

interface JsonDoctrineSerializable
{
    public function jsonSerialize(): string;
    public static function jsonUnserialize($data): self;
}
