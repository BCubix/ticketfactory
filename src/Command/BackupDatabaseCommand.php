<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class BackupDatabaseCommand extends Command
{
    protected static $defaultName = 'ticketfactory:backup-database';
    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Backup the database into a file')
            ->addArgument('path', InputArgument::OPTIONAL, 'Path where the backup file will be saved');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Récupérer les informations de connexion depuis Doctrine
        $params = $this->connection->getParams();
        $databaseHost = $params['host'];
        $databasePort = $params['port'];
        $databaseName = $params['dbname'];
        $databaseUser = $params['user'];
        $databasePassword = $params['password'];

        // Récupérer le chemin fourni en argument ou utiliser un chemin par défaut
        $pathArgument = $input->getArgument('path');
        $backupPath = $pathArgument ?: __DIR__ . '/../../backups/' . date('Y-m-d_H-i-s') . '_backup.sql';

        // Créer le dossier de backup s'il n'existe pas
        if (!is_dir(dirname($backupPath))) {
            mkdir(dirname($backupPath), 0777, true);
        }

        // Commande mysqldump
        $command = "mysqldump -h $databaseHost -P $databasePort -u $databaseUser --password=$databasePassword $databaseName > $backupPath";

        // Exécuter la commande
        system($command, $result);

        if ($result === 0) {
            $io->success("Backup created successfully: $backupPath");
            return Command::SUCCESS;
        } else {
            $io->error("Backup failed.");
            return Command::FAILURE;
        }
    }
}
