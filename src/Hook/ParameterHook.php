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
        $iObject = $event->getParam('iObject');
        $vObject = $event->getParam('vObject');

        $oldParams = [];
        $params = [];

        foreach ($iObject->getParameters() as $param) {
            $oldParams[$param->getParamKey()] = $param->getParamValue();
        }

        foreach ($vObject as $param) {
            $params[$param->getParamKey()] = $param->getParamValue();
        }

        if (isset($params["core_use_purchase"]) && isset($params["core_use_customers"])) {
            if (($params["core_use_purchase"] === "true" || $params["core_use_purchase"] === true) && ($params["core_use_customers"] !== "true" && $params["core_use_customers"] !== true)) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Vous devez activer les clients pour pouvoir utiliser le tunnel d'achat.");
            }
        }

        if (isset($params["core_event_url_format"]) && $oldParams['core_event_url_format'] !== $params['core_event_url_format']) {
            $eventFormats = explode('/', $params['core_event_url_format']);
            
            if (!in_array("%id%", $eventFormats) && !in_array("%slug%", $eventFormats)) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "l'url de vos évènements doit contenir au moins un identifiant unique (%id, %slug%).");
            }
        
            if (count($eventFormats) !== count(array_unique($eventFormats))) {
                throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Vous ne pouvez pas avoir de doublons pour les valeurs renseignées.");
            }
        }

        if (isset($params["core_debug_mode"]) && $oldParams['core_debug_mode'] !== $params['core_debug_mode']) {
            $debugMode = !$params['core_debug_mode'] ? false : true;
            $newValue = ($debugMode ? 'dev' : 'prod');

            $this->mf->get('parameter')->changeEnvFileVariable('APP_ENV=', $newValue);
        }
    }
}
