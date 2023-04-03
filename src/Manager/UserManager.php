<?php

namespace App\Manager;

use App\Entity\User\User;
use App\Service\ServiceFactory;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

class UserManager extends AbstractManager
{
    public const SERVICE_NAME = 'user';

    protected $ph;

    public function __construct(
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        UserPasswordHasherInterface $ph
    ) {
        parent::__construct($mf, $sf, $em, $rs);

        $this->ph = $ph;
    }

    public function getAdminUsers(): array
    {
        return $this->em->getRepository(User::class)->findAdminUsersForAdmin();
    }

    public function upgradePassword(PasswordAuthenticatedUserInterface $user): void
    {
        if (null === $user->getPlainPassword() || strlen($user->getPlainPassword()) == 0) {
            return;
        }

        $hashedPassword = $this->ph->hashPassword(
            $user,
            $user->getPlainPassword()
        );
        $user->setPassword($hashedPassword);

        $this->em->persist($user);
    }
}
