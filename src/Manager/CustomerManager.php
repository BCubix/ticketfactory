<?php

namespace App\Manager;

use App\Kernel;
use App\Service\ServiceFactory;
use App\Entity\Customer\Customer;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Routing\RouterInterface;
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
        RouterInterface $router
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->ph = $ph;
        $this->router = $router;
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

    public function checkEmailAddress(Customer $customer): void
    {
        $newEmail = mb_convert_case($customer->getEmail(), MB_CASE_LOWER);
        $customer->setEmail($newEmail);

        $customer->setActive(false);
        $customer->setEmailToken(Uuid::v4());

        $path = $this->router->generate(
            'tf_website_email_validation',
            ['email' => $customer->getEmail(), 'token' => $customer->getEmailToken()],
            RouterInterface::ABSOLUTE_URL
        );
        $this->sf->get("mailer")->sendRegistrationEmail($customer, $path);
    }

    public function forgotPassword(Customer $customer): void
    {
        $customer->setEmailToken(Uuid::v4());

        $this->em->persist($customer);

        $path = $this->router->generate(
            'tf_website_reset_password',
            ['email' => $customer->getEmail(), 'token' => $customer->getEmailToken()],
            RouterInterface::ABSOLUTE_URL
        );

        $this->sf->get("mailer")->sendResetCustomerPasswordEmail($customer, $path);
    }
}
