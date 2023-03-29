<?php

namespace App\Manager;

use App\Entity\Parameter\Parameter;
use App\Exception\ApiException;
use App\Service\File\PathGetter;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;

class ParameterManager extends AbstractManager
{
    protected $pg;

    public function __construct(
        ManagerFactory $mf,
        EntityManagerInterface $em,
        RequestStack $rs,
        PathGetter $pg
    ) {
        parent::__construct($mf, $em, $rs);

        $this->pg = $pg;
    }

    public function getAll()
    {
        $parameters = $this->em->getRepository(Parameter::class)->findAllForAdminArray();
        for ($i = 0; $i < count($parameters); ++$i) {
            if ($parameters[$i]['type'] === 'upload') {
                continue;
            }
            $parameters[$i]['paramValue'] = $this->get($parameters[$i]['paramKey']);
        }

        return $parameters;
    }

    public function get(string $key): mixed
    {
        return $this->getParameterValue($this->getParameter($key));
    }

    public function set(string $key, mixed $newValue)
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

    public function getParameter(string $key): Parameter
    {
        $parameter = $this->em->getRepository(Parameter::class)->findOneByKeyForAdmin($key);
        if (null === $parameter) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le paramètre avec la clé $key n'existe pas.");
        }

        return $parameter;
    }

    public function getParameterValue(Parameter $parameter): mixed
    {
        $format = $parameter->getType();
        $value  = $parameter->getParamValue();

        if (null === $value || "null" === $value) {
            return null;
        }

        switch($format) {
            case 'int':
                return intval($value);

            case 'bool':
                return boolval($value);

            case 'upload':
                // @TODO : Dynamise the file path
                return $this->pg->getPublicDir() . 'uploads/parameter/' . $value;

            case 'string':
            default:
                return $value;
        }
    }
}
