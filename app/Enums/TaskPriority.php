<?php

namespace App\Enums;

class TaskPriority
{
    const LOW = 'low';
    const MEDIUM = 'medium';
    const HIGH = 'high';

    public static function getValues()
    {
        return [
            self::LOW,
            self::MEDIUM,
            self::HIGH,
        ];
    }
}
