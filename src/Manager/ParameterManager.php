<?php

namespace App\Manager;

use App\Entity\Parameter\Parameter;
use App\Exception\ApiException;
use Symfony\Component\HttpFoundation\Response;

class ParameterManager extends AbstractManager
{
    public function get(string $key): Parameter
    {
        $result = $this->em->getRepository(Parameter::class)->findAllForAdmin(['paramKey' => $key]);
        if (1 !== $result['count']) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404,
                "Le paramètre avec la clé $key n'existe pas ou existe en plusieurs.");
        }

        return $result['result'][0];
    }

    public function set(string $key, $newValue)
    {
        $parameter = $this->get($key);

        $availableValue = $parameter->getAvailableValue();
        if (null !== $availableValue && !in_array($newValue, $availableValue)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404,
                "Le paramètre(s) avec la clé $key ne contient pas la valeur $newValue dans les valeurs disponibles.");
        }

        $parameter->setParamValue($newValue);
        $this->em->persist($parameter);
    }
}