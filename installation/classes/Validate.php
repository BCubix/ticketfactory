<?php

namespace TicketFactory\Installer\Classes\Validate;

use Egulias\EmailValidator\EmailValidator;
use Egulias\EmailValidator\Validation\RFCValidation;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Validation;

class Validate
{
    public static function isUrl($url)
    {
        return preg_match('/^[~:#,$%&_=\(\)\.\? \+\-@\/a-zA-Z0-9\pL\pS-]+$/u', $url);
    }

    public static function isName(string $name): bool
    {
        return preg_match('/^[^0-9!<>,;?=+()@#"°{}_$%:¤|]*$/u', $name);
    }

    public static function isEmail(string $email): bool
    {
        if (empty($email)) {
            return false;
        }

        $validator = Validation::createValidator();
        $errors = $validator->validate($email, new Email([
            'mode' => 'html5',
        ]));

        if (count($errors) > 0) {
            return false;
        }

        // Check if the value is correct according to validator
        return (new EmailValidator())->isValid($email, new RFCValidation());
    }

    public static function isStructureType(string $strctureId): bool
    {
        return is_string($strctureId) && strlen($strctureId) > 0;
    }

    public static function isPasswordValid(string $password): bool
    {
        return preg_match('/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{10,}$/u', $password);
    }

    public static function isDbAddress(string $address): bool
    {
        return preg_match('/^[^\/]+$/u', $address);
    }

    public static function isDbName(string $name): bool
    {
        return preg_match('/^[^?]+$/u', $name);
    }

    public static function isDbLogin(string $login): bool
    {
        return preg_match('/^[^:]+$/u', $login);
    }

    public static function isDbPassword(string $password): bool
    {
        return preg_match('/^[^@]+$/u', $password);
    }
}
