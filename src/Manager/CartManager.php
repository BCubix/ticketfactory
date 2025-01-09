<?php

namespace App\Manager;

use App\Entity\Customer\Customer;
use App\Kernel;
use App\Service\ServiceFactory;
use App\Entity\Event\Event;
use App\Entity\Event\EventDate;
use App\Entity\Event\EventPrice;
use App\Entity\Order\Cart;
use App\Entity\Order\Voucher;
use App\Entity\Order\EventRow;
use App\Entity\Order\EventSeat;
use App\Entity\Order\ProductRow;
use App\Entity\Order\SubscriptionRow;
use App\Entity\Product\Product;
use App\Entity\Subscription\Subscription;
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

    public function createNewCart(?Customer $customer = null): Cart
    {
        $cart = new Cart();
        $cart->setActive(true);
        $cart->setTotal(0);

        if (null !== $customer) {
            $cart->setCustomer($customer);
        }

        $this->em->persist($cart);
        $this->em->flush();

        $session = $this->rs->getSession();
        if (null !== $session) {
            $this->rs->getSession()->set("cartId", $cart->getId());
            $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());
        }

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

    public function createNewProductRow(Cart $cart, Product $product, int $quantity): ProductRow
    {
        $productRow = new ProductRow();
        $productRow->setProduct($product);
        $productRow->setQuantity($quantity);
        $productRow->setTotal(0);

        $cart->addProductRow($productRow);

        $this->em->persist($productRow);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        return $productRow;
    }

    public function createNewSubscriptionRow(Cart $cart, Subscription $subscription, int $quantity): SubscriptionRow
    {
        $subscriptionRow = new SubscriptionRow();
        $subscriptionRow->setSubscription($subscription);
        $subscriptionRow->setQuantity($quantity);
        $subscriptionRow->setTotal($quantity * $subscription->getPrice());

        $cart->addSubscriptionRow($subscriptionRow);

        $this->em->persist($subscriptionRow);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        return $subscriptionRow;
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

    public function calculateProductRowTotal(ProductRow $productRow): ProductRow
    {
        $productRow->setTotal($productRow->getProduct()->getPrice() * $productRow->getQuantity());

        return $productRow;
    }

    public function calculateSubscriptionRowTotal(SubscriptionRow $subscriptionRow): SubscriptionRow
    {
        $subscriptionRow->setTotal($subscriptionRow->getSubscription()->getPrice() * $subscriptionRow->getQuantity());

        return $subscriptionRow;
    }

    public function calculateDeliveryPrice(Cart $cart): void
    {
        // If there is no delivery mode attached to the cart, we set deliveryPrice to null
        if (null === $cart->getDeliveryMode()) {
            $cart->setDeliveryPrice(null);

            return;
        }

        // We calculate the deliveryPrice from the module
        $this->mf->get($cart->getDeliveryMode()->getManager())->calculateDeliveryPrice($cart);
    }

    public function calculateCartTotal(Cart $cart): Cart
    {
        $total = 0;

        foreach ($cart->getEventRows() as $row) {
            $total += $this->calculateEventRowTotal($row)->getTotal();
        }

        foreach ($cart->getProductRows() as $row) {
            $total += $this->calculateProductRowTotal($row)->getTotal();
        }

        foreach ($cart->getSubscriptionRows() as $row) {
            $total += $this->calculateSubscriptionRowTotal($row)->getTotal();
        }

        $cart->setTotal($total);
        $this->calculateDeliveryPrice($cart);

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

                    return $this->formatCart($cart);
                }

                if (null === $sessionUpdatedAt) {
                    $session->set("cartId", $customerCart->getId());
                    $session->set("cartUpdatedAt", $customerCart->getUpdatedAt());

                    return $this->formatCart($customerCart);
                }

                $sessionUpdatedAt = $sessionUpdatedAt;
                $cartUpdatedAt = $customerCart->getUpdatedAt();

                if ($sessionUpdatedAt > $cartUpdatedAt) {
                    $cart->setCustomer($customer);
                    $this->em->persist($cart);
                    $this->em->flush();

                    return $this->formatCart($cart);
                } else {
                    $session->set("cartId", $customerCart->getId());
                    $session->set("cartUpdatedAt", $customerCart->getUpdatedAt());

                    return $this->formatCart($customerCart);
                }
            } else {
                if (null !== $customerCart) {
                    $session->set("cartId", $customerCart->getId());
                    $session->set("cartUpdatedAt", $customerCart->getUpdatedAt());

                    return $this->formatCart($customerCart);
                }

                return null;
            }
        }

        return $this->formatCart($cart);
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

    public function updateProductQuantity(array $element, int $quantityChange): ?ProductRow
    {
        $productRow = $this->em->getRepository(ProductRow::class)->findOneByIdForWebsite($element['productRowId']);
        if (null === $productRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        if ($quantityChange === 0 || ($quantityChange < 0 && $productRow->getQuantity() + $quantityChange < 1)) {
            return $productRow;
        }

        $productRow->setQuantity($productRow->getQuantity() + $quantityChange);
        $this->changeStock($productRow->getProduct(), (-1) * $quantityChange);

        $cart = $this->calculateCartTotal($productRow->getCart());
        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        return $productRow;
    }

    public function updateSubscriptionQuantity(array $element, int $quantityChange): ?SubscriptionRow
    {
        $subscriptionRow = $this->em->getRepository(SubscriptionRow::class)->findOneByIdForWebsite($element['subscriptionRowId']);
        if (null === $subscriptionRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        if ($quantityChange === 0 || ($quantityChange < 0 && $subscriptionRow->getQuantity() + $quantityChange < 1)) {
            return $subscriptionRow;
        }

        $subscriptionRow->setQuantity($subscriptionRow->getQuantity() + $quantityChange);

        $cart = $this->calculateCartTotal($subscriptionRow->getCart());
        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());

        return $subscriptionRow;
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

    public function deleteProductRow(int $productRowId): void
    {
        $productRow = $this->em->getRepository(ProductRow::class)->findOneByIdForWebsite($productRowId);

        if (null === $productRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        $this->changeStock($productRow->getProduct(), $productRow->getQuantity());

        $cart = $productRow->getCart();

        $this->em->remove($productRow);
        $this->em->flush();

        $this->checkVoucherForCart($cart);
        $cart = $this->calculateCartTotal($cart);

        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());
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

    public function deleteSubscriptionRow(int $subscriptionRowId)
    {
        $subscriptionRow = $this->em->getRepository(SubscriptionRow::class)->findOneByIdForWebsite($subscriptionRowId);

        if (null === $subscriptionRow) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'élément n'a pas été trouvé.");
        }

        $cart = $subscriptionRow->getCart();

        $this->em->remove($subscriptionRow);
        $this->em->flush();

        $this->checkVoucherForCart($cart);
        $cart = $this->calculateCartTotal($cart);

        $this->em->persist($cart);
        $this->em->flush();

        $this->rs->getSession()->set("cartUpdatedAt", $cart->getUpdatedAt());
    }

    public function formatCart(?Cart $cart): ?Cart
    {
        if (null === $cart) {
            return null;
        }

        $this->calculateRowsDiscount($cart);
        $cart->discount = $this->calculateDiscount($cart);

        return $cart;
    }

    public function calculateRowsDiscount(?Cart &$cart): Cart
    {
        foreach ($cart->getEventRows() as &$row) {
            $discount = 0;
            foreach ($row->getVouchers() as $voucher) {
                if ($voucher->getUnit() === "%") {
                    $discount += ($row->getTotal() * $voucher->getDiscount()) / 100;
                } else {
                    $discount += $voucher->getDiscount();
                }
            }

            $row->discount = $discount;
        }

        foreach ($cart->getProductRows() as &$row) {
            $discount = 0;
            foreach ($row->getVouchers() as $voucher) {
                if ($voucher->getUnit() === "%") {
                    $discount += ($row->getTotal() * $voucher->getDiscount()) / 100;
                } else {
                    $discount += $voucher->getDiscount();
                }
            }

            $row->discount = $discount;
        }

        return $cart;
    }

    public function calculateDiscount(?Cart $cart): int
    {
        $discount = 0;

        if (null === $cart) {
            return $discount;
        }

        foreach ($cart->getEventRows() as $row) {
            foreach ($row->getVouchers() as $voucher) {
                if ($voucher->getUnit() === "%") {
                    $discount += ($row->getTotal() * $voucher->getDiscount()) / 100;
                } else {
                    $discount += $voucher->getDiscount();
                }
            }
        }

        foreach ($cart->getProductRows() as $row) {
            foreach ($row->getVouchers() as $voucher) {
                if ($voucher->getUnit() === "%") {
                    $discount += ($row->getTotal() * $voucher->getDiscount()) / 100;
                } else {
                    $discount += $voucher->getDiscount();
                }
            }
        }

        return $discount;
    }

    public function getVouchers(?Cart $cart): array
    {
        $vouchers = [];

        if (null === $cart) {
            return $vouchers;
        }

        foreach ($cart->getEventRows() as $row) {
            foreach ($row->getVouchers() as $voucher) {
                if (!in_array($voucher, $vouchers, true)) {
                    $vouchers[] = $voucher;
                }
            }
        }

        foreach ($cart->getProductRows() as $row) {
            foreach ($row->getVouchers() as $voucher) {
                if (!in_array($voucher, $vouchers, true)) {
                    $vouchers[] = $voucher;
                }
            }
        }

        return $vouchers;
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

    public function checkVoucherForProductCategory(Voucher $voucher, int $productId): bool
    {
        $productCategoriesId = [];

        foreach ($voucher->getProductCategories() as $category) {
            $productCategoriesId[] = $category->getId();
        }

        $result = $this->em->getRepository(Product::class)->findOneByCategoriesForWebsite($productCategoriesId, $productId);
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

        foreach ($cart->getEventRows() as &$row) {
            foreach ($row->getVouchers() as $voucher) {
                if (!$this->checkVoucherForEventCategory($voucher, $row->getEvent()->getId())) {
                    $row->removeVoucher($voucher);
                    $this->em->persist($row);
                }
            }
        }

        foreach ($cart->getProductRows() as $row) {
            foreach ($row->getVouchers() as $voucher) {
                if (!$this->checkVoucherForEventCategory($voucher, $row->getProduct()->getId())) {
                    $row->removeVoucher($voucher);
                    $this->em->persist($row);
                }
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

        $addedVoucher = false;
        foreach ($cart->getEventRows() as &$row) {
            if ($this->checkVoucherForEventCategory($voucher, $row->getEvent()->getId())) {
                $voucher->addEventRow($row);
                $this->em->persist($voucher);

                $addedVoucher = true;
            }
        }

        foreach ($cart->getProductRows() as &$row) {
            if ($this->checkVoucherForProductCategory($voucher, $row->getProduct()->getId())) {
                $voucher->addProductRow($row);
                $this->em->persist($voucher);

                $addedVoucher = true;
            }
        }

        if ($addedVoucher) {
            $this->em->flush();
            return true;
        }

        return false;
    }

    public function addProductToCart(?Product $product, int $quantity): void
    {
        $session = $this->rs->getSession();

        if (null === $product) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Le produit n'existe pas.");
        }

        $cartId = $session->get("cartId", null);
        $cart = $cartId ? $this->em->getRepository(Cart::class)->findOneByIdForWebsite($cartId) : $this->createNewCart();

        $this->changeStock($product, (-1) * $quantity);

        $productRow = null === $cartId ? null : $this->em->getRepository(ProductRow::class)->findOneProductRowByCartForWebsite($cart->getId(), $product->getId());
        if (null === $productRow) {
            $this->createNewProductRow($cart, $product, $quantity);
        } else {
            $productRow->setQuantity($productRow->getQuantity() + $quantity);
            $this->em->persist($productRow);
        }

        $cart = $this->calculateCartTotal($cart);
        $this->em->persist($cart);
        $this->em->flush();
    }

    public function addSubscriptionToCart(?Subscription $subscription, int $quantity)
    {
        $session = $this->rs->getSession();

        if (null === $subscription) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "L'abonnement n'existe pas.");
        }

        $cartId = $session->get("cartId", null);
        $cart = $cartId ? $this->em->getRepository(Cart::class)->findOneByIdForWebsite($cartId) : $this->createNewCart();

        $subscriptionRow = null === $cartId ? null : $this->em->getRepository(SubscriptionRow::class)->findOneSubscriptionRowByCartForWebsite($cart->getId(), $subscription->getId());
        if (null === $subscriptionRow) {
            $this->createNewSubscriptionRow($cart, $subscription, $quantity);
        } else {
            $subscriptionRow->setQuantity($subscriptionRow->getQuantity() + $quantity);
            $subscriptionRow = $this->calculateSubscriptionRowTotal($subscriptionRow);

            $this->em->persist($subscriptionRow);
        }

        $cart = $this->calculateCartTotal($cart);
        $this->em->persist($cart);
        $this->em->flush();
    }

    public function changeStock(Product $product, int $quantity): void
    {
        $newStock = $product->getStock() + $quantity;
        $product->setStock($newStock);

        // if stock is equal to zero we warn by mail the admin that a product is out of stock
        if ($newStock === 0) {
            $sendEmail =  $this->mf->get('parameter')->getCoreParameter("product_out_of_stock");

            if (null !== $sendEmail) {
                $customerEmailAddress =  $this->mf->get('parameter')->getCoreParameter("product_out_of_stock_email");
                if (null !== $customerEmailAddress) {
                    $this->sf->get('mailer')->sendEmailProductOutOfStock($product);
                }
            }
        }
    }

    public function checkForOldCart(): void
    {
        $inactiveCarts = $this->em->getRepository(Cart::class)->findInactiveRecentCarts();


        // Resetting the cart to empty for each inactive cart
        foreach ($inactiveCarts as $cart) {
            $productRows = $cart->getProductRows();
            $eventRows = $cart->getEventRows();

            foreach ($productRows as $productRow) {
                $this->deleteProductRow($productRow->getId());
            }
            foreach ($eventRows as $eventRow) {
                $this->deleteEventRow($eventRow->getId());
            }
        }
    }
}
