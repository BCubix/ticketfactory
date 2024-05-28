<?php

namespace App\Controller\Admin;

use App\Entity\Event\Event;
use App\Entity\Product\Product;
use App\Entity\Ticketing\Ticketing;
use App\Exception\ApiException;
use App\Form\Admin\Ticketing\TicketingType;
use App\Manager\HookManager;
use App\Manager\LanguageManager;
use App\Manager\ManagerFactory;
use App\Service\Error\FormErrorsCollector;
use App\Service\Log\Logger;
use App\Service\ServiceFactory;
use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class TicketingController extends CrudController
{
    protected const ENTITY_CLASS = Ticketing::class;
    protected const TYPE_CLASS = TicketingType::class;

    protected const NOT_FOUND_MESSAGE = "Cette billetterie n'existe pas.";

    protected $sf;

    public function __construct(
        EntityManagerInterface $em,
        SerializerInterface $se,
        FormErrorsCollector $fec,
        Logger $log,
        LanguageManager $lm,
        HookManager $hm,
        ManagerFactory $mf,
        ServiceFactory $sf,
    ) {
        parent::__construct($em, $se, $fec, $log, $lm, $hm, $mf);

        $this->sf = $sf;
    }

    #[Rest\Get('/ticketing')]
    #[Rest\QueryParam(map: true, name: 'filters', default: '')]
    #[Rest\View(serializerGroups: ['a_all', 'a_ticketing_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        return parent::getAll($request, $paramFetcher);
    }

    #[Rest\Get('/ticketing/{ticketingId}', requirements: ['ticketingId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_ticketing_one'])]
    public function getOne(Request $request, int $ticketingId): View
    {
        return parent::getOne($request, $ticketingId);
    }

    #[Rest\Post('/ticketing')]
    #[Rest\View(serializerGroups: ['a_all', 'a_ticketing_one'])]
    public function add(Request $request): View
    {
        return parent::add($request);
    }

    #[Rest\Post('/ticketing/{ticketingId}', requirements: ['ticketingId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_ticketing_one'])]
    public function edit(Request $request, int $ticketingId): View
    {
        return parent::edit($request, $ticketingId);
    }

    #[Rest\Delete('/ticketing/{ticketingId}', requirements: ['ticketingId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_ticketing_one'])]
    public function delete(Request $request, int $ticketingId): View
    {
        return parent::delete($request, $ticketingId);
    }

    #[Rest\Post('/ticketing/{ticketingId}/set-default-ticketing', requirements: ['ticketingId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_ticketing_one'])]
    public function setDefaultTicketing(Request $request, int $ticketingId): View
    {
        $defaultTicketing = $this->em->getRepository($this->entityClass)->findDefaultForAdmin();
        if (null !== $defaultTicketing && $defaultTicketing->getId() === $ticketingId) {
            return $this->view(null, Response::HTTP_NO_CONTENT);
        } else if (null !== $defaultTicketing) {
            $defaultTicketing->setDefaultTicketing(false);
            $this->em->persist($defaultTicketing);
        }

        $object = $this->em->getRepository($this->entityClass)->findOneForAdmin($ticketingId);
        if (null === $object) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, static::NOT_FOUND_MESSAGE);
        }

        $object->setDefaultTicketing(true);

        $this->em->persist($object);
        $this->em->flush();

        $this->log->log(0, 0, 'Updated object.', $this->entityClass, $object->getId());

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    #[Rest\Post('/ticketing/{ticketingId}/get-event-length', requirements: ['ticketingId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_ticketing_one'])]
    public function getEventLength(Request $request, int $ticketingId): View
    {
        $eventLength = $this->em->getRepository(Event::class)->findEventLenghtForAdmin($ticketingId);
        $productLength = $this->em->getRepository(Product::class)->findProductLenghtForAdmin($ticketingId);

        return $this->view(['events' => $eventLength, 'products' => $productLength], Response::HTTP_OK);
    }

    #[Rest\Get('/ticketing/{ticketingId}/synchronize-catalog', requirements: ['ticketingId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_ticketing_one'])]
    public function synchronizeCatalog(Request $request, int $ticketingId): View
    {
        $ticketing = $this->em->getRepository(self::ENTITY_CLASS)->findOneForAdmin($ticketingId);
        if (null === $ticketing || null === $ticketing->getModule()) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        if (!$ticketing->isCatalogSynchronization()) {
            return $this->view(null, Response::HTTP_NO_CONTENT);
        }

        $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
        if (method_exists($class, "synchronizeCatalog")) {
            $this->log->log(0, 0, "Started catalog synchronization.", $this->entityClass, $ticketing->getId());

            $syncResult = $class->synchronizeCatalog($ticketingId);
            if ($syncResult) {
                $ticketing->setLastSyncAt(new \DateTimeImmutable());
                $this->em->persist($ticketing);
                $this->em->flush();

                $this->log->log(0, 0, "Catalog synchronized.", $this->entityClass, $ticketing->getId());
            }

            return $this->view([
                'success' => $syncResult,
                'lastSyncDate' => $this->em->getRepository(self::ENTITY_CLASS)->findOneForAdmin($ticketingId)->getLastSyncAt(),
            ], Response::HTTP_OK);
        }

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }
}
