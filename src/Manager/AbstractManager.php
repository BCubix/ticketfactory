<?php

namespace App\Manager;

use App\Entity\Language\Language;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\Translation\TranslatorInterface;

class AbstractManager
{
    protected $mf;
    protected $em;
    protected $rs;

    public function __construct(ManagerFactory $mf, EntityManagerInterface $em, RequestStack $rs)
    {
        $this->mf = $mf;
        $this->em = $em;
        $this->rs = $rs;
    }

    public function getLocale() {
        return $this->rs->getMainRequest()->getLocale();
    }

    public function getDefaultLanguageId(): int
    {
        return $this->em->getRepository(Language::class)->findDefaultForWebsite()->getId();
    }

    public function getLanguageId() {
        $locale = $this->getLocale();

        $language = $this->em->getRepository(Language::class)->findByLocaleForWebsite($locale);
        if (null == $language) {
            $language = $this->em->getRepository(Language::class)->findDefaultForWebsite();
        }

        return $language->getId();
    }
}
