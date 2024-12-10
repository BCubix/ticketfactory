<?php

namespace App\Manager;

use App\Entity\ContactRequest\ContactRequest;
use App\Entity\Content\Content;
use App\Entity\Customer\Customer;
use App\Entity\Notification\Notification;
use App\Entity\Order\Order;
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

    public function createContentPublicationStatusNotification(Content $content): void
    {
        $users = $this->em->getRepository(User::class)->findAllByRoleForAdmin('ROLE_CONTENT_PUBLISH');
        foreach ($users as $user) {
            $notification = new Notification();
            $notification->setTitle("Contenu à valider");
            $notification->setDescription("Le contenu (" . $content->getTitle() . ") est prête à être validée.");
            $notification->setType('Content');
            $notification->setObjectId($content->getId());
            $notification->setUser($user);

            $this->em->persist($notification);
        }

        $this->em->flush();
    }

    public function createNewOrderNotification(Order $order): void
    {
        $users = $this->em->getRepository(User::class)->findAllByRoleForAdmin('ROLE_ORDER_READ');
        foreach ($users as $user) {
            $notification = new Notification();
            $notification->setTitle("Nouvelle commande");
            $notification->setDescription("Une nouvelle commande vient d'être passée.");
            $notification->setType('Order');
            $notification->setObjectId($order->getId());
            $notification->setUser($user);

            $this->em->persist($notification);
        }

        $this->em->flush();
    }

    public function createNewCustomerNotification(Customer $customer): void
    {
        $users = $this->em->getRepository(User::class)->findAllByRoleForAdmin('ROLE_CUSTOMER_READ');
        foreach ($users as $user) {
            $notification = new Notification();
            $notification->setTitle("Nouveau client");
            $notification->setDescription("Un nouveau client vient de s'inscrire.");
            $notification->setType('Customer');
            $notification->setObjectId($customer->getId());
            $notification->setUser($user);

            $this->em->persist($notification);
        }

        $this->em->flush();
    }

    public function createNewContactRequestNotification(ContactRequest $contactRequest): void
    {
        $users = $this->em->getRepository(User::class)->findAllByRoleForAdmin('ROLE_CONTACT_REQUEST_READ');
        foreach ($users as $user) {
            $notification = new Notification();
            $notification->setTitle("Nouvelle demande de contact");
            $notification->setDescription("Vous avez reçu une nouvelle demande de contact.");
            $notification->setType('ContactRequest');
            $notification->setObjectId($contactRequest->getId());
            $notification->setUser($user);

            $this->em->persist($notification);
        }

        $this->em->flush();
    }

    public function createNewNotification(array $notificationData): void
    {
        if (isset($notificationData['role'])) {
            $users = $this->em->getRepository(User::class)->findAllByRoleForAdmin($notificationData['role']);
        } else {
            $users = $this->em->getRepository(User::class)->findAll();
        }

        foreach ($users as $user) {
            $notification = new Notification();
            $notification->setTitle($notificationData['title'] ?? "");
            $notification->setDescription($notificationData['description'] ?? "");
            $notification->setType($notificationData['type'] ?? "");
            $notification->setObjectId($notificationData['objectId'] ?? null);
            $notification->setUser($user);

            $this->em->persist($notification);
        }

        $this->em->flush();
    }
}
