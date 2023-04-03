<?php

namespace App\Service\Exec;

use App\Kernel;

use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;

class ExecService
{
    public const SERVICE_NAME = 'execService';

    /**
     * Exec a command
     *
     * @param array $command
     * @return array
     */
    public static function exec(array $command): array
    {
        $app = $GLOBALS['app'];
        $kernel = $app instanceof Application ? $app->getKernel() : $app;
        $newKernel = new Kernel($kernel->getEnvironment(), $kernel->isDebug());

        $application = new Application($newKernel);
        $application->setAutoExit(false);

        $input = new ArrayInput($command);
        $output = new BufferedOutput();

        try {
            $code = $application->run($input, $output);
        } catch (\Exception $e) {
            $code = 1;
        }

        $output = $output->fetch();

        $newKernel->shutdown();

        return [
            'code' => $code,
            'output' => $output
        ];
    }

    public static function execClearCache(): array
    {
        return static::exec([
            'command' => 'cache:clear'
        ]);
    }

    public static function execMigrationUpdate(string $migrationClass, bool $up): array
    {
        $action = $up ? '--up' : '--down';

        return static::exec([
            'command'          => 'doctrine:migrations:execute',
            'versions'         => [ $migrationClass ],
            '--no-interaction' => true,
            $action            => true,
        ]);
    }
}