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
     * Executes the clear cache command
     *
     * @return array
     */
    public static function execClearCache(): array
    {
        return static::exec([
            'command' => 'cache:clear'
        ]);
    }

    /**
     * Executes the db migration command
     *
     * @param string $migrationclass
     * @param bool $up
     * 
     * @return array
     */
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

    /**
     * Executes the yarn encore command
     */
    public static function execEncore(): void
    {
        static::execFree('yarn run encore production');
    }

    /**
     * Executes a command through Symfony context
     *
     * @param array $command
     * 
     * @return array
     */
    protected static function exec(array $command): array
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

    /**
     * Executes a free command
     *
     * @param string $command
     *
     * @return void
     * @throws ApiException
     */
    protected static function execFree(string $command): void
    {
        $output = [];
        exec($command, $output, $res);

        if (0 !== $res) {
            throw new ApiException(Response::HTTP_INTERNAL_SERVER_ERROR, 1500,
                "La commande '$command' a échoué (exit code: $res) : " . implode(PHP_EOL, $output));
        }
    }
}