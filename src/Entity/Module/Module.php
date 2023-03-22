<?php

namespace App\Entity\Module;

use App\Entity\Datable;
use App\Entity\Hook\Hook;
use App\Repository\ModuleRepository;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as JMS;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: ModuleRepository::class)]
class Module extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    const ACTION_INSTALL = -1;
    const ACTION_DISABLE = 0;
    const ACTION_UNINSTALL = 1;
    const ACTION_UNINSTALL_DELETE = 2;

    #[JMS\Expose()]
    #[JMS\Groups(['a_hook_all', 'a_hook_one', 'a_module_all', 'a_module_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private $id;

    #[JMS\Expose()]
    #[JMS\Groups(['a_hook_all', 'a_hook_one', 'a_module_all', 'a_module_one'])]
    #[ORM\Column(type: Types::STRING, length: 255)]
    private $name;

    #[ORM\OneToMany(mappedBy: 'module', targetEntity: Hook::class, orphanRemoval: true,  cascade: ['persist', 'remove', 'detach', 'merge'])]
    private $hooks;

    public function __construct()
    {
        $this->hooks = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Module>
     */
    public function getHooks(): Collection
    {
        return $this->hooks;
    }

    public function addHook(Hook $hook): self
    {
        if (!$this->hooks->contains($hook)) {
            $this->hooks[] = $hook;
            $hook->setModule($this);
        }

        return $this;
    }

    public function removeHook(Hook $hook): self
    {
        if ($this->hooks->removeElement($hook)) {
            if ($hook->getModule() === $this) {
                $hook->setModule(null);
            }
        }

        return $this;
    }
}
