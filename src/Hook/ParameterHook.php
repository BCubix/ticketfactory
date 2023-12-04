<?php

namespace App\Hook;

use App\Event\HookEvent;
use App\Exception\ApiException;
use App\Service\Addon\Hook;
use Symfony\Component\HttpFoundation\Response;

class ParameterHook extends Hook
{
    public function hookParameterValidated(HookEvent $event)
    {
        $vObject = $event->getParam('vObject');

        $params = [];

        foreach ($vObject as $param) {
            $params[$param->getParamKey()] = $param->getParamValue();
        }

        if (($params["core_use_purchase"] === "true" || $params["core_use_purchase"] === true) && ($params["core_use_customers"] !== "true" && $params["core_use_customers"] !== true)) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Vous devez activer les clients pour pouvoir utiliser le tunnel d'achat.");
        }
    }
}
