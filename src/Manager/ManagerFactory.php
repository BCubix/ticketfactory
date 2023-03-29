<?php

namespace App\Manager;

use Psr\Container\ContainerInterface;
use Symfony\Contracts\Service\ServiceSubscriberInterface;

class ManagerFactory implements ServiceSubscriberInterface
{
    protected const TYPE_FILES_PATH = '/*/*.php';
    protected const NAMESPACE_PATH = '\App\Manager\\';

    protected $locator;

    public function __construct(ContainerInterface $locator)
    {
        $this->locator = $locator;
    }

    public static function getSubscribedServices(): array
    {
        return [
            'manager_contentType'      => ContentTypeManager::class,
            'manager_eventCategory'    => EventCategoryManager::class,
            'manager_hook'             => HookManager::class,
            'manager_imageFormat'      => ImageFormatManager::class,
            'manager_language'         => LanguageManager::class,
            'manager_mediaCategory'    => MediaCategoryManager::class,
            'manager_media'            => MediaManager::class,
            'manager_menuEntry'        => MenuEntryManager::class,
            'manager_module'           => ModuleManager::class,
            'manager_parameter'        => ParameterManager::class,
            'manager_theme'            => ThemeManager::class,
            'manager_user'             => UserManager::class,
            'manager_versionnedEntity' => VersionnedEntityManager::class
        ];
    }

    private function loadTypes() {
        $types = [];
        $files = glob($this->pg->getManagerDir() . self::TYPE_FILES_PATH);

        foreach ($files as $file) {
            dd($file);
            $className = explode('/', $file);
            $className = $className[count($className) - 1];

            $className = explode('.', $className);
            $className = $className[0];

            $className = (self::NAMESPACE_PATH . $className);

            $types[$typeName] = $className;
        }

        return $types;
    }

    public function get(string $keyword)
    {
        $keyword = 'manager_' . $keyword;
        if (!$this->locator->has($keyword)) {
            throw new \Exception('This manager ' . $keyword . ' does not exist.');
        }

        return $this->locator->get($keyword);
    }
}
