<?php

namespace App\Entity\Technical;

use App\Entity\Datable;

use App\Repository\RequestsLogRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: RequestsLogRepository::class)]
class RequestsLog extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_requests_log_all', 'a_requests_log_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['a_requests_log_all', 'a_requests_log_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $ipAddress = null;
    
    #[JMS\Expose()]
    #[JMS\Groups(['a_requests_log_all', 'a_requests_log_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private $url = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIpAddress(): ?string
    {
        return $this->ipAddress;
    }

    public function setIpAddress(string $ipAddress): static
    {
        $this->ipAddress = $ipAddress;

        return $this;
    }
    
    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;

        return $this;
    }
}
