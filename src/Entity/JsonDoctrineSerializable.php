<?php

namespace App\Entity;

interface JsonDoctrineSerializable
{
    public function jsonSerialize(): string;
    public static function jsonDeserialize($data): self;
}
