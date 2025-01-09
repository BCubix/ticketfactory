<?php

namespace App\Manager;

use App\Entity\Customer\Address;

class AddressManager extends AbstractManager
{
    public const SERVICE_NAME = 'address';

    public function createNewAddressObject(?Address $baseAddress): Address
    {
        $address = new Address();

        if (null === $baseAddress) {
            return $address;
        }

        $address->setFirstName($baseAddress->getFirstName());
        $address->setLastName($baseAddress->getLastName());
        $address->setPhone($baseAddress->getPhone());
        $address->setAddress1($baseAddress->getAddress1());
        $address->setAddress2($baseAddress->getAddress2());
        $address->setZipcode($baseAddress->getZipcode());
        $address->setCity($baseAddress->getCity());
        $address->setCountry($baseAddress->getCountry());

        return $address;
    }
}