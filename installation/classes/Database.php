<?php

namespace TicketFactory\Installer\Classes\Database;

use Exception;
use mysqli;

class Database
{
    private $errors = [];

    public function createDatabase($server, $database, $login, $password, $dropit = false)
    {
        if (strpos($server, ':') !== false) {
            list($host, $port) = explode(':', $server);
            $link = @new mysqli($host, $login, $password, '', (int) $port);
        } else {
            $link = @new mysqli($server, $login, $password);
        }
        $success = $link->query('CREATE DATABASE `' . str_replace('`', '\\`', $database) . '`');
        if ($dropit && ($link->query('DROP DATABASE `' . str_replace('`', '\\`', $database) . '`') !== false)) {
            return true;
        }

        return $success;
    }

    public function testDatabaseSettings($server, $database, $login, $password)
    {
        $errors = [];

        try{
            // Try to connect to database
            $conn = self::checkConnection($server, $login, $password, $database);
        }
        catch (Exception $e) {
            $errors[] = $e->getMessage();
        }

        if (!$errors) {
            switch ($conn) {
                case 0:
                    if (!self::checkEncoding($server, $login, $password)) {
                        $errors[] = 'Cannot convert database data to utf-8';
                    }
                    if (($create_error = self::checkCreatePrivilege($server, $login, $password, $database)) !== true) {
                        $errors[] = 'Your database login does not have the privileges to create table on the database "' . $database . '". Ask your hosting provider:';
                        if ($create_error != false) {
                            $errors[] = $create_error;
                        }
                    }
                    if (($select_error = self::checkSelectPrivilege($server, $login, $password, $database)) !== true) {
                        $errors[] = 'You must be granted the privilege to select data in the tables of database "' . $database . '". Ask your hosting provider to enable it.';
                        if ($select_error !== false) {
                            $errors[] = $select_error;
                        }
                    }

                    break;

                case 1:
                    $errors[] = 'Database Server is not found. Please verify the login, password and server fields';

                    break;

                case 2:
                    $error = 'Connection to MySQL server succeeded, but database "' . $database . '" not found';
                    if ($this->createDatabase($server, $database, $login, $password, true)) {
                        $error .= '<p>' . sprintf('<input type="button" value="%s" class="button" id="btCreateDB">', 'Attempt to create the database automatically') . '</p>
						<script type="text/javascript">bindCreateDB();</script>';
                    }
                    $errors[] = $error;

                    break;
            }
        }

        if (count($errors)) {
            $this->setError($errors);
        }

        return $errors;
    }

    public static function checkConnection($server, $user, $pwd, $db, $timeout = 5)
    {
        $link = mysqli_init();
        if (!$link) {
            return -1;
        }

        if (!$link->options(MYSQLI_OPT_CONNECT_TIMEOUT, $timeout)) {
            return 1;
        }

        // There is an @ because mysqli throw a warning when the database does not exists
        if (!@$link->real_connect($server, $user, $pwd, $db)) {
            return (mysqli_connect_errno() == 1049) ? 2 : 1;
        }

        $link->close();

        return 0;
    }
    public static function checkEncoding($server, $user, $pwd)
    {
        $link = @new mysqli($server, $user, $pwd);
        $ret = $link->query('SET NAMES utf8mb4');
        $link->close();

        return $ret;
    }

    public static function checkCreatePrivilege($server, $user, $pwd, $db)
    {
        $link = @new mysqli($server, $user, $pwd, $db);
        if (mysqli_connect_error()) {
            return false;
        }

        $enginesToTest = ['InnoDB', 'MyISAM'];

        foreach ($enginesToTest as $engineToTest) {
            $result = $link->query('
            CREATE TABLE `test` (
                `test` tinyint(1) unsigned NOT NULL
            ) ENGINE=' . $engineToTest);

            if ($result) {
                $link->query('DROP TABLE `test`');

                return true;
            }
        }

        return $link->error;
    }

    public static function checkSelectPrivilege($server, $user, $pwd, $db)
    {
        $link = @new mysqli($server, $user, $pwd, $db);
        if (mysqli_connect_error()) {
            return false;
        }

        $enginesToTest = ['InnoDB', 'MyISAM'];

        foreach ($enginesToTest as $engineToTest) {
            $link->query('CREATE TABLE `test` (
                `test` tinyint(1) unsigned NOT NULL
            ) ENGINE=' . $engineToTest);

            $result = $link->query('SELECT * FROM `test`');

            $link->query('DROP TABLE `test`');

            if ($result) {
                return true;
            }
        }

        return $link->error;
    }

    public function setError($errors)
    {
        if (!is_array($errors)) {
            $errors = [$errors];
        }

        $this->errors = array_merge($this->errors, $errors);
    }

    public function getErrors()
    {
        return $this->errors;
    }
}
