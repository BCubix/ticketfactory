<?php

namespace App\DataFixtures;

use App\Entity\Event\EventCategory;
use App\Entity\Language\Language;
use App\Entity\Media\MediaCategory;
use App\Entity\Parameter\Parameter;
use App\Entity\User\User;
use App\Manager\ThemeManager;
use App\Manager\UserManager;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    private $um;
    private $tm;

    public function __construct(UserManager $um, ThemeManager $tm)
    {
        $this->um = $um;
        $this->tm = $tm;
    }

    public function load(ObjectManager $om): void
    {
        // Language
        $language = new Language();
        $language->setActive(true);
        $language->setName('France');
        $language->setIsoCode('FR');
        $language->setIsDefault(true);
        $om->persist($language);

        // Root Category
        $eventCategory = new EventCategory();
        $eventCategory->setActive(true);
        $eventCategory->setName('Catégories');
        $eventCategory->setLang($language);
        $om->persist($eventCategory);

        $mediaCategory = new MediaCategory();
        $mediaCategory->setActive(true);
        $mediaCategory->setName('Médias');
        $mediaCategory->setLang($language);
        $om->persist($mediaCategory);

        // Parameters
        $parameter = new Parameter();
        $parameter->setName("Type d'évènements par défaut");
        $parameter->setType("list");
        $parameter->setParamKey("default_events_type");
        $parameter->setParamValue("Pièces");
        $parameter->setAvailableValue([
            [
                "id"   => "Pièces",
                "name" => "Pièces de théatre"
            ], [
                "id"   => "Expositions",
                "name" => "Expositions temporaires"
            ], [
                "id"   => "Films",
                "name" => "Diffusions de films"
            ], [
                "id"   => "Concerts",
                "name" => "Concerts"
            ], [
                "id"   => "Ballets",
                "name" => "Ballets"
            ]
        ]);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName("Types par défaut");
        $parameter->setBreakpointsValue("xs-12 md-6");
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Type de structures par défaut");
        $parameter->setType("list");
        $parameter->setParamKey("default_structures_type");
        $parameter->setParamValue(3);
        $parameter->setAvailableValue([
            [
                "id"   => 0,
                "name" => "Théatre"
            ], [
                "id"   => 1,
                "name" => "Musée"
            ], [
                "id"   => 2,
                "name" => "Cinéma"
            ], [
                "id"   => 3,
                "name" => "Festival"
            ]
        ]);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName("Types par défaut");
        $parameter->setBreakpointsValue("xs-12 md-6");
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Logo");
        $parameter->setType("upload");
        $parameter->setParamKey("main_logo");
        $parameter->setParamValue(null);
        $parameter->setAvailableValue(null);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName("Thème & Logo");
        $parameter->setBreakpointsValue("xs-12 md-6");
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Favicon");
        $parameter->setType("upload");
        $parameter->setParamKey("favicon");
        $parameter->setParamValue(null);
        $parameter->setAvailableValue(null);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName("Thème & Logo");
        $parameter->setBreakpointsValue("xs-12 md-6");
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Format des images");
        $parameter->setType("string");
        $parameter->setParamKey("image_format");
        $parameter->setParamValue(0);
        $parameter->setAvailableValue(null);
        $parameter->setTabName(null);
        $parameter->setBlockName(null);
        $parameter->setBreakpointsValue(null);
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Cropper ou compléter les images ?");
        $parameter->setType("bool");
        $parameter->setParamKey("image_to_crop");
        $parameter->setParamValue(false);
        $parameter->setAvailableValue(null);
        $parameter->setTabName(null);
        $parameter->setBlockName(null);
        $parameter->setBreakpointsValue(null);
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Qualité d'image WEBP");
        $parameter->setType("int");
        $parameter->setParamKey("image_webp_quality");
        $parameter->setParamValue(90);
        $parameter->setAvailableValue(null);
        $parameter->setTabName(null);
        $parameter->setBlockName(null);
        $parameter->setBreakpointsValue(null);
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Qualité d'image PNG");
        $parameter->setType("int");
        $parameter->setParamKey("image_png_quality");
        $parameter->setParamValue(90);
        $parameter->setAvailableValue(null);
        $parameter->setTabName(null);
        $parameter->setBlockName(null);
        $parameter->setBreakpointsValue(null);
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Qualité d'image JPG");
        $parameter->setType("int");
        $parameter->setParamKey("image_jpg_quality");
        $parameter->setParamValue(90);
        $parameter->setAvailableValue(null);
        $parameter->setTabName(null);
        $parameter->setBlockName(null);
        $parameter->setBreakpointsValue(null);
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Thème principal (admin)");
        $parameter->setType("string");
        $parameter->setParamKey("admin_theme");
        $parameter->setParamValue("default");
        $parameter->setAvailableValue(null);
        $parameter->setTabName(null);
        $parameter->setBlockName(null);
        $parameter->setBreakpointsValue(null);
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Thème principal");
        $parameter->setType("string");
        $parameter->setParamKey("main_theme");
        $parameter->setParamValue("default");
        $parameter->setAvailableValue(null);
        $parameter->setTabName(null);
        $parameter->setBlockName(null);
        $parameter->setBreakpointsValue(null);
        $om->persist($parameter);

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

        $this->tm->active('default', false, true);
    }
}
