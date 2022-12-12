<?php

namespace App\Entity\Page;

use App\Entity\JsonDoctrineSerializable;
use JMS\Serializer\Annotation as JMS;

class PageColumn implements JsonDoctrineSerializable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?string $content = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?int $xs = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?int $s = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?int $m = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?int $l = null;

    #[JMS\Expose()]
    #[JMS\Groups(['tf_admin'])]
    private ?int $xl = null;


    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getXs(): ?int
    {
        return $this->xs;
    }

    public function setXs(int $xs): self
    {
        $this->xs = $xs;

        return $this;
    }

    public function getS(): ?int
    {
        return $this->s;
    }

    public function setS(int $s): self
    {
        $this->s = $s;

        return $this;
    }

    public function getM(): ?int
    {
        return $this->m;
    }

    public function setM(int $m): self
    {
        $this->m = $m;

        return $this;
    }

    public function getL(): ?int
    {
        return $this->l;
    }

    public function setL(int $l): self
    {
        $this->l = $l;

        return $this;
    }

    public function getXl(): ?int
    {
        return $this->xl;
    }

    public function setXl(int $xl): self
    {
        $this->xl = $xl;

        return $this;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'content' => $this->content,
            'xs'      => $this->xs,
            's'       => $this->s,
            'm'       => $this->m,
            'l'       => $this->l,
            'xl'      => $this->xl
        ];
    }

    public static function jsonDeserialize($data): self
    {
        $object          = new self();
        $object->content = $data['content'];
        $object->xs      = $data['xs'];
        $object->s       = $data['s'];
        $object->m       = $data['m'];
        $object->l       = $data['l'];
        $object->xl      = $data['xl'];

        return $object;
    }
}
