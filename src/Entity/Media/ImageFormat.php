<?php

namespace App\Entity\Media;

use App\Entity\Datable;
use App\Repository\ImageFormatRepository;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as JMS;
use Symfony\Component\Validator\Constraints as Assert;

#[JMS\ExclusionPolicy('all')]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: ImageFormatRepository::class)]
class ImageFormat extends Datable
{
    /*** > Trait ***/
    /*** < Trait ***/

    #[JMS\Expose()]
    #[JMS\Groups(['a_image_format_all', 'a_image_format_one'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[Assert\Length(max: 250, maxMessage: 'Le nom du format doit être inférieur à {{ limit }} caractères.')]
    #[Assert\NotBlank(message: 'Le nom du format doit être renseigné.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_image_format_all', 'a_image_format_one'])]
    #[ORM\Column(type: 'string', length: 255)]
    private ?string $name = null;

    #[Gedmo\Slug(fields: ['name'], updatable: false)]
    #[JMS\Expose()]
    #[JMS\Groups(['a_image_format_one'])]
    #[ORM\Column(length: 123, unique: true)]
    private ?string $slug = null;

    #[Assert\PositiveOrZero(message: 'La hauteur de l\'image doit être un nombre supérieur ou égal à 0.')]
    #[Assert\NotBlank(message: 'La hauteur de l\'image doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_image_format_all', 'a_image_format_one'])]
    #[ORM\Column(type: 'integer')]
    private ?int $height = null;

    #[Assert\PositiveOrZero(message: 'La largeur de l\'image doit être un nombre supérieur ou égal à 0.')]
    #[Assert\NotBlank(message: 'La largeur de l\'image doit être renseignée.')]
    #[JMS\Expose()]
    #[JMS\Groups(['a_image_format_all', 'a_image_format_one'])]
    #[ORM\Column(type: 'integer')]
    private ?int $width = null;

    #[JMS\Expose()]
    #[JMS\Groups(['a_image_format_all', 'a_image_format_one'])]
    #[ORM\Column(type: 'boolean')]
    private ?bool $themeUse = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getHeight(): ?int
    {
        return $this->height;
    }

    public function setHeight(int $height): self
    {
        $this->height = $height;

        return $this;
    }

    public function getWidth(): ?int
    {
        return $this->width;
    }

    public function setWidth(int $width): self
    {
        $this->width = $width;

        return $this;
    }

    public function isThemeUse(): ?bool
    {
        return $this->themeUse;
    }

    public function setThemeUse(bool $themeUse): self
    {
        $this->themeUse = $themeUse;

        return $this;
    }
}
