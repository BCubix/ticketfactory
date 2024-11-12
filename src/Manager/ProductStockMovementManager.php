<?php

namespace App\Manager;

use App\Entity\Order\Order;
use App\Entity\Product\Product;
use App\Entity\Product\ProductStockMovement;


class ProductStockMovementManager extends AbstractRouterManager
{
    public const SERVICE_NAME = 'productStockMovement';

    protected const ENTITY_CLASS = ProductStockMovement::class;

    public function createMovementsFromOrder(?Order $order): void
    {
        $refOrder =  $order->getReference();
        $cart = $order->getCart();
        foreach ($cart->getProductRows() as $row) {
            $this->newMovement($row->getProduct(), (-1) * $row->getQuantity(), $order);
        }
    }

    public function newMovement(?Product $product, int $quantity, ?Order $order): void
    {
        $product_movement = new ProductStockMovement();
        $product_movement->setCreatedAt(new \DateTimeImmutable("now"));
        $product_movement->setProduct($product);
        $product_movement->setQuantity($quantity);
        $product_movement->setOrder($order);

        $this->em->persist($product_movement);
        $this->em->flush();
    }
}
