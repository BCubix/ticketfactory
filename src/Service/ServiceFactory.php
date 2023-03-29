<?php

namespace App\Service;

use Psr\Container\ContainerInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;

class ServiceFactory implements ServiceSubscriberInterface
{
    protected $locator;

    public function __construct(ContainerInterface $locator)
    {
        $this->locator = $locator;
    }

    public static function getSubscribedServices(): array
    {
        return [
            'service_contentType' => ContentTypeManager::class,
        ];
    }

    public function get(string $keyword)
    {
        $keyword = 'service_' . $keyword;
        if (!$this->locator->has($keyword)) {
            throw new \Exception('This service ' . $keyword . ' does not exist.');
        }

        return $this->locator->get($keyword);
    }
}
