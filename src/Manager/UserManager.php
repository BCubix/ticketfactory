<?php

namespace App\Manager;

use App\Entity\User\User;
use App\Kernel;
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
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        UserPasswordHasherInterface $ph
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->ph = $ph;
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

    public function validateCriticalUsers(User $user, bool $isDeleteAction)
    {
        $criticalRoles = [
            'ROLE_PROFILE_READ',
            'ROLE_PROFILE_EDIT',
            'ROLE_PROFILE_CREATE',
            'ROLE_PROFILE_DELETE',
        ];

        $users = $this->em->getRepository(User::class)->findAll();
        foreach ($users as $currentUser) {
            if ($currentUser->getId() === $user->getId()) {
                if ($isDeleteAction) {
                    continue;
                }

                $currentUser = $user;
            }

            if (array_intersect($criticalRoles, $currentUser->getRoles()) === $criticalRoles) {
                return true;
            }
        }

        return false;
    }
}
