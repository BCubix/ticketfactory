<?php

namespace App\Command;

use App\Controller\Admin\TicketingController;
use App\Entity\Ticketing\Ticketing;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpFoundation\Request;

class TicketingSynchronization extends Command
{
    private $em;
    private $controller;

    protected static $defaultName = 'ticketing:synchronize';
    protected static $defaultDescription = 'Synchronizes the catalog of all tickting entities.';

    public function __construct(EntityManagerInterface $em, TicketingController $controller)
    {
        $this->em = $em;
        $this->controller = $controller;

        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $ticketings = $this->em->getRepository(Ticketing::class)->findBy([
            'active' => true,
            'catalogSynchronization' => true,
        ]);

        foreach ($ticketings as $ticketing) {
            $this->controller->synchronizeCatalog(Request::createFromGlobals(), $ticketing->getId());
        }

        return Command::SUCCESS;
    }
}
