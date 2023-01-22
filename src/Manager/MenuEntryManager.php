<?php

namespace App\Manager;

use App\Entity\Menu\MenuEntry;
use App\Entity\Language\Language;
use App\Utils\CloneObject;

use Doctrine\ORM\EntityManagerInterface;

class MenuEntryManager extends AbstractManager
{
    public function translateMenuEntry($object, $languageId)
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
}
