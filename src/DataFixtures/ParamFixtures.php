<?php

namespace App\DataFixtures;

use App\Entity\Parameter\Parameter;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ParamFixtures extends Fixture
{
    public function load(ObjectManager $om): void
    {
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
        $parameter->setName("Nom");
        $parameter->setType("string");
        $parameter->setParamKey("website_name");
        $parameter->setParamValue(null);
        $parameter->setAvailableValue(null);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName(null);
        $parameter->setBreakpointsValue(null);
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Logo");
        $parameter->setType("upload");
        $parameter->setParamKey("website_logo");
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
        $parameter->setParamValue(null);
        $parameter->setAvailableValue(null);
        $parameter->setTabName(null);
        $parameter->setBlockName(null);
        $parameter->setBreakpointsValue(null);
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Page saisons");
        $parameter->setType("Page");
        $parameter->setParamKey("page_season");
        $parameter->setParamValue(1);
        $parameter->setAvailableValue(null);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName('URLs');
        $parameter->setBreakpointsValue('xs-12 md-6');
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Page salles");
        $parameter->setType("Page");
        $parameter->setParamKey("page_room");
        $parameter->setParamValue(1);
        $parameter->setAvailableValue(null);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName('URLs');
        $parameter->setBreakpointsValue('xs-12 md-6');
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Page catégories");
        $parameter->setType("Page");
        $parameter->setParamKey("page_eventCategory");
        $parameter->setParamValue(1);
        $parameter->setAvailableValue(null);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName('URLs');
        $parameter->setBreakpointsValue('xs-12 md-6');
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Page tag");
        $parameter->setType("Page");
        $parameter->setParamKey("page_tag");
        $parameter->setParamValue(1);
        $parameter->setAvailableValue(null);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName('URLs');
        $parameter->setBreakpointsValue('xs-12 md-6');
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Page événements");
        $parameter->setType("Page");
        $parameter->setParamKey("page_event");
        $parameter->setParamValue(1);
        $parameter->setAvailableValue(null);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName('URLs');
        $parameter->setBreakpointsValue('xs-12 md-6');
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("Format de l'URL des événements");
        $parameter->setType("string");
        $parameter->setParamKey("event_url_format");
        $parameter->setParamValue('%slug%');
        $parameter->setAvailableValue(null);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName('URLs');
        $parameter->setBreakpointsValue('xs-12 md-6');
        $om->persist($parameter);

        $parameter = new Parameter();
        $parameter->setName("1er mois de la saison");
        $parameter->setType("list");
        $parameter->setParamKey("season_month");
        $parameter->setParamValue(9);
        $parameter->setAvailableValue([
            [
                "id"   => 1,
                "name" => "Janvier"
            ], [
                "id"   => 2,
                "name" => "Février"
            ], [
                "id"   => 3,
                "name" => "Mars"
            ], [
                "id"   => 4,
                "name" => "Avril"
            ], [
                "id"   => 5,
                "name" => "Mai"
            ], [
                "id"   => 6,
                "name" => "Juin"
            ], [
                "id"   => 7,
                "name" => "Juillet"
            ], [
                "id"   => 8,
                "name" => "Août"
            ], [
                "id"   => 9,
                "name" => "Septembre"
            ], [
                "id"   => 10,
                "name" => "Octobre"
            ], [
                "id"   => 11,
                "name" => "Novembre"
            ], [
                "id"   => 12,
                "name" => "Décembre"
            ], 
        ]);
        $parameter->setTabName("Paramètres généraux");
        $parameter->setBlockName('Saison');
        $parameter->setBreakpointsValue('xs-12 md-6');
        $om->persist($parameter);

        $om->flush();
    }
}
