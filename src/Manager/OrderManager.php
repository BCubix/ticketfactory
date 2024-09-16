<?php

namespace App\Manager;

use App\Entity\Customer\Customer;
use App\Entity\Order\Order;
use App\Entity\Order\OrderStatus;
use App\Entity\Order\Cart;
use App\Entity\Order\EventRow;

class OrderManager extends AbstractManager
{
    private const REFERENCES_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private const REFERENCES_LENGTH = 10;

    public const SERVICE_NAME = 'order';

    public function createNewOrder(Customer $customer, OrderStatus $status, Cart $cart): ?Order
    {
        $order = new order();
        $order->setStatus($status);
        $order->setCustomer($customer);
        $order->setCart($cart);
        $order->setReference($this->generateReference());
        $order->setOrderData($this->getOrderData($order));

        $this->em->persist($order);

        $eventRows = $this->em->getRepository(EventRow::class)->findBy(['cart' => $cart]);
        foreach ($eventRows as $row) {
            $event = $row->getEvent();
            $ticketing = $event->getTicketing();
            if (null === $ticketing || null === $ticketing->getModule() || $ticketing->getType() !== "api" || !$ticketing->isOrderTunnel()) {
                continue;
            }

            $class = $this->sf->get('ticketing')->getTicketingClass($ticketing->getModule());
            if (method_exists($class, "createNewOrder")) {
                $class->createNewOrder($event, $cart, $order);
            }
        }

        return $order;
    }

    public function getOrderData(Order $order)
    {
        $orderData = [];

        $customer = $order->getCustomer();
        $orderData['customer'] = [
            'id' => $customer->getId(),
            'email' => $customer->getEmail(),
            'phone' => $customer->getPhone(),
            'firstName' => $customer->getFirstName(),
            'lastName' => $customer->getLastName(),
            'civility' => $customer->getCivility(),
        ];

        $cart = $order->getCart();
        $orderData['cart'] = [
            'id' => $cart->getId(),
            'total' => $cart->getTotal(),
        ];

        $orderData['cart']['eventRows'] = $this->getEventRows($cart);
        $orderData['cart']['productRows'] = $this->getProductRows($cart);


        $orderData['voucher'] = [];
        foreach ($cart->getVouchers() as $voucher) {
            $cart['voucher'][] = [
                'id' => $voucher->getId(),
                'name' => $voucher->getName(),
                'code' => $voucher->getCode(),
                'discount' => $voucher->getDiscount(),
                'unit' => $voucher->getUnit(),
            ];
        }

        return $orderData;
    }

    private function getEventRows(Cart $cart): array
    {
        $eventRows = [];

        foreach ($cart->getEventRows() as $eventRow) {
            $newEventRow = [
                'id' => $eventRow->getId(),
                'total' => $eventRow->getTotal(),
            ];

            $event = $eventRow->getEvent();
            $newEventRow['event'] = [
                'id' => $event->getId(),
                'name' => $event->getName(),
                'slug' => $event->getSlug(),
                'chapo' => $event->getChapo(),
                'description' => $event->getDescription(),
                'eventLength' => $event->getEventLength(),
                'ticketingReference' => $event->getTicketingReference(),
                'ticketing' => null !== $event->getTicketing() ? [
                    'id' => $event->getTicketing()->getId(),
                    'name' => $event->getTicketing()->getName(),
                    'type' => $event->getTicketing()->getType(),
                    'module' => null !== $event->getTicketing()->getModule() ? [
                        'id' => $event->getTicketing()->getModule()->getId(),
                        'name' => $event->getTicketing()->getModule()->getName(),
                    ] : null
                ] : null
            ];

            $newEventRow['eventDate'] = [
                'eventDate' => $eventRow->getEventDate()->getEventDate(),
                'state' => $eventRow->getEventDate()->getState(),
                'reportDate' => $eventRow->getEventDate()->getReportDate(),
            ];

            $newEventRow['seatingPlan'] = null !== $eventRow->getSeatingPlan() ? [
                'name' => $eventRow->getSeatingPlan()->getName(),
            ] : null;

            $newEventRow['eventSeats'] = [];
            foreach ($eventRow->getEventSeats() as $eventSeat) {
                $newEventRow['eventSeats'][] = [
                    'id' => $eventSeat->getId(),
                    'name' => $eventSeat->getName(),
                    'eventPrice' => [
                        'name' => $eventSeat->getEventPrice()->getName(),
                        'price' => $eventSeat->getEventPrice()->getPrice(),
                        'annotation' => $eventSeat->getEventPrice()->getAnnotation(),
                    ]
                ];
            }

            $newEventRow['voucher'] = [];
            foreach ($eventRow->getVouchers() as $voucher) {
                $newEventRow['voucher'][] = [
                    'id' => $voucher->getId(),
                    'name' => $voucher->getName(),
                    'code' => $voucher->getCode(),
                    'discount' => $voucher->getDiscount(),
                    'unit' => $voucher->getUnit(),
                ];
            }

            $eventRows['cart']['eventRows'][] = $newEventRow;
        }

        return $eventRows;
    }

    private function getProductRows(Cart $cart): array
    {
        $productRows = [];

        foreach ($cart->getProductRows() as $productRow) {
            $newProductRow = [
                'id' => $productRow->getId(),
                'total' => $productRow->getTotal(),
            ];

            $product = $productRow->getProduct();
            $newProductRow['product'] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'slug' => $product->getSlug(),
                'chapo' => $product->getChapo(),
                'description' => $product->getDescription(),
                'ticketingReference' => $product->getTicketingReference(),
                'ticketing' => null !== $product->getTicketing() ? [
                    'id' => $product->getTicketing()->getId(),
                    'name' => $product->getTicketing()->getName(),
                    'type' => $product->getTicketing()->getType(),
                    'module' => null !== $product->getTicketing()->getModule() ? [
                        'id' => $product->getTicketing()->getModule()->getId(),
                        'name' => $product->getTicketing()->getModule()->getName(),
                    ] : null
                ] : null
            ];

            $productRows[] = $newProductRow;
        }

        return $productRows;

    }

    private function generateReference(): string
    {
        $chars = self::REFERENCES_CHARS;
        $length = strlen($chars);
        $reference = '';

        for ($i = 0; $i < self::REFERENCES_LENGTH; $i++) {
            $random_character = $chars[mt_rand(0, $length - 1)];
            $reference .= $random_character;
        }

        return $reference;
    }
}
