<?php

namespace App\Repository;

use App\Entity\Technical\ToDoTask;
use Doctrine\Persistence\ManagerRegistry;

class ToDoTaskRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ToDoTask::class);
    }
}
