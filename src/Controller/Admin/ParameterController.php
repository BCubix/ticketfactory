<?php

namespace App\Controller\Admin;

use App\Entity\Parameter\Parameter;
use App\Entity\Parameter\ParametersContainer;
use App\Exception\ApiException;
use App\Form\Admin\Parameter\ParametersContainerType;
use App\Form\Admin\Parameter\ParameterType;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ParameterController extends AdminController
{
    protected const ENTITY_CLASS = Parameter::class;
    protected const TYPE_CLASS = ParameterType::class;

    protected const NOT_FOUND_MESSAGE = "Les paramètres n'existent pas.";
    protected const FORM_ERROR_MESSAGE = "Il y a des erreurs dans le formulaire.";

    #[Rest\Get('/parametres')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $objects = $this->em->getRepository(static::ENTITY_CLASS)->findAllForAdmin($filters);

        return $this->view($objects, Response::HTTP_OK);
    }

    #[Rest\Post('/parametres')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request): View
    {
        $parameters = $request->request->all();
        if (!isset($parameters['parameters'])) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000,
                self::FORM_ERROR_MESSAGE);
        }

        $parametersContainer = new ParametersContainer();
        for ($i = 0; $i < count($parameters['parameters']); ++$i) {
            $parameterRequest = $parameters['parameters'][$i];

            $parameter = $this->em->getRepository(static::ENTITY_CLASS)->findOneForAdmin($parameterRequest['id']);
            if (null === $parameter) {
                throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
            }

            $parametersContainer->addParameter($parameter);
            $parameters['parameters'][$i] = [ "paramValue" => $parameterRequest["paramValue"] ];
        }

        $form = $this->createForm(ParametersContainerType::class,
            $parametersContainer);
        $fields = array_replace_recursive($parameters, $request->files->all());
        $form->submit($fields);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = $this->fec->getErrorsFromForm($form);
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000,
                self::FORM_ERROR_MESSAGE, $errors);
        }

        $parameters = $parametersContainer->getParameters();

        foreach ($parameters as $parameter) {
            $this->em->persist($parameter);
        }
        $this->em->flush();

        foreach ($parameters as $parameter) {
            $this->log->log(0, 0, 'Updated object.', static::ENTITY_CLASS, $parameter->getId());
        }

        return $this->view($parametersContainer, Response::HTTP_OK);
    }
}
