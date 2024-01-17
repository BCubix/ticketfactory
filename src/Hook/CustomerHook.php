<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Service\Addon\Hook;


class CustomerHook extends Hook
{
    public function hookCustomerValidated(HookEvent $event)
    {
        $user = $event->getParam('vObject');

        $this->mf->get('customer')->upgradePassword($user);
    }
}
