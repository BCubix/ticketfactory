<?php

use App\Service\Db\Db;
use Symfony\Config\FrameworkConfig;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (FrameworkConfig $framework, ContainerConfigurator $configurator) {
    $useCache = Db::getInstance()->query("SELECT * FROM parameter WHERE param_key = 'core_use_cache'");

    if (!isset($useCache[0]) || $useCache[0]['param_value'] === "0" || null !== $useCache[0]['param_value']) {
        return;
    }

    $framework->cache()
        ->app('cache.adapter.memcached')
        ->defaultMemcachedProvider('memcached://' . $_ENV['MEMCACHED_HOST'] . ':' . $_ENV['MEMCACHED_PORT']);
};