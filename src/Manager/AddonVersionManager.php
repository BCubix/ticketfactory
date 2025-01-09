<?php

namespace App\Manager;

use App\Entity\Addon\Module;
use App\Exception\ApiException;
use App\Kernel;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AddonVersionManager extends AbstractManager
{
    public const SERVICE_NAME = 'addonVersion';

    private const CORE_FOLDER_LIST = [
        'src',
        'themes/Admin',
        'themes/bundles',
    ];

    private const CORE_FILE_LIST = [
        'composer.json',
        'package.json'
    ];

    private $baseUrl;
    private $fileBasePath;
    private $client;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        HttpClientInterface $client,
    )
    {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->client = $client;
        $this->baseUrl = $mf->get('parameter')->getCoreParameter('marketplace_url') . "/admin/api/marketplace/addon";
        $this->fileBasePath = $sf->get('pathGetter')->getProjectDir() . "AddonUpdates/";
    }

    public function updateAllModules(): void
    {
        $modules = $this->mf->get('module')->getAll();
        $versions = $this->getAddonVersions();

        foreach ($modules['results'] as $module) {
            if (isset($versions[$module['name']]) && $versions[$module['name']]['version'] > $module['version']) {
                $this->updateModule($module['name']);
            }
        }
    }

    public function updateOneModule(string $addonName): void
    {
        $this->updateModule($addonName);
    }

    public function updateModule(string $addonName): void
    {
        $backupDatabase = $this->rs->getMainRequest()->get('backupDatabase') == "1" ? true : false;

        // We check if the module is active
        $isModuleActive = $this->mf->get('module')->isModuleActive($addonName);

        // We download the latest version of the module
        $this->getAddonFile($addonName);

        try {
            // We disable traits of the module if it's enabled
            if ($isModuleActive) {
                $this->mf->get('module')->callConfig($addonName, "trait", [true]);
            }
        } catch (\Throwable $th) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur s'est produite lors de la désinstallation de la version actuelle du module.");
        }

        try {
            // We remove old module folder and copy the new one into modules folder
            $moduleFolderPath = $this->sf->get('pathGetter')->getModulesDir() . "/";
            $this->sf->get('file')->remove($moduleFolderPath . $addonName);
            $this->sf->get('file')->mirror($this->fileBasePath . $addonName . "/" . $addonName, $moduleFolderPath . $addonName);

            // We add traits and migrationFiles if the module is enabled
            if ($isModuleActive) {
                $this->mf->get('module')->callConfig($addonName, "trait", [false]);
                $this->mf->get('module')->executeConfiguration($addonName, Module::ACTION_INSTALL);

                try  {
                    if ($backupDatabase) {
                        $this->sf->get('execService')->execBackupDatabase($this->fileBasePath . "_backup/" .  date('Y-m-d_H-i-s') . "_backup.sql");
                    }

                    $this->mf->get('module')->addMigrations($addonName);

                } catch (\Throwable $th) {
                    throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur s'est produite lors de la modification de la base de donnée.");
                }
            }

            // We delete zip file and temporaryFolder
            $this->sf->get('file')->remove($this->fileBasePath . $addonName);
            $this->sf->get('file')->remove($this->fileBasePath . $addonName . '.zip');
        } catch (\Throwable $th) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur s'est produite lors de l'installation de la nouvelle version du module.");
        }
    }

    public function updateTheme(string $addonName): void
    {
        // We check if the theme is active
        $isThemeActive = $this->mf->get('theme')->isThemeActive($addonName);

        // We download the latest version of the theme
        $this->getAddonFile($addonName);

        try {
            // We remove old theme folder and copy the new one into Website Theme folder
            $themeFolderPath = $this->sf->get('pathGetter')->getThemesDir() . "/";
            $this->sf->get('file')->remove($themeFolderPath . $addonName);
            $this->sf->get('file')->mirror($this->fileBasePath . $addonName . "/" . $addonName, $themeFolderPath . $addonName);

            // We add traits and migrationFiles if the module is enabled
            if ($isThemeActive) {
                $this->mf->get('theme')->executeConfiguration($addonName, Module::ACTION_INSTALL);
            }

            // We delete zip file and temporaryFolder
            $this->sf->get('file')->remove($this->fileBasePath . $addonName);
            $this->sf->get('file')->remove($this->fileBasePath . $addonName . '.zip');
        } catch (\Throwable $th) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur s'est produite lors de l'installation de la nouvelle version du thème.");
        }
    }

    public function updateCore(): void
    {
        $es = $this->sf->get('execService');
        $backupDatabase = $this->rs->getMainRequest()->get('backupDatabase') == "1" ? true : false;

        // We get the new version number
        $versions = $this->getAddonVersions();
        if (!isset($versions['TicketFactory'])) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur est survenue.");
        }

        // We download the latest version of the core
        $this->getAddonFile('TicketFactory');

        // we get the project dir path and define the core name
        $projectDir = $this->sf->get('pathGetter')->getProjectDir();
        $coreName = "TicketFactory";

        try {
            // For each registered folder, we replace the old version with the new one.
            foreach (self::CORE_FOLDER_LIST as $copyPath) {
                $this->sf->get('file')->mirror($this->fileBasePath . "$coreName/$coreName/$copyPath" , $projectDir . $copyPath, null, ['override' => true]);
            }

            // For each registered file, we replace the old version with the new one.
            foreach (self::CORE_FILE_LIST as $copyPath) {
                $this->sf->get('file')->copy($this->fileBasePath . "$coreName/$coreName/$copyPath" , $projectDir . $copyPath, true);
            }
        } catch (\Throwable $th) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur s'est produite lors de la copie de la nouvelle version de Ticket Factory.");
        }

        try {
            if ($backupDatabase) {
                $es->execBackupDatabase($this->fileBasePath . "_backup/" .  date('Y-m-d_H-i-s') . "_backup.sql");
            }

            // We add new migration files and execute them
            $this->mf->get('core')->addMigrations($this->fileBasePath . "$coreName/$coreName/migrations", $coreName);
        } catch (\Throwable $th) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur s'est produite lors de l'execution des fichiers de migrations de la nouvelle version de Ticket Factory.");
        }

        try {
            // We get enabled modules
            $modules = $this->mf->get('module')->getAll(["active" => true]);

            // We add traits for each enabled module
            foreach ($modules['results'] as $module)  {
                $this->mf->get('module')->callConfig($module['name'], "trait", [false]);
            }
        } catch (\Throwable $th) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur s'est produite lors de la réactivation des modules.");
        }

        try {
            //$this->sf->get('execService')->execUpdateCommands(false);
        } catch (\Throwable $th) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur s'est produite lors de l'installation de la nouvelle version de Ticket Factory.");
        }

        // We set the tickect factory version parameter to the last
        $this->mf->get('parameter')->set('core_ticket_factory_version', $versions['TicketFactory']['version']);
        $this->em->flush();

        // We delete the temporary folder and zip
        $this->sf->get('file')->remove($this->fileBasePath . $coreName);
        $this->sf->get('file')->remove($this->fileBasePath . $coreName . ".zip");
    }

    public function getAddonVersions(): array
    {
        $modules = $this->mf->get('module')->getAll();
        $themes = $this->mf->get('theme')->getAll();
        $addonNames = ["TicketFactory"];

        foreach ($modules['results'] as $module) {
            $addonNames[] = $module['name'];
        }

        foreach ($themes as $theme) {
            $addonNames[] = $theme['name'];
        }

        // We get the latest downloadable versions
        $response = $this->client->request('GET', $this->baseUrl . '/versions', [
            'query' => [
                'filters[addonNames]' => $addonNames
            ]
        ]);

        if ($response->getStatusCode() !== 200) {
            return [];
        }

        return $response->toArray() ?? [];
    }

    public function checkAddonVersions(): void
    {
        $lastCheckDate = $this->mf->get('parameter')->getCoreParameter('last_checked_addon_versions');
        $now = new \DateTime();

        if (null !== $lastCheckDate) {
            $lastCheckDate = (new \DateTime())->setTimestamp($lastCheckDate);
            $interval = $now->diff($lastCheckDate);

            if ($interval->days == 0 && $interval->h < 24) {
                return;
            }
        }

        $versions = $this->getAddonVersions();
        $modules = $this->mf->get('module')->getAll();
        $themes = $this->mf->get('theme')->getAll();

        $updatableModules = false;
        foreach ($modules['results'] as $module) {
            if (isset($versions[$module['name']]) && $versions[$module['name']]['version'] > $module['version']) {
                $updatableModules = true;
                break;
            }
        }

        $updatableThemes = false;
        foreach ($themes as $theme) {
            if (isset($versions[$theme['name']]) && $versions[$theme['name']]['version'] > $theme['version']) {
                $updatableModules = true;
                break;
            }
        }

        if ($updatableModules) {
            $this->mf->get('notification')->createUpdatableAddonNotification("Nouvelle version de module disponible", "Une nouvelle version de module est disponible. Veuillez la télécharger pour bénéficier des dernières fonctionnalités.", 'Module');
        }

        if ($updatableThemes) {
            $this->mf->get('notification')->createUpdatableAddonNotification("Nouvelle version de thème disponible", "Une nouvelle version de thème est disponible. Veuillez la télécharger pour bénéficier des dernières fonctionnalités.", 'Theme');
        }

        $coreVersion = $this->mf->get('parameter')->getCoreParameter('ticket_factory_version');
        if (isset($versions["TicketFactory"]) && $versions["TicketFactory"]['version'] > $coreVersion) {
            $this->mf->get('notification')->createUpdatableAddonNotification("Nouvelle version de TicketFactory disponible", "Une nouvelle version de TicketFactory est disponible. Veuillez la télécharger pour bénéficier des dernières fonctionnalités.", 'Core');
        }

        $this->mf->get('parameter')->set('core_last_checked_addon_versions', $now->getTimestamp());
        $this->em->flush();
    }

    private function getAddonFile(string $addonName)
    {
        // We get the marketpace token from the request
        $token = $this->rs->getMainRequest()->get('marketplaceToken');
        if (null === $token) {
            throw new ApiException(Response::HTTP_BAD_REQUEST, 1400, "Une erreur s'est produite lors du téléchargement de la nouvelle version.");
        }

        // We get the new version zip file from api with addonName
        $response = $this->client->request('GET', $this->baseUrl . "/$addonName", [
            'headers' => [
                'Authorization' => "Bearer $token",
            ]
        ]);
        if ($response->getStatusCode() !== 200) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500, "Une erreur s'est produite lors du téléchargement de la nouvelle version.");
        }

        if (!is_dir($this->fileBasePath)) {
            $this->sf->get('file')->mkdir($this->fileBasePath);
        }

        // We create a file with the downloaded content
        $filePath = $this->fileBasePath . $addonName . '.zip';
        $this->sf->get("file")->createFile($filePath, $response->getContent());

        // We create the temporary folder and unzip the file in it
        $this->sf->get('file')->mkdir($this->fileBasePath . $addonName);
        $this->sf->get('zip')->unzip($filePath, $this->fileBasePath . $addonName, false);
    }
}