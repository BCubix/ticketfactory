<?php

namespace App\Manager;

use App\Entity\Page\Page;
use App\Exception\ApiException;
use App\Kernel;
use App\Service\ServiceFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Uid\Uuid;

class PageManager extends AbstractManager
{
    public const SERVICE_NAME = 'page';
    private const TYPE_FILES_PATH = 'src/Form/Admin/Page/Types/*.php';
    private const NAMESPACE_PATH = '\App\Form\Admin\Page\Types\\';

    protected $ff;
    protected $types;

    public function __construct(
        Kernel $kl,
        ManagerFactory $mf,
        ServiceFactory $sf,
        EntityManagerInterface $em,
        RequestStack $rs,
        FormFactoryInterface $ff
    ) {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->ff = $ff;
        $this->types = $this->loadTypes();
    }

    public function getFieldsSelect()
    {
        return $this->types;
    }

    public function getPageColumnFieldFromType(string $fieldType)
    {
        if (isset($this->types[$fieldType])) {
            $pageColumnField = $this->types[$fieldType];
            $pageColumnField = ltrim($pageColumnField, $pageColumnField[0]);

            return $pageColumnField;
        }

        throw new ApiException(
            Response::HTTP_INTERNAL_SERVER_ERROR,
            1500,
            "Le composant rattaché au type de champs " . $fieldType . " n'a pas été trouvé."
        );
    }

    public function getPageColumnInstanceFromType(string $fieldType)
    {
        $pageColumnField = $this->getPageColumnFieldFromType($fieldType);

        $form = $this->ff->create($pageColumnField);
        $type = $form->getConfig()->getType()->getInnerType();

        return $type;
    }

    public function getByKeyword(string $keyword): Page
    {
        $languageId = $this->getLanguageId();

        $pages = $this->em->getRepository(Page::class)->findByKeywordForWebsite($languageId, $keyword);
        if (count($pages) == 0) {
            throw new \Exception('This page does not exist.');
        }

        return $pages[0];
    }

    public function getTranslationByLanguageGroup(?int $languageId, Uuid $languageGroup): ?Page
    {
        if (null === $languageId) {
            $languageId = $this->getLanguageId();
        }

        $page = $this->em->getRepository(Page::class)->findTranslationByLanguageGroupForWebsite($languageId, $languageGroup->toBinary());

        return $page;
    }

    public function getTranslationByKeyword(?int $languageId, string $keyword): Page
    {
        if (null === $languageId) {
            $languageId = $this->getLanguageId();
        }

        $pages = $this->em->getRepository(Page::class)->findByKeywordForWebsite($languageId, $keyword);
        if (count($pages) == 0) {
            throw new \Exception('This page does not exist.');
        }

        return $pages[0];
    }

    public function getBySlug(string $slug): ?Page
    {
        $languageId = $this->getLanguageId();

        return $this->em->getRepository(Page::class)->findBySlugForWebsite($languageId, $slug);
    }

    public function getPageBySlugArray(array $slugs): ?Page
    {
        $result = null;

        foreach ($slugs as $slug) {
            $page = $this->mf->get('page')->getBySlug($slug);
            if (null === $page || (null !== $result && (null === $page->getParent() || $result->getId() !== $page->getParent()->getId()))) {
                return null;
            }

            if (null === $result && null !== $page->getParent() && ($page->getParent()->getKeyword() !== 'home' || ($page->getParent()->getSlug() !== "" && null !== $page->getParent()->getSlug()))) {
                return null;
            }

            $result = $page;
        }

        return $result;
    }

    public function getPageSlugPath(Page $page): string
    {
        $slugs = [];

        while (null !== $page) {
            $slugs[] = $page->getSlug();
            $page = $page->getParent();
        }

        $slugs = array_reverse($slugs);
        $slugs = implode('/', $slugs);

        return $slugs;
    }

    public function generatePageBreadCrumbs(Page $page): array
    {
        $breadcrumbs = [];

        while (null !== $page) {
            $breadcrumbs[] = [
                'title' => $page->getTitle(),
                'link' => $this->sf->get('urlService')->tfPath($page),
                'slug' => $page->getSlug(),
            ];

            $page = $page->getParent();
        }

        $breadcrumbs = array_reverse($breadcrumbs);

        return $breadcrumbs;
    }

    private function loadTypes()
    {
        $types = [];
        $files = glob($this->sf->get('pathGetter')->getProjectDir() . self::TYPE_FILES_PATH);

        foreach ($files as $file) {
            $className = explode('/', $file);
            $className = $className[count($className) - 1];

            $className = explode('.', $className);
            $className = $className[0];

            $className = (self::NAMESPACE_PATH . $className);

            if (defined("$className::SERVICE_NAME")) {
                $typeName = $className::SERVICE_NAME;
                $types[$typeName] = $className;
            }
        }

        return $types;
    }
}
