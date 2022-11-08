<?php

namespace App\Utils;

use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\PersistentCollection;

class CloneObject
{
    protected const RELATIONS_TYPE_MAP = [
        "Doctrine\ORM\Mapping\OneToMany" => "OneToMany",
        "Doctrine\ORM\Mapping\ManyToOne" => "ManyToOne",
        "Doctrine\ORM\Mapping\OneToOne" => "OneToOne",
        "Doctrine\ORM\Mapping\ManyToMany" => "ManyToMany",
    ];

    private static function getVariableType($reflectionProperty)
    {
        $attributes = $reflectionProperty->getAttributes();

        if (count($attributes) > 0) {
            foreach($attributes as $attribute) {
                $arguments = $attribute->getArguments();
                $name = $attribute->getName();

                if ($name ===  "Doctrine\ORM\Mapping\Column" && array_key_exists("type", $arguments)) {
                    return $arguments["type"];
                } else if (array_key_exists($name, self::RELATIONS_TYPE_MAP)) {
                    return self::RELATIONS_TYPE_MAP[$name];
                }
            }
        }

        return null;
    }

    public static function cloneObject($object)
    {
        $newObject = clone $object;
        $reflect = new \ReflectionClass($newObject);
        $props = $reflect->getProperties();
        $className = $reflect->getName();
        $class = new $className();

        foreach ($props as $prop) {
            $name = $prop->getName();

            $reflectionProperty = new \ReflectionProperty($className, $name);
            $reflectionProperty->setAccessible(true);

            $value = $reflectionProperty->getValue($newObject);
            $type = self::getVariableType($reflectionProperty);

            if ($name === "id" || $name === "slug") {
                $reflectionProperty->setValue($newObject, null);
            } else if ($type === "OneToMany") {
                $reflectionProperty->setValue($newObject, new ArrayCollection());

                $methodName = 'add' . ucfirst(substr($name, 0, -1));
                if ($reflect->hasMethod($methodName)) {
                    foreach ($value as $subObj) {

                        $newElement = self::cloneObject($subObj);
                        $newObject->$methodName($newElement);
                    }
                }
            } else if ($type === "OneToOne") {
                $reflectionProperty->setValue($newObject, null);
            }
        }

        return $newObject;
    }
}