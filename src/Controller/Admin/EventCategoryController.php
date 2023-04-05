<?php

namespace App\Controller\Admin;

use App\Exception\ApiException;
use App\Entity\Event\EventCategory;
use App\Form\Admin\Event\EventCategoryType;
use App\Form\Admin\Filters\FilterEventCategoryType;
use App\Manager\EventCategoryManager;
use App\Manager\LanguageManager;
use App\Service\Error\FormErrorsCollector;
use App\Service\Hook\HookService;
use App\Service\Log\Logger;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class EventCategoryController extends CrudController
{
    protected const ENTITY_CLASS = EventCategory::class;
    protected const TYPE_CLASS = EventCategoryType::class;

    protected const NOT_FOUND_MESSAGE = "Cette catégorie n'existe pas.";

    protected $ecm;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        HookService $hs,
        EventCategoryManager $ecm,
        LanguageManager $lm
    ) {
        parent::__construct($em, $se, $fec, $log, $hs, $lm);

        $this->ecm = $ecm;
    }

    #[Rest\Get('/event-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_category_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher, int $categoryId = null): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $mainCategory = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters, $categoryId);

        $mainCategory = $this->ecm->getTranslatedChildren($mainCategory, $filters);
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

    #[Rest\Post('/event-categories')]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_category_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/event-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_category_one'])]
    public function edit(Request $request, int $categoryId): View
    {
        return parent::edit($request, $categoryId);
    }

    #[Rest\Post('/event-categories/{categoryId}/duplicate', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_category_one'])]
    public function duplicate(Request $request, int $categoryId): View
    {
        return parent::duplicate($request, $categoryId);
    }

    #[Rest\Delete('/event-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_category_one'])]
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
        $allTranslatedElements = $this->ecm->getTranslatedCategories($object);

        $deleteEvents = $request->get('deleteEvents');
        foreach($allTranslatedElements as $element) {
            if ($deleteEvents) {
                $this->ecm->deleteEventsFromCategory($element);
            } else {
                $this->ecm->attachEventsToRootCategory($element);
            }

            $this->em->remove($element);
        }

        $this->em->flush();

        $this->log->log(0, 0, 'Deleted object.', $this->entityClass, $objectId);

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    #[Rest\Get('/event-categories/{categoryId}/translated/{languageId}', requirements: ['categoryId' => '\d+', 'languageId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_category_one'])]
    public function getTranslated(Request $request, int $categoryId, int $languageId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($categoryId);
        if (null === $object) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $result = $this->ecm->translateCategory($object, $languageId);

        return $this->view($result, Response::HTTP_OK);
    }

    #[Rest\Post('/event-categories/{categoryId}/order', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_event_category_one'])]
    public function order(Request $request, int $categoryId): View
    {
        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($categoryId);
        if (null === $object) {
            throw $this->createNotFoundException(static::NOT_FOUND_MESSAGE);
        }

        $srcPosition = $request->get('src') + 1;
        $destPosition = $request->get('dest') + 1;
        if (null === $destPosition) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "La requête n'a pas les informations requises.");
        }

        $categories = $this->em->getRepository($this->entityClass)->findAllByParentForAdmin($object->getParent()->getId());

        // Order position in slider element s list
        $this->ecm->orderCategoriesElementsList($categories, $srcPosition, $destPosition);

        $this->em->flush();

        return $this->view($object, Response::HTTP_OK);
    }
}
