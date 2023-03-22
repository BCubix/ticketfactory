<?php

namespace App\Entity\Page;

use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
class PageColumn
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_one'])]
    private mixed $content = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_one'])]
    private ?int $xs = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_one'])]
    private ?int $s = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_one'])]
    private ?int $m = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_one'])]
    private ?int $l = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_page_one', 'a_page_block_one'])]
    private ?int $xl = null;


    public function getContent(): mixed
    {
        return $this->content;
    }

    public function setContent(mixed $content): self
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
}
