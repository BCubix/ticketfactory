<?php

namespace App\Manager;

use App\Entity\Parameter\Parameter;
use App\Exception\ApiException;
use Symfony\Component\HttpFoundation\Response;

class ParameterManager extends AbstractManager
{
    public function get(string $key)
    {
        $parameter = $this->em->getRepository(Parameter::class)->findOneByKeyForAdmin($key);
        if (null === $parameter) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le paramètre avec la clé $key n'existe pas.");
        }
        return $parameter->getParamValue();
    }

    public function set(string $key, $newValue)
    {
        $parameter = $this->em->getRepository(Parameter::class)->findOneByKeyForAdmin($key);
        if (null === $parameter) {
            $parameter = new Parameter();
            $parameter->setName($key);
            $parameter->setType('string');
            $parameter->setParamKey($key);
        }

        $availableValue = $parameter->getAvailableValue();
        if (null !== $availableValue && !in_array($newValue, $availableValue)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404,
                "Le paramètre(s) avec la clé $key ne contient pas la valeur $newValue dans les valeurs disponibles.");
        }

        $parameter->setParamValue($newValue);
        $this->em->persist($parameter);
    }
}