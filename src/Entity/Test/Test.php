<?php

namespace App\Entity\Test;

use App\Entity\Datable;
use App\Repository\TestRepository;
use Doctrine\ORM\Mapping as ORM;

use JMS\Serializer\Annotation as JMS;


#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: TestRepository::class)]
class Test extends Datable
{

    #[JMS\Expose()]
    #[JMS\Groups(['a_test_all', 'a_test_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_test_all', 'a_test_one'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_test_all', 'a_test_one'])]
    #[ORM\Column(length: 255)]
    private ?string $feedback = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getFeedback(): ?string
    {
        return $this->feedback;
    }

    public function setFeedback(string $feedback): static
    {
        $this->feedback = $feedback;

        return $this;
    }
}
