<?php

namespace App\Controller\Admin;

use App\Entity\Content\Content;
use App\Exception\ApiException;
use App\Form\Admin\Content\ContentType;
use App\Form\Admin\Filters\FilterContentType;
use App\Manager\ContentTypeManager;
use App\Service\Error\FormErrorsCollector;
use App\Service\Log\Logger;
use App\Service\Object\CloneObject;

use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class ContentController extends CrudController
{
    protected const ENTITY_CLASS = Content::class;
    protected const TYPE_CLASS = ContentType::class;

    protected const NOT_FOUND_MESSAGE = "Ce contenu n'existe pas.";

    #[Rest\Get('/contents')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_content_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/contents/{contentId}', requirements: ['contentId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_content_one'])]
    public function getOne(Request $request, int $contentId): View
    {
        return parent::getOne($request, $contentId);
    }

    #[Rest\Post('/contents/{contentTypeId}/create', requirements: ['contentTypeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_content_one'])]
    public function addContent(Request $request, ContentTypeManager $ctm): View
    {
        $contentTypeId = $request->get('contentTypeId');
        $contentType = $ctm->getContentTypeFromId($contentTypeId);
        if (is_null($contentType)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le type de contenu demandé n'a pas été trouvé.");
        }

        $object = new $this->entityClass();
        $iObject = CloneObject::cloneObject($object);

        $this->hs->exec($this->entityClassName . 'Instantiated', [
            'object' => $object,
            'state'  => 'add'
        ]);

        $form = $this->createForm($this->typeClass, $object, ['content_type' => $contentType]);
        $fields = array_replace_recursive($request->request->all(), $request->files->all());
        $form->submit($fields);

        if (!$form->isSubmitted() || !$form->isValid()) {
            $errors = $this->fec->getErrorsFromForm($form);

            throw new ApiException(Response::HTTP_BAD_REQUEST, 1000, self::FORM_ERROR_MESSAGE, $errors);
        }

        $this->lm->setTranslationsProperties($object);

        $this->hs->exec($this->entityClassName . 'Validated', [
            'iObject' => $iObject,
            'vObject' => $object,
            'state'   => 'add'
        ]);

        $object->setContentType($contentType);

        $this->em->persist($object);
        $this->em->flush();

        $this->log->log(0, 0, 'Created object.', $this->entityClass, $object->getId());

        return $this->view($object, Response::HTTP_CREATED);
    }

    #[Rest\Post('/contents/{contentId}/edit', requirements: ['contentId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_content_one'])]
    public function edit(Request $request, int $contentId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($contentId);
        if (null === $object) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $iObject = CloneObject::cloneObject($object);

        $this->hs->exec($this->entityClassName . 'Instantiated', [
            'object' => $object,
            'state' => 'edit'
        ]);

        $form = $this->createForm($this->typeClass, $object, ['content_type' => $object->getContentType()]);
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

        $this->log->log(0, 0, 'Updated object.', $this->entityClass, $object->getId());

        return $this->view($object, Response::HTTP_OK);
    }

    #[Rest\Delete('/contents/{contentId}', requirements: ['contentId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_content_one'])]
    public function delete(Request $request, int $contentId): View
    {
        return parent::delete($request, $contentId);
    }

    #[Rest\Get('/contents/{contentId}/translated/{languageId}', requirements: ['contentId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_content_one'])]
    public function getTranslated(Request $request, int $contentId, int $languageId): View
    {
        return parent::getTranslated($request, $contentId, $languageId);
    }

    #[Rest\Get('/contents/{contentTypeId}/availableContent', requirements: ['contentTypeId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all'])]
    public function getAvailableContent(Request $request, int $contentTypeId): View
    {
        $count = $this->em->getRepository($this->entityClass)->findNumberOfContentForAdmin($contentTypeId);

        return $this->view($count, Response::HTTP_OK);
    }

    #[Rest\Get('/contents/{pageId}/page', requirements: ['pageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_content_one'])]
    public function getContentFromPageId(Request $request, int $pageId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findContentByPageIdForAdmin($pageId);

        return $this->view($object, Response::HTTP_OK);
    }
}
