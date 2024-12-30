<?php

namespace App\Service\Object;

use Doctrine\Common\Collections\ArrayCollection;

class CloneObject
{
    public const SERVICE_NAME = 'cloneObject';

    protected const RELATIONS_TYPE_MAP = [
        "Doctrine\ORM\Mapping\OneToMany" => "OneToMany",
        "Doctrine\ORM\Mapping\ManyToOne" => "ManyToOne",
        "Doctrine\ORM\Mapping\OneToOne" => "OneToOne",
        "Doctrine\ORM\Mapping\ManyToMany" => "ManyToMany",
    ];

    public static function getVariableType($reflectionProperty)
    {
        $attributes = $reflectionProperty->getAttributes();

        if (count($attributes) > 0) {
            foreach ($attributes as $attribute) {
                $arguments = $attribute->getArguments();
                $name = $attribute->getName();

                if ($name === "Doctrine\ORM\Mapping\Column" && array_key_exists("type", $arguments)) {
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

        foreach ($props as $prop) {
            $name = $prop->getName();

            $reflectionProperty = new \ReflectionProperty($className, $name);
            $reflectionProperty->setAccessible(true);

            $value = $reflectionProperty->getValue($newObject);
            $type = self::getVariableType($reflectionProperty);

            if ($name === "id") {
                $reflectionProperty->setValue($newObject, null);
            } else if ($type === "OneToMany") {
                $reflectionProperty->setValue($newObject, new ArrayCollection());

                $methodName = 'add' . ucfirst(self::pluralToSingular($name));
                if ($reflect->hasMethod($methodName)) {
                    foreach ($value as $subObj) {

                        $newElement = self::cloneObject($subObj);
                        $newObject->$methodName($newElement);
                    }
                }
            } else if ($type === "ManyToMany") {
                $newCollection = new ArrayCollection();
                foreach ($value as $relatedObject) {
                    $newCollection->add($relatedObject);
                }
                $reflectionProperty->setValue($newObject, $newCollection);
            } else if ($type === "OneToOne") {
                $reflectionProperty->setValue($newObject, null);
            }
        }

        return $newObject;
    }

    private static function pluralToSingular($plural)
    {
        if (preg_match('/ies$/', $plural)) {
            return preg_replace('/ies$/', 'y', $plural);
        } elseif (preg_match('/s$/', $plural)) {
            return rtrim($plural, 's');
        }

        return $plural;
    }
}
