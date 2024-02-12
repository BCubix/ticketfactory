<?php

namespace TicketFactory\Installer\Classes\Tools;

final class InstallerTools
{
    private function __construct()
    {
    }

    public static function getValue($key, $defaultValue = false): mixed
    {
        if (empty($key) || !is_string($key)) {
            return false;
        }
        if (isset($_POST[$key]) || isset($_GET[$key])) {
            $value = isset($_POST[$key]) ? $_POST[$key] : $_GET[$key];
        }
        if (!isset($value)) {
            $value = $defaultValue;
        }
        if (is_string($value)) {
            return urldecode(preg_replace('/((\%5C0+)|(\%00+))/i', '', urlencode($value)));
        }
        return $value;
    }

    public static function getDirectories(string $path)
    {
        $directoryList = [];
        $dh = @opendir($path);
        if ($dh) {
            while (($file = @readdir($dh)) !== false) {
                if (is_dir($path . DIRECTORY_SEPARATOR . $file) && $file[0] != '.') {
                    $directoryList[] = $file;
                }
            }
            @closedir($dh);
        }

        return $directoryList;
    }
}
