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

    public function getValue(string $key): mixed
    {
        return $this->cache->get($key, function (ItemInterface $item) {
            return 'Toto';
        });
    }

    public function setValue(string $key, mixed $value): void
    {
        $keyExist = true;
        /* $this->cache->get($key, function (ItemInterface $item) use ($value, &$keyExist) {
            $item->expiresAfter(0);

            $keyExist = false;

            return $value;
        });

        if (!$keyExist) {
            return;
        }

        $this->cache->delete($key);
        $this->cache->get($key, function (ItemInterface $item) use ($value) {
            $item->expiresAfter(0);

            return $value;
        }); */
    }
}
