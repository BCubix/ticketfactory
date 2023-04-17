<?php

namespace App\DataFixtures;

use App\Entity\Event\EventCategory;
use App\Entity\Language\Language;
use App\Entity\Media\MediaCategory;
use App\Entity\User\User;
use App\Manager\UserManager;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    private $um;

    public function __construct(UserManager $um)
    {
        $this->um = $um;
    }

    public function load(ObjectManager $om): void
    {
        // Language
        $language = new Language();
        $language->setActive(true);
        $language->setName('France');
        $language->setIsoCode('FR');
        $language->setLocale("fr");
        $language->setDatetimeFormat("");
        $language->setDateFormat("");
        $language->setTimeFormat("");
        $language->setIsDefault(true);
        $om->persist($language);

        // Event root category
        $eventCategory = new EventCategory();
        $eventCategory->setActive(true);
        $eventCategory->setName('Catégories');
        $eventCategory->setLang($language);
        $om->persist($eventCategory);

        // Media root category
        $mediaCategory = new MediaCategory();
        $mediaCategory->setActive(true);
        $mediaCategory->setName('Médias');
        $mediaCategory->setLang($language);
        $om->persist($mediaCategory);

        // Default User
        $user = new User();
        $user->setActive(true);
        $user->setEmail('thomas.anderson@matrix.com');
        $user->setPlainPassword('matrix');
        $user->setFirstName('Thomas');
        $user->setLastName('Anderson');
        $user->setRoles(['ROLE_ADMIN']);
        $this->um->upgradePassword($user);

        $om->flush();
    }
}
