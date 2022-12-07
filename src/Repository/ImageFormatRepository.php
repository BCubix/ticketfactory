<?php

namespace App\Repository;

use App\Entity\Media\ImageFormat;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ImageFormatRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['name', 'o.name', 'search'],
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'name' => 'o.name',
        'height' => 'o.height',
        'length' => 'o.length'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ImageFormat::class);
    }

    public function findOneByNameForAdmin(string $name)
    {
        return $this->createQueryBuilder('u')
            ->where('u.name = :name')
            ->setParameter('name', $name)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
}
