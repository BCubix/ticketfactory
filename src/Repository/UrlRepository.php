<?php

namespace App\Repository;

use App\Entity\Url\Url;
use App\Repository\CrudRepository;
use Doctrine\Persistence\ManagerRegistry;

class UrlRepository extends CrudRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name',
        'position' => 'o.position'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Url::class);
    }

    public function findAllForReOrder(): array
    {
        return $this->createQueryBuilder('u')
            ->orderBy('u.position', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findAllForWebsite(): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.active = 1')
            ->orderBy('u.position', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
