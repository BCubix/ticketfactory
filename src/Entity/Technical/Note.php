<?php

namespace App\Entity\Technical;

use App\Entity\Datable;
use App\Entity\User\User;

use App\Repository\NoteRepository;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: NoteRepository::class)]
class Note extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_note_all', 'a_note_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['a_note_all', 'a_note_one'])]
    #[ORM\Column(type: 'string', length: 511)]
    private $message;

    #[JMS\Expose()]
    #[JMS\Groups(['a_note_all', 'a_note_one'])]
    #[ORM\ManyToOne(targetEntity: User::class)]
    private $user;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
