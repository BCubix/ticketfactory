<?php

namespace TicketFactory\Installer\Classes\Session;

final class InstallSession
{
    protected static $instance;

    private function __construct()
    {
        session_name('tf_install_' . substr(md5($_SERVER['HTTP_HOST']), 0, 12));
        $sessionStarted = session_start();
        if ($sessionStarted && !isset($_SESSION['session_mode'])) {
            $_SESSION['session_mode'] = 'session';
            session_write_close();
        }
    }

    public static function getInstance(): self
    {
        if (!static::$instance) {
            static::$instance = new static();
        }

        return static::$instance;
    }

    public function clean(): void
    {
        foreach ($_SESSION as $key => $value) {
            unset($_SESSION[$key]);
        }
    }

    public function &__get($varname): mixed
    {
        if (isset($_SESSION[$varname])) {
            $ref = &$_SESSION[$varname];
        } else {
            $null = null;
            $ref = &$null;
        }
        return $ref;
    }

    public function __set($varname, $value): void
    {
        $_SESSION[$varname] = $value;
    }

    public function __isset($varname): bool
    {
        return isset($_SESSION[$varname]);
    }

    public function __unset($varname): void
    {
        unset($_SESSION[$varname]);
    }
}
