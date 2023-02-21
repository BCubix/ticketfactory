<?php

namespace App\Controller\Admin;

use App\Entity\Parameter\Parameter;
use App\Entity\Parameter\ParametersContainer;
use App\Exception\ApiException;
use App\Form\Admin\Parameter\ParametersContainerType;
use App\Form\Admin\Parameter\ParameterType;

use App\Manager\ParameterManager;
use FOS\RestBundle\Controller\Annotations as Rest;
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
    #[Rest\View(serializerGroups: ['a_all', 'a_parameter_all'])]
    public function getAll(Request $request, ParameterManager $pm): View
    {
        return $this->view($pm->getAll(), Response::HTTP_OK);
    }

    #[Rest\Get('/parametres/{parameterKey}', requirements: ['parameterKey' => '.+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_parameter_one'])]
    public function getValue(Request $request, string $parameterKey, ParameterManager $pm): View
    {
        return $this->view($pm->get($parameterKey), Response::HTTP_OK);
    }

    #[Rest\Post('/parametres')]
    #[Rest\View(serializerGroups: ['a_all', 'a_parameter_one'])]
    public function edit(Request $request, ParameterManager $pm): View
    {
        $parameters = $request->request->all();
        if (!isset($parameters['parameters'])) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000,
                self::FORM_ERROR_MESSAGE);
        }

        $parametersContainer = new ParametersContainer();
        for ($i = 0; $i < count($parameters['parameters']); ++$i) {
            $parameterRequest = $parameters['parameters'][$i];

            $parameter = $pm->getParameter($parameterRequest['paramKey']);
            $parametersContainer->addParameter($parameter);

            $parameters['parameters'][$i] = [ 'paramValue' => $parameterRequest['paramValue'] ];
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
