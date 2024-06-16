<?php

namespace App\Manager;

use App\Kernel;
use App\Service\ServiceFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class CacheManager extends AbstractManager
{
    public const SERVICE_NAME = 'cache';

    protected $cache;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        CacheInterface $cache,
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->cache = $cache;
    }

    public function getValue(string $key, $callback = null): mixed
    {
        if (!$this->isCacheUsed()) {
            if (null !== $callback) {
                return $callback();
            }

            return null;
        }

        return $this->cache->get($key, function (ItemInterface $item) use ($callback): mixed {
            if (null !== $callback) {
                return $callback();
            }

            return null;
        });
    }

    public function setValue(string $key, mixed $value): void
    {
        if (!$this->isCacheUsed()) {
            return;
        }

        $keyExist = true;

        $this->cache->get($key, function (ItemInterface $item) use ($value, &$keyExist): mixed {
            $keyExist = false;
            return $value;
        });

        if (!$keyExist) {
            return;
        }

        $this->cache->delete($key);
        $this->cache->get($key, function (ItemInterface $item) use ($value): mixed {
            return $value;
        });
    }

    private function isCacheUsed(): bool
    {
        if (!extension_loaded('memcached')) {
            return false;
        }

        return $this->cache->get("parameter_core_use_cache", function (ItemInterface $item): mixed {
            $parameter = $this->mf->get('parameter')->getParameter('core_use_cache');
            return $this->mf->get('parameter')->getParameterValue($parameter);
        });
    }
}
