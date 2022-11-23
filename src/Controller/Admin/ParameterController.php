<?php

namespace App\Controller\Admin;

use App\Entity\Parameter\Parameter;
use App\Entity\Parameter\ParametersContainer;
use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Event\Admin\CrudObjectValidatedEvent;
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
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, ParamFetcher $paramFetcher)
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $parameters = $this->em->getRepository(static::ENTITY_CLASS)->findAllForAdmin($filters);
        if (null === $parameters) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $parameters = $parameters["results"];

        $parametersContainer = new ParametersContainer();
        foreach ($parameters as $parameter) {
            $parametersContainer->addParameter($parameter);
        }

        $event = new CrudObjectInstantiatedEvent($parametersContainer, 'edit');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $form = $this->createForm(ParametersContainerType::class,
            $parametersContainer);
        $fields = array_replace_recursive($request->request->all(), $request->files->all());
        $form->submit($fields);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = $this->fec->getErrorsFromForm($form);
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000,
                self::FORM_ERROR_MESSAGE, $errors);
        }

        $event = new CrudObjectValidatedEvent($parametersContainer);
        $this->ed->dispatch($event, CrudObjectValidatedEvent::NAME);

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
