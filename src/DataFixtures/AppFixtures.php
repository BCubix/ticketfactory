<?php

namespace App\DataFixtures;

use App\Entity\Event\EventCategory;
use App\Entity\Parameter\Parameter;
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
        // Root Category
        $eventCategory = new EventCategory();
        $eventCategory->setName('Accueil');
        $om->persist($eventCategory);

        // Parameters
        $parameter = new Parameter();
        $parameter->setName("Type d'évènements par défaut");
        $parameter->setType("list");
        $parameter->setParamKey("default_events_type");
        $parameter->setParamValue("Pièces");
        $parameter->setAvailableValue(
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
        );
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName("Types par défaut");
        $parameter->setBreakpointsValue("xs-12 md-6");
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Type de structures par défaut");
        $parameter->setType("list");
        $parameter->setParamKey("default_structures_type");
        $parameter->setParamValue(3);
        $parameter->setAvailableValue(
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
        );
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

        // Default User
        $user = new User();
        $user->setEmail('thomas.anderson@matrix.com');
        $user->setPlainPassword('matrix');
        $user->setFirstName('Thomas');
        $user->setLastName('Anderson');
        $this->um->upgradePassword($user);

        $om->flush();
    }
}
