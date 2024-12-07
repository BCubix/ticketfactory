<?php

namespace App\Manager;

use App\Entity\Notification\Notification;
use App\Entity\Page\Page;
use App\Entity\User\User;

class NotificationManager extends AbstractManager
{
    public const SERVICE_NAME = 'notification';

    public function createPagePublicationStatusNotification(Page $page): void
    {
        $users = $this->em->getRepository(User::class)->findAllByRoleForAdmin('ROLE_PAGE_PUBLISH');
        foreach ($users as $user) {
            $notification = new Notification();
            $notification->setTitle("Page à valider");
            $notification->setDescription("La page (" . $page->getTitle() . ") est prête à être validée.");
            $notification->setType('Page');
            $notification->setObjectId($page->getId());
            $notification->setUser($user);

            $this->em->persist($notification);
        }

        $this->em->flush();
    }

}
