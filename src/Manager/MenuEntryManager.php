<?php

namespace App\Manager;

use App\Entity\Menu\MenuEntry;
use App\Entity\Language\Language;
use App\Service\Object\CloneObject;

use Doctrine\ORM\EntityManagerInterface;

class MenuEntryManager extends AbstractManager
{
    public const SERVICE_NAME = 'menuEntry';

    public function translateMenuEntry(MenuEntry $object, int $languageId): ?MenuEntry
    {
        $newObject = CloneObject::cloneObject($object);

        $language = $this->em->getRepository(Language::class)->findOneForAdmin($languageId);
        if (null === $language) {
            return null;
        }

        $newObject->resetChildren();
        $newObject->setLang($language);

        return $newObject;
    }

    public function getAllMenus(): array
    {
        $repository = $this->em->getRepository(MenuEntry::class);

        $menuEntries = $repository->findAllForWebsite($this->getLanguageId());
        $menus = $repository->buildTree($menuEntries);
        
        foreach ($menus as $key => $menu) {
            $menus[$menu['keyword']] = $menu;
            unset($menus[$key]);
        }
        
        return $menus;
    }

    public function getOneMenu(string $keyword): array
    {
        $repository = $this->em->getRepository(MenuEntry::class);

        $menuEntries = $repository->findByKeywordForWebsite($this->getLanguageId(), $keyword);
        $menus = $repository->buildTree($menuEntries);

        return $menus;
    }

    public function getMenuUrl(array $menu, $params = [], $absolute = RouterInterface::ABSOLUTE_PATH): string
    {
        $menuType = $menu['menuType'];
        if (!isset(MenuEntry::TYPES_MAPPING[$menuType])) {
            return '';
        }

        $className = MenuEntry::TYPES_MAPPING[$menuType];
        if (!empty($className)) {
            $object = $this->em->getRepository($className)->findOneForWebsite($this->getLanguageId(), $menu['value']);

            if ($object == null) {
                return '';
            }

            return $this->sf->get('urlService')->tfPath($object, $params, $absolute);
        }

        if ($menuType == 'external') {
            return $menu['value'];
        }

        return '';
    }
}
