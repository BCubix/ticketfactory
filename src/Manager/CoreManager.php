<?php

namespace App\Manager;

class CoreManager extends AbstractManager
{
    public const SERVICE_NAME = 'core';

    public function addMigrations(string $sourceFolder, string $objectName): void
    {
        $migrationDestFolder = $this->sf->get('pathGetter')->getMigrationsDir();

        // we get the list of migration files
        $migrationFiles = $this->getMigrationFileNames($sourceFolder, $objectName);

        // We sort the files alphabetically (by version)
        usort($migrationFiles, function($a, $b) {
            return (($a["filename"] < $b["filename"]) ? -1 : (($a["filename"] > $b["filename"]) ? 1 : 0));
        });

        // For each file, if it is not in the migration folder, we copy and run it
        foreach ($migrationFiles as $migrationFile) {
            if (is_file($migrationDestFolder . "/" . $migrationFile['filename'])) {
                continue;
            }

            $this->sf->get('file')->copy($migrationFile['path'] . '/' . $migrationFile['filename'], $migrationDestFolder . "/" . $migrationFile["filename"]);
            $this->sf->get('execService')->execMigrationUpdate("DoctrineMigrations\\" . pathinfo($migrationFile['filename'], PATHINFO_FILENAME), true);
        }
    }

    protected function getMigrationFileNames(string $migrationFolder, string $objectName): array
    {
        // We check if migrations folder exists in the module
        if (!is_dir($migrationFolder)) {
            return [];
        }

        // We open the migrations folder to get file infos
        $folder = new \DirectoryIterator($migrationFolder);
        $files = [];

        // We add files to the list if their name matches
        foreach ($folder as $file) {
            if (preg_match('/^' . preg_quote("Version$objectName", '/') . ".*\.php$/", $file->getFilename())) {
                $files[] = [
                    'filename' => $file->getFilename(),
                    'path' => $file->getPath(),
                ];
            }
        }

        return $files;
    }
}