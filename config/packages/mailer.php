<?php

use App\Service\Db\Db;
use Symfony\Config\FrameworkConfig;


return static function (FrameworkConfig $framework): void {
    $host = Db::getInstance()->query("SELECT * FROM parameter WHERE param_key = 'core_email_host'");
    if (count($host) !== 1 || null === $host[0]) {
        return;
    } else {
        $host = $host[0]["param_value"];
    }
    
    $port = Db::getInstance()->query("SELECT * FROM parameter WHERE param_key = 'core_email_port'");
    if (count($port) !== 1 || null === $port[0]) {
        $port = 465;
    } else {
        $port = $port[0]["param_value"];
    }

    $user = Db::getInstance()->query("SELECT * FROM parameter WHERE param_key = 'core_email_user'");
    if (count($user) !== 1 || null === $user[0]) {
        return;
    } else {
        $user = $user[0]["param_value"];
    }

    $password = Db::getInstance()->query("SELECT * FROM parameter WHERE param_key = 'core_email_password'");
    if (count($password) !== 1 || null === $password[0]) {
        return;
    } else {
        $password = $password[0]["param_value"];
    }
    
    $dsn = "smtp://" . $user . ":" . $password . "@" . $host . ":" . $port . "?encryption=tls&auth_mode=login";
    $framework->mailer()->dsn($dsn);
};