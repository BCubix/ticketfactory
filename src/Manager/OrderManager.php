<?php

namespace App\Manager;

use App\Entity\Customer\Customer;
use App\Entity\Order\Order;
use App\Entity\Order\OrderStatus;
use App\Entity\Order\Cart;
use App\Entity\Order\CartRow;

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

        $cartRows = $this->em->getRepository(CartRow::class)->findBy(['cart' => $cart]);
        foreach ($cartRows as $row) {
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

        $orderData['cart']['cartRows'] = [];
        foreach ($cart->getCartRows() as $cartRow) {
            $newCartRow = [
                'id' => $cartRow->getId(),
                'total' => $cartRow->getTotal(),
            ];

            $event = $cartRow->getEvent();
            $newCartRow['event'] = [
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

            $newCartRow['eventDate'] = [
                'eventDate' => $cartRow->getEventDate()->getEventDate(),
                'state' => $cartRow->getEventDate()->getState(),
                'reportDate' => $cartRow->getEventDate()->getReportDate(),
            ];

            $newCartRow['seatingPlan'] = null !== $cartRow->getSeatingPlan() ? [
                'name' => $cartRow->getSeatingPlan()->getName(),
            ] : null;

            $newCartRow['cartSeats'] = [];
            foreach ($cartRow->getCartSeats() as $cartSeat) {
                $newCartRow['cartSeats'][] = [
                    'id' => $cartSeat->getId(),
                    'name' => $cartSeat->getName(),
                    'eventPrice' => [
                        'name' => $cartSeat->getEventPrice()->getName(),
                        'price' => $cartSeat->getEventPrice()->getPrice(),
                        'annotation' => $cartSeat->getEventPrice()->getAnnotation(),
                    ]
                ];
            }

            $newCartRow['voucher'] = [];
            foreach ($cartRow->getVouchers() as $voucher) {
                $newCartRow['voucher'][] = [
                    'id' => $voucher->getId(),
                    'name' => $voucher->getName(),
                    'code' => $voucher->getCode(),
                    'discount' => $voucher->getDiscount(),
                    'unit' => $voucher->getUnit(),
                ];
            }

            $orderData['cart']['cartRows'][] = $newCartRow;
        }

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
