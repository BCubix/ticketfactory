<?php

namespace App\Manager;

use App\Entity\Customer\Customer;
use App\Entity\Order\Order;
use App\Entity\Order\OrderStatus;
use App\Entity\Order\Cart;

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

        $this->em->persist($order);

        return $order;
    }

    private function generateReference(): string
    {
        $chars = self::REFERENCES_CHARS;
        $length = strlen($chars);
        $reference = '';
    
        for($i = 0; $i < self::REFERENCES_LENGTH; $i++) {
            $random_character = $chars[mt_rand(0, $length - 1)];
            $reference .= $random_character;
        }
    
        return $reference;
    } 
}
