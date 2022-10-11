<?php

namespace App\Utils;

class TokenGenerator
{
    public static function generateToken()
    {
        return rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
    }
}
