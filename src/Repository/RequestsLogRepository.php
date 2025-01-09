<?php

namespace App\Repository;

use App\Entity\Technical\RequestsLog;

use Doctrine\Persistence\ManagerRegistry;

class RequestsLogRepository extends AbstractRepository
{
    /*** > Trait ***/
    /*** < Trait ***/

    protected const FILTERS = [
        ['id', 'l.id', 'equals'],
        ['ipAddress', 'l.ipAddress', 'equals'],
    ];

    protected const SORTS = [
        'id' => 'l.id',
        'ipAddress' => 'l.ipAddress',
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RequestsLog::class);
    }

    public function getRecentRequestsLog(): array
    {
        $fiveMinutesAgo = new \DateTimeImmutable('-5 minutes');

        return $this->createQueryBuilder('rl')
            ->where('rl.updatedAt >= :fiveMinutesAgo')
            ->setParameter('fiveMinutesAgo', $fiveMinutesAgo)
            ->orderBy('rl.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByHashedIpAddress(string $hashedIpAddress): ?RequestsLog
    {
        return $this->createQueryBuilder('rl')
            ->where('rl.ipAddress = :hashedIpAddress')
            ->setParameter('hashedIpAddress', $hashedIpAddress)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
    
    public function findBetweenDates(\DateTime $beginDate, \DateTime $endDate): int
    {
        if (is_string($beginDate)) {
            $beginDate = new \DateTime($beginDate);
        }
    
        if (is_string($endDate)) {
            $endDate = new \DateTime($endDate);
        }
        
        return (int) $this->createQueryBuilder('rl')
        ->select('COUNT(DISTINCT rl.ipAddress)')
        ->where('rl.updatedAt BETWEEN :beginDate AND :endDate')
        ->setParameter('beginDate', $beginDate)
        ->setParameter('endDate', $endDate)
        ->getQuery()
        ->getSingleScalarResult();
    }
    
}