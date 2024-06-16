<?php

namespace App\Hook;

use App\Entity\Language\Language;
use App\Entity\Menu\MenuEntry;
use App\Event\HookEvent;
use App\Service\Addon\Hook;

class MenuEntryHook extends Hook
{
    public function hookMenuEntrySaved(HookEvent $event)
    {
        $sObject = $event->getParam('sObject');

        $repository = $this->em->getRepository(MenuEntry::class);
        
        $menuEntries = $repository->findAllForWebsite($sObject->getLang()->getId());
        $menus = $this->mf->get('menuEntry')->buildMenus($menuEntries);

        $this->mf->get('cache')->setValue("menuEntries_lang_" . $sObject->getLang()->getId(), $menus);
    }

    public function hookMenuEntryDeleted(HookEvent $event)
    {
        $languages = $this->em->getRepository(Language::class)->findAllForAdmin([]);
        foreach ($languages['results'] as $language) {
            $menuEntries =  $this->em->getRepository(MenuEntry::class)->findAllForWebsite($language->getId());
            $menus = $this->mf->get('menuEntry')->buildMenus($menuEntries);

            $this->mf->get('cache')->setValue("menuEntries_lang_" . $language->getId(), $menus);
        }
    }
}
