<?php

namespace App\Manager;

use App\Kernel;
use App\Service\ServiceFactory;
use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventPrice;
use App\Entity\Order\Cart;
use App\Entity\Order\Voucher;
use App\Entity\Order\EventRow;
use App\Entity\Order\EventSeat;
use App\Exception\ApiException;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;

class CartManager extends AbstractManager
{
    public const SERVICE_NAME = 'cart';

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

    public function createNewCart(): Cart
    {
        $cart = new Cart();
        $cart->setActive(true);
        $cart->setTotal(0);

        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartId", $cart->getId());
        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        return $cart;
    }

    public function createNewEventRow(Cart $cart, Event $event, EventDate $eventDate): EventRow
    {
        $eventRow = new EventRow();
        $eventRow->setEvent($event);
        $eventRow->setEventDate($eventDate);
        $eventRow->setTotal(0);

        $cart->addEventRow($eventRow);

        $this->em->persist($eventRow);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        return $eventRow;
    }

    public function addNewEventSeats(EventRow $eventRow, EventPrice $eventPrice, int $quantity): EventRow
    {
        foreach (range(1, $quantity) as $index) {
            $seat = new EventSeat();
            $seat->setEventPrice($eventPrice);

            $eventRow->addEventSeat($seat);
        }

        return $this->calculateEventRowTotal($eventRow);
    }

    public function calculateEventRowTotal(EventRow $eventRow): EventRow
    {
        $total = 0;

        foreach ($eventRow->getEventSeats() as $seat) {
            $total += $seat->getEventPrice()->getPrice();
        }

        $eventRow->setTotal($total);

        return $eventRow;
    }

    public function calculateCartTotal(Cart $cart): Cart
    {
        $total = 0;

        foreach ($cart->getEventRows() as $row) {
            $total += $this->calculateEventRowTotal($row)->getTotal();
        }

        $cart->setTotal($total);

        return $cart;
    }

    public function addEventToCart(Event $event, array $data): void
    {
        $session = $this->rs->getSession();
        $eventDate = $data["eventDate"];
        $eventPrices = $data["eventPrices"];

        if (null === $eventDate || null === $eventPrices) {
            $message = null === $eventDate ? "La date spécifié n'existe pas." : "Le placement demandé n'existe pas";
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, $message);
        }

        $cartId = $session->get("cartId", null);
        $cart = $cartId ? $this->em->getRepository(Cart::class)->findOneByIdForWebsite($cartId) : $this->createNewCart();
        if (null === $cart) {
            $cart = $this->createNewCart();
        }

        $eventRow = null === $cartId ? null : $this->em->getRepository(EventRow::class)->findOneEventRowByCartForWebsite($cart->getId(), $eventDate->getId());
        if (null === $eventRow) {
            $eventRow = $this->createNewEventRow($cart, $event, $eventDate);
        }

        foreach ($eventPrices as $eventPrice) {
            if ($eventPrice['quantity'] > 0) {
                $this->addNewEventSeats($eventRow, $eventPrice["eventPrice"], $eventPrice['quantity']);
            }
        }

        $cart = $this->calculateCartTotal($cart);
        $this->em->persist($cart);
        $this->em->flush();

        $ticketing = $event->getTicketing();
        if (null === $ticketing || null === $ticketing->getModule() || $ticketing->getType() !== "api" || !$ticketing->isOrderTunnel()) {
            return;
        }

        $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
        if (method_exists($class, "synchronizeCartInfo")) {
            $class->synchronizeCartInfo($event, $cart);
        }
    }

    public function getCart(): ?Cart
    {
        $session = $this->rs->getSession();
        $cart = null;

        $cartId = $session->get("cartId", null);
        if (null !== $cartId) {
            $cart =  $this->em->getRepository(Cart::class)->findOneByIdForWebsite($cartId);
        }

        $customer = $this->sc->getUser();
        if (null !== $customer) {
            $customerCart = $this->em->getRepository(Cart::class)->getLatestCart($customer->getId());
            $sessionUpdatedAt = $session->get("cartUpdatedAt", null);

            if (null !== $cart) {
                if (null === $customerCart) {
                    $session->set("cartUpdatedAt", new \DateTimeImmutable("now"));

                    $customer->addCart($cart);
                    $this->em->persist($customer);
                    $this->em->flush();

                    return $cart;
                }

                if (null === $sessionUpdatedAt) {
                    $session->set("cartId", $customerCart->getId());
                    $session->set("cartUpdatedAt", $customerCart->getUpdatedAt());

                    return $customerCart;
                }

                $sessionUpdatedAt = $sessionUpdatedAt;
                $cartUpdatedAt = $customerCart->getUpdatedAt();

                if ($sessionUpdatedAt > $cartUpdatedAt) {
                    $cart->setCustomer($customer);
                    $this->em->persist($cart);
                    $this->em->flush();

                    return $cart;
                } else {
                    $session->set("cartId", $customerCart->getId());
                    $session->set("cartUpdatedAt", $customerCart->getUpdatedAt());

                    return $customerCart;
                }
            } else {
                if (null !== $customerCart) {
                    $session->set("cartId", $customerCart->getId());
                    $session->set("cartUpdatedAt", $customerCart->getUpdatedAt());

                    return $customerCart;
                }

                return null;
            }
        }

        return $cart;
    }

    public function getEventSeatsGrouped($eventRow): ?array
    {
        $eventSeats = $this->em->getRepository(EventSeat::class)->findGroupedEventSeatsForWebsite($eventRow->getId());
        $groupedSeats = [];

        foreach ($eventSeats as $eventSeat) {
            $eventPrice = $eventSeat->getEventPrice();
            $eventPriceId = $eventPrice->getId();
            if (!isset($groupedSeats[$eventPriceId])) {
                $groupedSeats[$eventPriceId] = [
                    'eventPrice' => $eventPrice,
                    'quantity'   => 1,
                    'total'      => $eventPrice->getPrice(),
                ];
            } else {
                $groupedSeats[$eventPriceId]['quantity'] += 1;
                $groupedSeats[$eventPriceId]['total'] += $eventPrice->getPrice();
            }
        }

        return $groupedSeats;
    }

    public function updateQuantity(array $element, int $quantityChange): ?EventRow
    {
        $eventRow = $this->em->getRepository(EventRow::class)->findOneByIdForWebsite($element['eventRowId']);
        $eventPrice = $this->em->getRepository(EventPrice::class)->findOneByIdForWebsite($element["eventPriceId"]);

        if (null === $eventRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        if ($quantityChange === 0) {
            return $eventRow;
        }

        $eventSeats = $this->em->getRepository(EventSeat::class)->findAllByEventPriceForWebsite($element["eventRowId"], $element["eventPriceId"]);
        $count = count($eventSeats);

        if ($quantityChange < 0) {
            if ($count + $quantityChange < 1) {
                return $eventRow;
            }

            foreach (range(0, ($quantityChange * (-1)) - 1) as $index) {
                $eventRow->removeEventSeat($eventSeats[$index]);
            }
        } else {
            $eventRow = $this->addNewEventSeats($eventRow, $eventPrice, $quantityChange);
        }

        $cart = $this->calculateCartTotal($eventRow->getCart());
        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        $event = $eventRow->getEvent();
        $ticketing = $event->getTicketing();
        if (null === $ticketing || null === $ticketing->getModule() || $ticketing->getType() !== "api" || !$ticketing->isOrderTunnel()) {
            return $eventRow;
        }

        $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
        if (method_exists($class, "synchronizeCartInfo")) {
            $class->synchronizeCartInfo($event, $cart);
        }

        return $eventRow;
    }

    public function deleteEventRow(int $eventRowId): void
    {
        $eventRow = $this->em->getRepository(EventRow::class)->findOneByIdForWebsite($eventRowId);

        if (null === $eventRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        $cart = $eventRow->getCart();
        $event = $eventRow->getEvent();

        $eventRow->setEventDate(null);
        $this->em->remove($eventRow);
        $this->em->flush();

        $this->checkVoucherForCart($cart);

        $cart = $this->calculateCartTotal($cart);
        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        $ticketing = $event->getTicketing();
        if (null === $ticketing || null === $ticketing->getModule() || $ticketing->getType() !== "api" || !$ticketing->isOrderTunnel()) {
            return;
        }

        $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
        if (method_exists($class, "synchronizeCartInfo")) {
            $class->synchronizeCartInfo($event, $cart);
        }
    }

    public function deleteEventSeats(array $data): ?EventRow
    {
        $eventRow = $this->em->getRepository(EventRow::class)->findOneByIdForWebsite($data['eventRowId']);
        if (null === $eventRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        $cart = $eventRow->getCart();
        $event = $eventRow->getEvent();

        $eventSeats = $this->em->getRepository(EventSeat::class)->findAllByEventPriceForWebsite($data["eventRowId"], $data["eventPriceId"]);
        foreach ($eventSeats as $seat) {
            $eventRow->removeEventSeat($seat);
            $this->em->remove($seat);
        }

        if (count($eventRow->getEventSeats()) === 0) {
            $this->checkVoucherForCart($cart);
            $eventRow->setEventDate(null);
            $this->em->remove($eventRow);
            $eventRow = null;
        }

        $this->em->flush();

        $cart = $this->calculateCartTotal($cart);
        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        $ticketing = $event->getTicketing();
        if (null === $ticketing || null === $ticketing->getModule() || $ticketing->getType() !== "api" || !$ticketing->isOrderTunnel()) {
            return $eventRow;
        }

        $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
        if (method_exists($class, "synchronizeCartInfo")) {
            $class->synchronizeCartInfo($event, $cart);
        }

        return $eventRow;
    }

    public function calculateDiscount(?Cart $cart): int
    {
        $discount = 0;

        if (null === $cart) {
            return $discount;
        }

        $vouchers = $this->em->getRepository(Voucher::class)->findAllByCartForWebsite($cart->getId());
        if (count($vouchers) === 0) {
            return $discount;
        }

        foreach ($vouchers as $voucher) {
            foreach ($cart->getEventRows() as $row) {
                if ($this->checkVoucherForEventCategory($voucher, $row->getEvent()->getId())) {
                    if ($voucher->getUnit() === "%") {
                        $discount += ($row->getTotal() * $voucher->getDiscount()) / 100;
                    } else {
                        $discount += $voucher->getDiscount();
                    }
                }
            }
        }

        return $discount;
    }

    public function checkVoucherForEventCategory(Voucher $voucher, int $eventId): bool
    {
        $eventCategoriesId = [];

        foreach ($voucher->getEventCategories() as $category) {
            $eventCategoriesId[] = $category->getId();
        }

        $result = $this->em->getRepository(Event::class)->findOneByCategoriesForWebsite($eventCategoriesId, $eventId);

        if (null === $result) {
            return false;
        }

        return true;
    }

    public function checkVoucherForCart(Cart $cart)
    {
        $vouchers = $this->em->getRepository(Voucher::class)->findAllByCartForWebsite($cart->getId());

        if (count($vouchers) === 0) {
            return;
        }

        foreach ($vouchers as $voucher) {
            $checked = false;
            foreach ($cart->getEventRows() as $row) {
                if ($this->checkVoucherForEventCategory($voucher, $row->getEvent()->getId())) {
                    $checked = true;
                    break;
                }
            }

            if (!$checked) {
                $voucher->removeCart($cart);
                $this->em->persist($voucher);
            }
        }

        $this->em->flush();
    }

    public function addVoucher(Cart $cart, string $code): bool
    {
        $voucher = $this->em->getRepository(Voucher::class)->findOneByCodeForWebsite($code);

        if (null === $voucher) {
            return false;
        }

        foreach ($cart->getEventRows() as $row) {
            if ($this->checkVoucherForEventCategory($voucher, $row->getEvent()->getId())) {
                $cart->addVoucher($voucher);

                $this->em->persist($cart);
                $this->em->flush();

                return true;
            }
        }

        return false;
    }
}
