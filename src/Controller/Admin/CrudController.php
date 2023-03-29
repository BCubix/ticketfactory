<?php

namespace App\Controller\Admin;

use App\Exception\ApiException;
use App\Manager\LanguageManager;
use App\Service\Error\FormErrorsCollector;
use App\Service\Hook\HookService;
use App\Service\Log\Logger;
use App\Service\Object\CloneObject;


use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
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
    protected $entityClassName;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        HookService $hs,
        LanguageManager $lm
    ) {
        parent::__construct($em, $se, $fec, $log, $hs, $lm);

        $this->entityClass = static::ENTITY_CLASS;
        $this->typeClass = static::TYPE_CLASS;

        $path = explode('\\', $this->entityClass);
        $this->entityClassName = array_pop($path);
    }

    protected function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;

        $objects = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters);
        $objects = $this->lm->getAllTranslations($objects, $this->entityClass, $filters);

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
        $iObject = CloneObject::cloneObject($object);

        $this->hs->exec($this->entityClassName . 'Instantiated', [
            'object' => $object,
            'state'  => 'add'
        ]);

        $form = $this->createForm($this->typeClass, $object);
        $fields = array_replace_recursive($request->request->all(), $request->files->all());
        $form->submit($fields);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = $this->fec->getErrorsFromForm($form);

            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, self::FORM_ERROR_MESSAGE, $errors);
        }

        $this->hs->exec($this->entityClassName . 'Validated', [
            'iObject' => $iObject,
            'vObject' => $object,
            'state'   => 'add'
        ]);

        $this->em->persist($object);
        $this->em->flush();

        $this->hs->exec($this->entityClassName . 'Saved', [
            'iObject' => $iObject,
            'sObject' => $object,
            'state'   => 'add'
        ]);

        $this->log->log(0, 0, 'Created object.', $this->entityClass, $object->getId());

        return $this->view($object, Response::HTTP_CREATED);
    }

    protected function edit(Request $request, int $id): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($id);
        if (null === $object) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $iObject = CloneObject::cloneObject($object);

        $this->hs->exec($this->entityClassName . 'Instantiated', [
            'object' => $object,
            'state'  => 'edit'
        ]);

        $form = $this->createForm($this->typeClass, $object);
        $fields = array_replace_recursive($request->request->all(), $request->files->all());
        $form->submit($fields);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = $this->fec->getErrorsFromForm($form);

            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, self::FORM_ERROR_MESSAGE, $errors);
        }

        $this->hs->exec($this->entityClassName . 'Validated', [
            'iObject' => $iObject,
            'vObject' => $object,
            'state'   => 'edit'
        ]);

        $this->em->persist($object);
        $this->em->flush();

        $this->hs->exec($this->entityClassName . 'Saved', [
            'iObject' => $iObject,
            'sObject' => $object,
            'state'   => 'edit'
        ]);

        $this->log->log(0, 0, 'Updated object.', $this->entityClass, $object->getId());

        return $this->view($object, Response::HTTP_OK);
    }

    public function duplicate(Request $request, int $id): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($id);
        if (null === $object) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $this->hs->exec($this->entityClassName . 'Instantiated', [
            'object' => $object,
            'state'  => 'duplicate'
        ]);

        $nObject = CloneObject::cloneObject($object);

        $this->lm->duplicateElement($nObject);
        $this->em->persist($nObject);
        $this->em->flush();

        $this->log->log(0, 0, 'Duplicated object.', $this->entityClass, $object->getId());

        return $this->view($nObject, Response::HTTP_OK);
    }

    protected function delete(Request $request, int $id): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($id);
        if (null === $object) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $this->hs->exec($this->entityClassName . 'Instantiated', [
            'object' => $object,
            'state'  => 'delete'
        ]);

        $this->lm->deleteTranslation($object, $this->entityClass);
        $objectId = $object->getId();

        $this->em->remove($object);
        $this->em->flush();

        $this->log->log(0, 0, 'Deleted object.', $this->entityClass, $objectId);

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    protected function getTranslated(Request $request, int $id, int $languageId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($id);
        if (null === $object) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $result = $this->lm->translateElement($object, $languageId);

        return $this->view($result, Response::HTTP_OK);
    }
}
