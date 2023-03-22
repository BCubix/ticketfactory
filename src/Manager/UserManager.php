<?php

namespace App\Manager;

use App\Entity\User\User;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

class UserManager extends AbstractManager
{
    protected $ph;

    public function __construct(
        ManagerFactory $mf,
        EntityManagerInterface $em,
        RequestStack $rs,
        UserPasswordHasherInterface $ph
    ) {
        parent::__construct($mf, $em, $rs);

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
