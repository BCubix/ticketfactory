<?php

namespace App\Manager;

use App\Kernel;
use App\Service\ServiceFactory;
use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventPrice;
use App\Entity\Order\Cart;
use App\Entity\Order\Voucher;
use App\Entity\Order\CartRow;
use App\Entity\Order\CartSeat;
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

    public function createNewCartRow(Cart $cart, Event $event, EventDate $eventDate): CartRow
    {
        $cartRow = new CartRow();
        $cartRow->setEvent($event);
        $cartRow->setEventDate($eventDate);
        $cartRow->setTotal(0);

        $cart->addCartRow($cartRow);

        $this->em->persist($cartRow);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        return $cartRow;
    }

    public function addNewCartSeats(CartRow $cartRow, EventPrice $eventPrice, int $quantity): CartRow
    {
        foreach (range(1, $quantity) as $index) {
            $seat = new CartSeat();
            $seat->setEventPrice($eventPrice);

            $cartRow->addCartSeat($seat);
        }

        return $this->calculateCartRowTotal($cartRow);
    }

    public function calculateCartRowTotal(CartRow $cartRow): CartRow
    {
        $total = 0;

        foreach ($cartRow->getCartSeats() as $seat) {
            $total += $seat->getEventPrice()->getPrice();
        }

        $cartRow->setTotal($total);

        return $cartRow;
    }

    public function calculateCartTotal(Cart $cart): Cart
    {
        $total = 0;

        foreach ($cart->getCartRows() as $row) {
            $total += $this->calculateCartRowTotal($row)->getTotal();
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

        $cartRow = null === $cartId ? null : $this->em->getRepository(CartRow::class)->findOneCartRowByCartForWebsite($cart->getId(), $eventDate->getId());
        if (null === $cartRow) {
            $cartRow = $this->createNewCartRow($cart, $event, $eventDate);
        }

        foreach ($eventPrices as $eventPrice) {
            if ($eventPrice['quantity'] > 0) {
                $this->addNewCartSeats($cartRow, $eventPrice["eventPrice"], $eventPrice['quantity']);
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

    public function getCartSeatsGrouped($cartRow): ?array
    {
        $cartSeats = $this->em->getRepository(CartSeat::class)->findGroupedCartSeatsForWebsite($cartRow->getId());
        $groupedSeats = [];

        foreach ($cartSeats as $cartSeat) {
            $eventPrice = $cartSeat->getEventPrice();
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

    public function updateQuantity(array $element, int $quantityChange): ?CartRow
    {
        $cartRow = $this->em->getRepository(CartRow::class)->findOneByIdForWebsite($element['cartRowId']);
        $eventPrice = $this->em->getRepository(EventPrice::class)->findOneByIdForWebsite($element["eventPriceId"]);

        if (null === $cartRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        if ($quantityChange === 0) {
            return $cartRow;
        }

        $cartSeats = $this->em->getRepository(CartSeat::class)->findAllByEventPriceForWebsite($element["cartRowId"], $element["eventPriceId"]);
        $count = count($cartSeats);

        if ($quantityChange < 0) {
            if ($count + $quantityChange < 1) {
                return $cartRow;
            }

            foreach (range(0, ($quantityChange * (-1)) - 1) as $index) {
                $cartRow->removeCartSeat($cartSeats[$index]);
            }
        } else {
            $cartRow = $this->addNewCartSeats($cartRow, $eventPrice, $quantityChange);
        }

        $cart = $this->calculateCartTotal($cartRow->getCart());
        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        $event = $cartRow->getEvent();
        $ticketing = $event->getTicketing();
        if (null === $ticketing || null === $ticketing->getModule() || $ticketing->getType() !== "api" || !$ticketing->isOrderTunnel()) {
            return $cartRow;
        }

        $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
        if (method_exists($class, "synchronizeCartInfo")) {
            $class->synchronizeCartInfo($event, $cart);
        }

        return $cartRow;
    }

    public function deleteCartRow(int $cartRowId): void
    {
        $cartRow = $this->em->getRepository(CartRow::class)->findOneByIdForWebsite($cartRowId);

        if (null === $cartRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        $cart = $cartRow->getCart();
        $event = $cartRow->getEvent();

        $cartRow->setEventDate(null);
        $this->em->remove($cartRow);
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

    public function deleteCartSeats(array $data): ?CartRow
    {
        $cartRow = $this->em->getRepository(CartRow::class)->findOneByIdForWebsite($data['cartRowId']);
        if (null === $cartRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        $cart = $cartRow->getCart();
        $event = $cartRow->getEvent();

        $cartSeats = $this->em->getRepository(CartSeat::class)->findAllByEventPriceForWebsite($data["cartRowId"], $data["eventPriceId"]);
        foreach ($cartSeats as $seat) {
            $cartRow->removeCartSeat($seat);
            $this->em->remove($seat);
        }

        if (count($cartRow->getCartSeats()) === 0) {
            $this->checkVoucherForCart($cart);
            $cartRow->setEventDate(null);
            $this->em->remove($cartRow);
            $cartRow = null;
        }

        $this->em->flush();

        $cart = $this->calculateCartTotal($cart);
        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        $ticketing = $event->getTicketing();
        if (null === $ticketing || null === $ticketing->getModule() || $ticketing->getType() !== "api" || !$ticketing->isOrderTunnel()) {
            return $cartRow;
        }

        $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
        if (method_exists($class, "synchronizeCartInfo")) {
            $class->synchronizeCartInfo($event, $cart);
        }

        return $cartRow;
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
            foreach ($cart->getCartRows() as $row) {
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
            foreach ($cart->getCartRows() as $row) {
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

        foreach ($cart->getCartRows() as $row) {
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
