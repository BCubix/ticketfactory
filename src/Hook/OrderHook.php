<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Service\Addon\Hook;

class OrderHook extends Hook
{
    public function hookOrderCompleted(HookEvent $event)
    {
        $params = $event->getParams();
        $cart = $params['cart'];

        
        if (null !== $cart->getOrder()) {
            $this->mf->get('notification')->createNewOrderNotification($cart->getOrder());
        }
        
        $isCommandValidated =  $this->mf->get('parameter')->getParameter('core_order_validated');
        if (null !== $isCommandValidated) {
            $customerEmailAddress = $this->mf->get('parameter')->getParameter('core_order_validated_email');
            if (null !== $customerEmailAddress) {
                $this->sf->get('mailer')->sendEmailValidatedOrder($cart);
            }
        }
    }
}
