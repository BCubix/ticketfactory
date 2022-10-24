<?php

namespace App\Repository;

use App\Entity\ContactRequest\ContactRequest;

use Doctrine\Persistence\ManagerRegistry;

class ContactRequestRepository extends CrudRepository
{
    protected const FILTERS = [
        ['active', 'o.active', 'equals'],
        ['firstName', 'o.firstName', 'search'],
        ['lastName', 'o.lastName', 'search'],
        ['email', 'o.email', 'search'],
        ['phone', 'o.phone', 'search'],
        ['subject', 'o.subject', 'search']
    ];

    protected const SORTS = [
        'id' => 'o.id',
        'active' => 'o.active',
        'firstName' => 'o.firstName',
        'lastName' => 'o.lastName',
        'email' => 'o.email',
        'phone' => 'o.phone',
        'subject' => 'o.subject'
    ];

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactRequest::class);
    }
}
