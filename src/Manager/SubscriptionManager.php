<?php

namespace App\Manager;

use App\Entity\Customer\Customer;
use App\Entity\Event\Event;
use App\Kernel;
use App\Entity\Order\Cart;
use App\Entity\Order\SubscriptionRow;
use App\Entity\Subscription\Subscription;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;

class SubscriptionManager extends AbstractManager
{
    public const SERVICE_NAME = 'subscription';

    private $sc;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        Security $sc,
    ) {
        $this->sc = $sc;

        parent::__construct($kl, $mf, $sf, $em, $rs);
    }

    public function getSubscriptionsForWebsite(?int $languageId = null): array
    {
        if (null === $languageId) {
            $languageId = $this->getLanguageId();
        }

        return $this->em->getRepository(Subscription::class)->findAllForWebsite($languageId);
    }

    public function getRemainingSubscriptionUsages(Customer $customer): array
    {
        $subscriptionRows = $this->em->getRepository(SubscriptionRow::class)->findAllAvailableSubscriptions($customer->getId());

        $subscriptionsUsage = [];
        foreach ($subscriptionRows as $subscriptionRow) {
            $subscriptionsUsage[] = [
                'subscriptionRow' => $subscriptionRow,
                'remainingEvents' => ($subscriptionRow->getSubscription()->getEventNb() * $subscriptionRow->getQuantity()) - count($subscriptionRow->getSubscriptionUsages()),
            ];
        }

        return $subscriptionsUsage;
    }

    public function findSubscriptionForCart(?Cart $cart)
    {
        // Get customer and check if customer and cart are not null
        $customer = $this->sc->getUser();
        if (null === $customer || null === $cart) {
            return [];
        }

        // Get the remaining subscriptionUsages in array
        $subscriptionUsages = $this->getRemainingSubscriptionUsages($customer);
        $subscriptionDiscount = [];
        $total = 0;

        foreach ($cart->getEventRows() as $eventRow) {
            $eventSeats = $eventRow->getEventSeats()->toArray();
            usort($eventSeats, function ($seatA, $seatB) {
                return $seatA->getEventPrice()->getPrice() <=> $seatB->getEventPrice()->getPrice();
            });

            $remainingSeatsToDiscount = count($eventSeats);
            $totalDiscountAmount = 0;
            $discountedSeats = [];

            foreach ($subscriptionUsages as &$subscriptionUsage) {
                if (!$this->checkIfEventIsInSubscription($eventRow->getEvent(), $subscriptionUsage['subscriptionRow']->getSubscription()->getEvents()->toArray())) {
                    continue;
                }

                $remainingEvents = &$subscriptionUsage['remainingEvents'];
                if ($remainingEvents > 0) {
                    $discountableSeats = min($remainingSeatsToDiscount, $remainingEvents);

                    $seatsToDiscount = array_slice($eventSeats, 0, $discountableSeats);
                    foreach ($seatsToDiscount as $seat) {
                        $discountedSeats[] =[
                            "subscriptionRow" => $subscriptionUsage["subscriptionRow"],
                            "eventSeat"       => $seat
                        ];
                        $totalDiscountAmount += $seat->getEventPrice()->getPrice();
                    }

                    $eventSeats = array_slice($eventSeats, $discountableSeats);
                    $remainingSeatsToDiscount -= $discountableSeats;
                    $remainingEvents -= $discountableSeats;

                    if ($remainingSeatsToDiscount === 0) {
                        break;
                    }
                }
            }

            if ($totalDiscountAmount > 0) {
                $total += $totalDiscountAmount;
                $subscriptionDiscount[] = [
                    'event' => $eventRow->getEvent(),
                    'eventSeats' => $discountedSeats,
                    'totalDiscount' => $totalDiscountAmount,
                ];
            }
        }

        return [
            'subscriptionDiscounts' => $subscriptionDiscount,
            'total' => $total,
        ];
    }

    private function checkIfEventIsInSubscription(Event $event, array $subscriptionEvents): bool
    {
        $eventIds = array_map(fn($subscriptionEvent) => $subscriptionEvent->getId(), $subscriptionEvents);

        return in_array($event->getId(), $eventIds, true);
    }
}
