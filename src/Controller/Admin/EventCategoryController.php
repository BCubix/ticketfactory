<?php

namespace App\Controller\Admin;

use App\Entity\Event\EventCategory;
use App\Form\Admin\Event\EventCategoryType;
use App\Form\Admin\Filters\FilterEventCategoryType;
use App\Manager\EventCategoryManager;
use App\Service\Hook\HookService;
use App\Service\Logger\Logger;
use App\Utils\FormErrorsCollector;

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
        EventCategoryManager $ecm
    ) {
        parent::__construct($em, $se, $fec, $log, $hs);

        $this->ecm = $ecm;
    }

    #[Rest\Get('/event-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher, int $categoryId = null): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;
        $mainCategory = $this->em->getRepository($this->entityClass)->findAllForAdmin($filters, $categoryId);

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
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/event-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function edit(Request $request, int $categoryId): View
    {
        return parent::edit($request, $categoryId);
    }

    #[Rest\Post('/event-categories/{categoryId}/duplicate', requirements: ['categoryId' => '\d+'])]
    #[Rest\View(serializerGroups: ['tf_admin'])]
    public function duplicate(Request $request, int $categoryId): View
    {
        return parent::duplicate($request, $categoryId);
    }

    #[Rest\Delete('/event-categories/{categoryId}', requirements: ['categoryId' => '\d+'])]
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

        $deleteEvents = $request->get('deleteEvents');
        if ($deleteEvents) {
            $this->ecm->deleteEventsFromCategory($object);
        } else {
            $this->ecm->attachEventsToRootCategory($object);
        }

        $this->em->remove($object);
        $this->em->flush();

        $this->log->log(0, 0, 'Deleted object.', $this->entityClass, $objectId);

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }
}
