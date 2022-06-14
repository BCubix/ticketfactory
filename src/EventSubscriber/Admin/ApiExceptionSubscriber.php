<?php

namespace App\EventSubscriber\Admin;

use App\Exception\ApiException;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ApiExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => [['onKernelException', 10]]
        ];
    }

    public function onKernelException(ExceptionEvent $event)
    {
        $e = $event->getThrowable();
        if (!$e instanceof ApiException) {
            return;
        }

        $responseBody = [
            'message' => $e->getMessage(),
            'internalCode' => $e->getCode(),
            'httpcode' => $e->getStatusCode(),
            'errors' => $e->getErrors()
        ];

        $response = new JsonResponse(
            $responseBody,
            $e->getStatusCode()
        );

        $event->setResponse($response);
    }
}
