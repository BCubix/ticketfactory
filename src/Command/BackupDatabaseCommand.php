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

        // We get connection infos from Doctrine
        $params = $this->connection->getParams();
        $databaseHost = $params['host'];
        $databasePort = $params['port'];
        $databaseName = $params['dbname'];
        $databaseUser = $params['user'];
        $databasePassword = $params['password'];

        // We get the path from args or use a default path
        $pathArgument = $input->getArgument('path');
        $backupPath = $pathArgument ?: __DIR__ . '/../../backups/' . date('Y-m-d_H-i-s') . '_backup.sql';

        // We create the folder if doesn't exist
        if (!is_dir(dirname($backupPath))) {
            mkdir(dirname($backupPath), 0777, true);
        }

        // mysqldump command
        $command = "mysqldump -h $databaseHost -P $databasePort -u $databaseUser --password=$databasePassword $databaseName > $backupPath";

        // We execute the command
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
