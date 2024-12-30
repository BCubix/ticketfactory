<?php

namespace App\Manager;

use App\Entity\Event\EventCategory;
use App\Entity\Event\EventType;
use App\Entity\Event\Room;
use App\Entity\Event\Season;
use App\Entity\Event\SeatingPlan;
use App\Entity\Event\Tag;
use App\Entity\Ticketing\Ticketing;

class EventHistoryManager extends AbstractManager
{
    public const SERVICE_NAME = 'eventHistory';

    public function deSerializeEventHistoryFields(array $fields)
    {
        $result = $fields;
        foreach ($fields as $fieldName => $fieldValue) {
            if (is_array($fieldValue)) {
                foreach ($fieldValue as $key => $id) {
                    $entity = $this->fetchEntityByFieldName($fieldName, $id);
                    if ($entity !== null) {
                        $result[$fieldName][$key] = $entity;
                    }
                }
            } else {
                $entity = $this->fetchEntityByFieldName($fieldName, $fieldValue);
                if ($entity !== null) {
                    $result[$fieldName] = $entity;
                }
            }
        }

        return $result;
    } 

    private function fetchEntityByFieldName(string $fieldName, mixed $value): ?object
    {
        $entityMapping = [
            'mainCategory' => EventCategory::class,
            'room'         => Room::class,
            'season'       => Season::class,
            'tags'         => Tag::class,
            'eventCategories' => EventCategory::class,
            'ticketing'    => Ticketing::class,
            'eventType'    => EventType::class,
            'seatingPlan'  => SeatingPlan::class,
        ];

        if (array_key_exists($fieldName, $entityMapping) && null !== $value) {
            return $this->em->find($entityMapping[$fieldName], $value);
        }

        return null;
    }
}
