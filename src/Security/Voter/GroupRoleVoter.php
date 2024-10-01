<?php

namespace App\Security\Voter;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class GroupRoleVoter extends Voter
{
    private const ROLES = [
        'VIEW'      => "ROLE_VIEWER",
        'CREATE'    => "ROLE_AUTHOR",
        'EDIT'      => "ROLE_EDITOR",
        'DELETE'    => "ROLE_REMOVER",
        'ADMIN'     => "ROLE_ADMIN",
    ];

    protected function supports(string $attribute, $subject): bool
    {
        return in_array($attribute, array_keys(self::ROLES));
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        $roles = $user->getRoles();
        if (in_array(self::ROLES['ADMIN'], $roles)) {
            return true;
        }

        return in_array(self::ROLES[$attribute], $roles);
    }
}