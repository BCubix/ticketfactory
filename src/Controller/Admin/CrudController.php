<?php

namespace App\Controller\Admin;

use App\Event\Admin\CrudObjectInstantiatedEvent;
use App\Event\Admin\CrudObjectValidatedEvent;
use App\Exception\ApiException;
use App\Service\Logger\Logger;
use App\Utils\FormErrorsCollector;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

abstract class CrudController extends AdminController
{
    protected const ENTITY_CLASS = null;
    protected const TYPE_CLASS = null;

    protected const NOT_FOUND_MESSAGE = "Cet élément n'existe pas.";
    protected const FORM_ERROR_MESSAGE = "Il y a des erreurs dans le formulaire.";

    protected $entityClass;
    protected $typeClass;

    public function __construct(EventDispatcherInterface $ed, EntityManagerInterface $em, SerializerInterface $se, FormErrorsCollector $fec, Logger $log)
    {
        parent::__construct($ed, $em, $se, $fec, $log);

        $this->entityClass = static::ENTITY_CLASS;
        $this->typeClass = static::TYPE_CLASS;
    }

    protected function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $objects = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters);

        return $this->view($objects, Response::HTTP_OK);
    }

    protected function getOne(Request $request, int $id): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($id);
        if (is_null($object)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        return $this->view($object, Response::HTTP_OK);
    }

    protected function add(Request $request): View
    {
        $object = new $this->entityClass();

        $event = new CrudObjectInstantiatedEvent($object, 'add');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $form = $this->createForm($this->typeClass, $object);
        $fields = array_replace_recursive($request->request->all(), $request->files->all());
        $form->submit($fields);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = $this->fec->getErrorsFromForm($form);

            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, self::FORM_ERROR_MESSAGE, $errors);
        }

        $event = new CrudObjectValidatedEvent($object);
        $this->ed->dispatch($event, CrudObjectValidatedEvent::NAME);

        $this->em->persist($object);
        $this->em->flush();

        $this->log->log(0, 0, 'Created object.', $this->entityClass, $object->getId());

        return $this->view($object, Response::HTTP_CREATED);
    }

    protected function edit(Request $request, int $id): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($id);
        if (null === $object) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $event = new CrudObjectInstantiatedEvent($object, 'edit');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $form = $this->createForm($this->typeClass, $object);
        $fields = array_replace_recursive($request->request->all(), $request->files->all());
        $form->submit($fields);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = $this->fec->getErrorsFromForm($form);

            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, self::FORM_ERROR_MESSAGE, $errors);
        }

        $event = new CrudObjectValidatedEvent($object);
        $this->ed->dispatch($event, CrudObjectValidatedEvent::NAME);

        $this->em->persist($object);
        $this->em->flush();

        $this->log->log(0, 0, 'Updated object.', $this->entityClass, $object->getId());

        return $this->view($object, Response::HTTP_OK);
    }

    public function duplicate(Request $request, int $eventId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($id);
        if (null === $object) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $event = new CrudObjectInstantiatedEvent($object, 'duplicate');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $object = clone $object;

        $this->em->persist($object);
        $this->em->flush();

        $this->log->log(0, 0, 'Duplicated object.', $this->entityClass, $object->getId());

        return $this->view($object, Response::HTTP_OK);
    }

    protected function delete(Request $request, int $id): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($id);
        if (null === $object) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $event = new CrudObjectInstantiatedEvent($object, 'delete');
        $this->ed->dispatch($event, CrudObjectInstantiatedEvent::NAME);

        $objectId = $object->getId();

        $this->em->remove($object);
        $this->em->flush();

        $this->log->log(0, 0, 'Deleted object.', $this->entityClass, $objectId);

        return $this->view(null, Response::HTTP_OK);
    }
}
