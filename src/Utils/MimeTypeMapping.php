<?php

namespace App\Utils;

class MimeTypeMapping
{
    private const MIMES = [
        "image/jpeg"                                                                                  => 'Image',
        "image/png"                                                                                   => 'Image',
        "image/gif"                                                                                   => 'Image',
        "image/webp"                                                                                  => 'Image',
        "image/svg+xml"                                                                               => 'Image',
        "audio/midi"                                                                                  => 'Audio',
        "audio/mpeg"                                                                                  => 'Audio',
        "audio/webm"                                                                                  => 'Audio',
        "audio/ogg"                                                                                   => 'Audio',
        "audio/wav"                                                                                   => 'Audio',
        "video/mp4"                                                                                   => 'Vidéo',
        "video/webm"                                                                                  => 'Vidéo',
        "video/ogg"                                                                                   => 'Vidéo',
        "video/mpeg"                                                                                  => 'Vidéo',
        "application/msword"                                                                          => 'Word',
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"                     => 'Word',
        "application/vnd.oasis.opendocument.text"                                                     => 'Word',
        "application/vnd.ms-excel"                                                                    => 'Excel',
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"                           => 'Excel',
        "application/vnd.oasis.opendocument.spreadsheet"                                              => 'Excel',
        "application/vnd.ms-powerpoint"                                                               => 'Powerpoint',
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"                   => 'Powerpoint',
        "application/vnd.oasis.opendocument.presentation"                                             => 'Powerpoint',
        "application/pdf"                                                                             => 'PDF',
        "text/plain"                                                                                  => 'Texte',
        "application/zip"                                                                             => 'Archive',
        "application/x-tar"                                                                           => 'Archive',
        "application/json"                                                                            => 'Autre'
    ];

    public static function getTypeFromMime($mime)
    {
        if (is_null($mime)) {
            return 'Dossier';
        }

        if (isset(self::MIMES[$mime])) {
            return self::MIMES[$mime];
        }

        return null;
    }

    public static function getMimesFromType($type) {
        if (is_null($type)) {
            return null;
        }

        return array_keys(self::MIMES, $type);
    }

    public static function getAllCategories() {
        return array_values(array_unique(self::MIMES));
    }

    public static function getAllMimes() {
        return array_keys(self::MIMES);
    }
}
