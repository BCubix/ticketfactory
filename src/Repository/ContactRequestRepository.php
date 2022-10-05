<?php

namespace App\Repository;

use App\Entity\ContactRequest\ContactRequest;

use Doctrine\Persistence\ManagerRegistry;

class ContactRequestRepository extends CrudRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactRequest::class);
    }
}
