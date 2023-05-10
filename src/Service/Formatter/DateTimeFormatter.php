<?php

namespace App\Service\Formatter;

class DateTimeFormatter
{
    public static function formatDateTime(\DateTime $dateTime, string $locale, string $format): ?string
    {
        return self::formatIntlObj($dateTime, $locale, $format);
    }

    public static function formatDate(\DateTime $date, string $locale, string $weekDayFormat): ?string
    {
        return self::formatIntlObj($date, $locale, $weekDayFormat);
    }

    public static function formatTime(\DateTime $time, string $locale, string $format): ?string
    {
        return self::formatIntlObj($time, $locale, $format);
    }

    private static function formatIntlObj(\DateTime $object, string $locale, string $format): ?string
    {
        if (null === $object) {
            return null;
        }

        $formatter = new \IntlDateFormatter(
            $locale,
            \IntlDateFormatter::FULL,
            \IntlDateFormatter::FULL,
            'Europe/Paris',
            \IntlDateFormatter::GREGORIAN,
            $format
        );

        return $formatter->format($object);
    }
}
