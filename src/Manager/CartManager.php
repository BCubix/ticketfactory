<?php

namespace App\Manager;

use App\Kernel;
use App\Service\Formatter\DateTimeFormatter;
use App\Service\ServiceFactory;
use App\Service\File\MimeTypeMapping;
use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventPrice;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class CartManager extends AbstractManager
{
    public const SERVICE_NAME = 'cart';

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);
    }

    public function getCartForFront(): ?array
    {
        $session = $this->rs->getSession();
        $cart = $session->get("cart", null);
        $reservedEvents = [];

        if (null === $cart) {
            return $reservedEvents;
        }

        foreach ($cart as $cartRow) {
            $event = $this->em->getRepository(Event::class)->findOneByIdForFront($cartRow["event"]);
            $eventDate = $this->em->getRepository(EventDate::class)->findOneByIdForWebsite($cartRow["eventDate"], $cartRow["event"]);
            $eventPrice = $this->em->getRepository(EventPrice::class)->findOneByIdForWebsite($cartRow["eventPrice"], $cartRow["event"]);

            if ($event && $eventDate && $eventPrice) {
                $reservedEvents[] = [
                    "event"      => $event,
                    "eventDate"  => $eventDate,
                    "eventPrice" => $eventPrice,
                    "quantity"   => $cartRow["quantity"],
                ];
            }
        }

        return $reservedEvents;
    }

    public function getCart(): ?array
    {
        $session = $this->rs->getSession();

        return $session->get("cart", null);
    }

    public function addEventToCart(array $element): void
    {
        $session = $this->rs->getSession();
        $cart = $session->get("cart", []);
        $isPushed = false;
        $newCart = [];

        foreach ($cart as $cartRow) {
            $eventId = $cartRow["event"] === $element["event"];
            $eventDate = $cartRow["eventDate"] === $element["eventDate"];
            $eventPrice = $cartRow["eventPrice"] === $element["eventPrice"];

            if ($eventId && $eventDate && $eventPrice) {
                $cartRow["quantity"] += $element["quantity"];
                $isPushed = true;
            }

            $newCart[] = $cartRow;
        }

        if (!$isPushed) {
            $newCart[] = $element; 
        }

        $session->set("cart", $newCart);
    }
}
