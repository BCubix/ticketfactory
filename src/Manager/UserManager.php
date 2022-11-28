<?php

namespace App\Manager;

use App\Entity\User\User;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

class UserManager extends AbstractManager
{
    private $ph;

    public function __construct(EntityManagerInterface $em, UserPasswordHasherInterface $ph)
    {
        parent::__construct($em);

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
