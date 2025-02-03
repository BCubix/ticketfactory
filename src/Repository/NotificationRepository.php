<?php

namespace App\Repository;

use App\Entity\Notification\Notification;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class NotificationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notification::class);
    }

    public function findAllNotificationForUser(int $userId, array $filters): array
    {
        $limit = isset($filters['limit']) ? $filters['limit'] : 10;

        $result = $this->createQueryBuilder('n')
            ->innerJoin("n.user", "u", "WITH", "u.id = :userId");

        if (isset($filters['lastNotification'])) {
            $result = $result
                ->andWhere('n.id < :lastNotification')
                ->setParameter('lastNotification', $filters['lastNotification']);
        }

        return $result
            ->setParameter("userId", $userId)
            ->orderBy('n.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findOneNotificationForUser(int $notificationId, int $userId): ?Notification
    {
        return $this->createQueryBuilder('n')
            ->innerJoin("n.user", "u", "WITH", "u.id = :userId")
            ->where('n.id = :notificationId')
            ->setParameter("userId", $userId)
            ->setParameter("notificationId", $notificationId)
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getOneOrNullResult();
    }
}
