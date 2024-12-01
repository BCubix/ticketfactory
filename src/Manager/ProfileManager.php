<?php

namespace App\Manager;

use App\Entity\User\Profile;

class ProfileManager extends AbstractManager
{
    public const SERVICE_NAME = 'profile';

    public function validateCriticalRoles(Profile $profile, bool $isDeleteAction)
    {
        $criticalRoles = [
            'ROLE_PROFILE_READ',
            'ROLE_PROFILE_EDIT',
            'ROLE_PROFILE_CREATE',
            'ROLE_PROFILE_DELETE',
        ];

        $profiles = $this->em->getRepository(Profile::class)->findAll();
        foreach ($profiles as $currentProfile) {
            if ($currentProfile->getId() === $profile->getId()) {
                if ($isDeleteAction) {
                    continue;
                }

                $currentProfile = $profile;
            }

            if (!$currentProfile->isActive()) {
                continue;
            }

            $profileRoles = array_map(fn($role) => $role->getName(), $currentProfile->getRoles()->toArray());
            if (array_intersect($criticalRoles, $profileRoles) === $criticalRoles) {
                if (count(array_map(fn($user) => $user->isActive(), $currentProfile->getUsers()->toArray())) > 0) {
                    return true;
                } 
            }
        }

        return false;
    }
}