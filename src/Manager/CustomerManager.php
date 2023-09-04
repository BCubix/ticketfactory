<?php

namespace App\Manager;

use App\Kernel;
use App\Service\ServiceFactory;
use App\Entity\Customer\Customer;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Uid\Uuid;

class CustomerManager extends AbstractManager
{
    public const SERVICE_NAME = 'customer';

    protected $ph;
    protected $router;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        UserPasswordHasherInterface $ph,
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->ph = $ph;
    }

    public function upgradePassword(PasswordAuthenticatedUserInterface $customer): void
    {
        if (null === $customer->getPlainPassword() || strlen($customer->getPlainPassword()) == 0) {
            return;
        }

        $hashedPassword = $this->ph->hashPassword(
            $customer,
            $customer->getPlainPassword()
        );
        $customer->setPassword($hashedPassword);

        $this->em->persist($customer);
    }

    public function checkEmailAddress(Customer $customer)
    {
        $newEmail = mb_convert_case($customer->getEmail(), MB_CASE_LOWER);
        $customer->setEmail($newEmail);

        $customer->setActive(true);
        $customer->setEmailToken(Uuid::v4());
    }
}
