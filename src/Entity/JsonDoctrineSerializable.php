<?php

namespace App\Entity;

interface JsonDoctrineSerializable
{
    public function jsonSerialize(): mixed;
    public static function jsonDeserialize($data): self;
}
