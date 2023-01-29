<?php

namespace App\Controller\Admin;

use App\Entity\Media\MediaCategory;
use App\Exception\ApiException;
use App\Form\Admin\Media\MediaCategoryType;
use App\Manager\LanguageManager;
use App\Manager\MediaCategoryManager;
use App\Service\Hook\HookService;
use App\Service\Logger\Logger;
use App\Utils\FormErrorsCollector;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class MediaCategoryController extends CrudController
{
    protected const ENTITY_CLASS = MediaCategory::class;
    protected const TYPE_CLASS = MediaCategoryType::class;

    protected const NOT_FOUND_MESSAGE = "Cette catégorie de média n'existe pas.";

    protected $mcm;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        HookService $hs,
        MediaCategoryManager $mcm,
        LanguageManager $lm
    ) {
        parent::__construct($em, $se, $fec, $log, $hs, $lm);

        $this->mcm = $mcm;
    }

    #[Rest\Get('/media-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher, int $categoryId = null): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $mainCategory = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters, $categoryId);

        $mainCategory = $this->mcm->getTranslatedChildren($mainCategory, $filters);

        // Hacks to delete parents and children which are not needed
        // For the moment, JMS Serializer lazy loads all categories and there is no efficient way to avoid that
        if (null != $categoryId) {
            foreach ($mainCategory->getChildren() as $child) {
                $child->resetChildren();
            }
        }

        $parent = $mainCategory->getParent();
        while (null != $parent) {
            $parent->resetChildren();

            $parent = $parent->getParent();
        }

        return $this->view($mainCategory, Response::HTTP_OK);
    }

    #[Rest\Post('/media-categories')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/media-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $categoryId): View
    {
        return parent::edit($request, $categoryId);
    }

    #[Rest\Post('/media-categories/{categoryId}/duplicate', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function duplicate(Request $request, int $categoryId): View
    {
        return parent::duplicate($request, $categoryId);
    }

    #[Rest\Delete('/media-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function delete(Request $request, int $categoryId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findAllForAdmin(['page' => 0], $categoryId);
        if (null === $object) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $this->hs->exec($this->entityClassName . 'Instantiated', [
            'object' => $object,
            'state'  => 'delete'
        ]);

        $objectId = $object->getId();
        $allTranslatedElements = $this->mcm->getTranslatedCategories($object);

        $deleteMedias = $request->get('deleteMedias');
        foreach($allTranslatedElements as $element) {
            if ($deleteMedias) {
                $this->mcm->deleteMediasFromCategory($element);
            } else {
                $this->mcm->attachMediasToRootCategory($element);
            }

            $this->em->remove($element);
        }

        $this->em->flush();

        $this->log->log(0, 0, 'Deleted object.', $this->entityClass, $objectId);

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    #[Rest\Get('/media-categories/{categoryId}/translated/{languageId}', requirements: ['categoryId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getTranslated(Request $request, int $categoryId, int $languageId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($categoryId);
        if (null === $object) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $result = $this->mcm->translateCategory($object, $languageId);

        return $this->view($result, Response::HTTP_OK);
    }
}