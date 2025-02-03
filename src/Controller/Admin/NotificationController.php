<?php

namespace App\Controller\Admin;

use App\Entity\Notification\Notification;
use App\Exception\ApiException;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Rest\Route('/api')]
class NotificationController extends CrudController
{
    protected const ENTITY_CLASS = Notification::class;

    protected const NOT_FOUND_MESSAGE = "Cette notification n'existe pas.";

    #[Rest\Get('/notifications')]
    #[Rest\QueryParam(map:true, name:'filters', default:'')]
    #[Rest\View(serializerGroups: ['a_all', 'a_notification_all'])]
    public function getAll(Request $request, ParamFetcher $paramFetcher): View
    {
        $filters = $paramFetcher->get('filters');
        $filters = empty($filters) ? [] : $filters;

        $user = $this->getUser();
        $notifications = $this->em->getRepository(Notification::class)->findAllNotificationForUser($user->getId(), $filters);

        return $this->view($notifications, Response::HTTP_OK);
    }

    #[Rest\Get('/notifications/{notificationId}', requirements: ['notificationId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_notification_one'])]
    public function getOne(Request $request, int $notificationId): View
    {
        $user = $this->getUser();

        $notification = $this->em->getRepository(Notification::class)->findOneNotificationForUser($notificationId, $user->getId());
        if (is_null($notification)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        return $this->view($notification, Response::HTTP_OK);
    }

    #[Rest\Post('/notifications/{notificationId}', requirements: ['notificationId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_notification_one'])]
    public function read(Request $request, int $notificationId): View
    {
        $user = $this->getUser();

        $notification = $this->em->getRepository(Notification::class)->findOneNotificationForUser($notificationId, $user->getId());
        if (is_null($notification)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        $notification->setReaded(true);

        $this->em->persist($notification);
        $this->em->flush();

        return $this->view($notification, Response::HTTP_OK);
    }

    #[Rest\Delete('/notifications')]
    #[Rest\View(serializerGroups: ['a_all', 'a_notification_all'])]
    public function deleteAll(Request $request): View
    {
        $user = $this->getUser();
        $notifications = $this->em->getRepository(Notification::class)->findAllNotificationForUser($user->getId());

        $this->hm->exec($this->entityClassName . 'Instantiated', [
            'objects' => $notifications,
            'user'   => $user,
            'state'  => 'delete'
        ]);

        $objectIds = [];
        foreach ($notifications as $notification) {
            $objectIds[] = $notification->getId();

            $this->em->remove($notification);
        }

        $this->em->flush();

        $this->hm->exec($this->entityClassName . 'Deleted', [
            'objectIds' => $objectIds,
            'user'     => $user
        ]);

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }

    #[Rest\Delete('/notifications/{notificationId}', requirements: ['notificationId' => '\d+'])]
    #[Rest\View(serializerGroups: ['a_all', 'a_notification_one'])]
    public function deleteOne(Request $request, int $notificationId): View
    {
        $user = $this->getUser();

        $notification = $this->em->getRepository(Notification::class)->findOneNotificationForUser($notificationId, $user->getId());
        if (is_null($notification)) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, self::NOT_FOUND_MESSAGE);
        }

        $this->hm->exec($this->entityClassName . 'Instantiated', [
            'object' => $notification,
            'user'   => $user,
            'state'  => 'delete'
        ]);

        $objectId = $notification->getId();

        $this->em->remove($notification);
        $this->em->flush();

        $this->hm->exec($this->entityClassName . 'Deleted', [
            'objectId' => $objectId,
            'user'     => $user
        ]);

        return $this->view(null, Response::HTTP_NO_CONTENT);
    }
}
