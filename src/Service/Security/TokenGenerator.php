<?php

namespace App\Service\Security;

class TokenGenerator
{
    public const SERVICE_NAME = 'tokenGenerator';

    public static function generateToken()
    {
        return rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
    }
}
