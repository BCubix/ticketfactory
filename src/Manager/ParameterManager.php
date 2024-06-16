<?php

namespace App\Manager;

use App\Entity\Event\Event;
use App\Entity\Event\EventCategory;
use App\Entity\Event\Room;
use App\Entity\Event\Season;
use App\Entity\Media\Media;
use App\Entity\Media\MediaCategory;
use App\Entity\Page\Page;
use App\Entity\Parameter\Parameter;
use App\Exception\ApiException;
use App\Kernel;
use App\Service\ServiceFactory;
use Doctrine\ORM\EntityManagerInterface;
use FontLib\Font;
use JMS\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;

class ParameterManager extends AbstractManager
{
    public const SERVICE_NAME = 'parameter';
    private const ENV_FILES_NAME = ['.env.local', '.env'];

    protected $twig;
    protected $se;

    public function __construct(Kernel $kl, ManagerFactory $mf, ServiceFactory $sf, EntityManagerInterface $em, RequestStack $rs, Environment $twig, SerializerInterface $se)
    {
        parent::__construct($kl, $mf, $sf, $em, $rs);

        $this->twig = $twig;
        $this->se = $se;
    }

    public function getAll()
    {
        $parameters = $this->em->getRepository(Parameter::class)->findAllForAdminArray();
        for ($i = 0; $i < count($parameters); ++$i) {
            if ($parameters[$i]['type'] === 'upload') {
                continue;
            }
            $parameters[$i]['paramValue'] = $this->get($parameters[$i]['paramKey']);
        }

        return $parameters;
    }

    public function get(string $key): mixed
    {
        return $this->getParameterValue($this->getParameter($key));
    }

    public function getModuleParameter(string $objectName, string $key): mixed
    {
        return $this->mf->get('cache')->getValue('parameter_module_' . $objectName . '_' . $key , function () use ($objectName, $key) {
            return $this->getParameterValue($this->getParameter('module_' . $objectName . '_' . $key));
        });
    }

    public function getThemeParameter(?string $objectName, string $key): mixed
    {
        if (null === $objectName) {
            $objectName = $this->getCoreParameter('main_theme');
        }

        return $this->mf->get('cache')->getValue('parameter_theme_' . $objectName . '_' . $key , function () use ($objectName, $key) {
            return $this->getParameterValue($this->getParameter('theme_' . $objectName . '_' . $key));
        });
    }

    public function getCoreParameter(string $key): mixed
    {
        return $this->mf->get('cache')->getValue('parameter_core_' . $key , function () use ($key) {
            return $this->getParameterValue($this->getParameter('core_' . $key));
        });
    }

    public function set(string $key, mixed $newValue)
    {
        $parameter = $this->em->getRepository(Parameter::class)->findOneByKeyForAdmin($key);
        if (null === $parameter) {
            $parameter = new Parameter();
            $parameter->setName($key);
            $parameter->setType('string');
            $parameter->setParamKey($key);
        }

        $availableValue = $parameter->getAvailableValue();
        if (null !== $availableValue && !in_array($newValue, $availableValue)) {
            throw new ApiException(
                Response::HTTP_NOT_FOUND,
                1404,
                "Le paramètre(s) avec la clé $key ne contient pas la valeur $newValue dans les valeurs disponibles."
            );
        }

        $parameter->setParamValue($newValue);
        $this->em->persist($parameter);
    }

    public function getParameter(string $key): Parameter
    {
        $parameter = $this->em->getRepository(Parameter::class)->findOneByKeyForAdmin($key);
        if (null === $parameter) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, "Le paramètre avec la clé $key n'existe pas.");
        }

        return $parameter;
    }

    public function getParameterValue(Parameter $parameter): mixed
    {
        $format = $parameter->getType();
        $value = $parameter->getParamValue();

        if (null === $value || "null" === $value) {
            return null;
        }

        switch ($format) {
            case 'int':
                return intval($value);

            case 'float':
                return floatval($value);

            case 'bool':
                return boolval($value);

            case 'prices':
                return $this->se->deserialize($value, 'array', 'json');

            case 'openingHours':
                return $this->se->deserialize($value, 'array', 'json');

            case 'upload':
                return ('/uploads/parameter/' . $value);

            case 'Page':
                return $this->em->getRepository(Page::class)->findOneForAdmin($value);

            case 'Season':
                return $this->em->getRepository(Season::class)->findOneForAdmin($value);

            case 'Room':
                return $this->em->getRepository(Room::class)->findOneForAdmin($value);

            case 'EventCategory':
                return $this->em->getRepository(EventCategory::class)->findOneForAdmin($value);

            case 'MediaCategory':
                return $this->em->getRepository(MediaCategory::class)->findOneForAdmin($value);

            case 'string':
            default:
                return $value;
        }
    }

    public function changeEnvFileVariable(string $variableName, string $newValue): void
    {
        $projectDir = $this->sf->get('pathGetter')->getProjectDir();
        $fileName = null;

        foreach (self::ENV_FILES_NAME as $envFileName) {
            if (file_exists($projectDir . '/' . $envFileName)) {
                $fileName = $projectDir . '/' . $envFileName;
                break;
            }
        }

        if (null === $fileName) {
            throw new ApiException(
                Response::HTTP_INTERNAL_SERVER_ERROR,
                1500,
                "Aucun fichier d'environnement n'a été trouvé."
            );
        }

        $fileManipulator = $this->sf->get('file');
        $content = $fileManipulator->getContent($fileName);
        $newContent = "";

        $position = $fileManipulator->getPosition($fileName, $variableName) + strlen($variableName);
        $newContent = substr($content, 0, $position) . $newValue;

        $content = substr($content, $position);
        $position = strpos($content, PHP_EOL);

        if ($position !== false) {
            $newContent .= substr($content, $position);
        }

        $fileManipulator->setContent($fileName, $newContent);
    }

    public function createRobotFile($host): void
    {
        $content = $this->twig->render($this->mf->get('theme')->getWebsiteTemplatesPath() . 'Seo/robot.html.twig', [
            'host' => $host,
        ]);

        $this->sf->get('file')->createFile($this->sf->get('pathGetter')->getPublicDir() . "/robot.txt", $content);
    }

    public function createSitemapFile($host): void
    {
        $events = $this->em->getRepository(Event::class)->findAllForSitemap();
        $pages = $this->em->getRepository(Page::class)->findAllForSitemap();
        $medias = $this->em->getRepository(Media::class)->findAllForSitemap();

        $content = $this->twig->render($this->mf->get('theme')->getWebsiteTemplatesPath() . 'Seo/sitemap.html.twig', [
            'host'   => $host,
            'events' => $events,
            'pages'  => $pages,
            'medias' => $medias
        ]);

        $this->sf->get('file')->createFile($this->sf->get('pathGetter')->getPublicDir() . "/sitemap.xml", $content);
    }

    public function getChangedParameters($vObject, $oldParams, $params): array
    {
        $editedParameters = [];

        foreach ($params as $key => $param) {
            if ($oldParams[$key] !== $param) {
                $editedParam = $this->searchParamByKey($vObject, $key);

                if (null !== $editedParam) {
                    $editedParameters[] = $editedParam;
                }
            }
        }

        return $editedParameters;
    }

    public function handleEditedValue($newParameters, $editedParameter) {
        if ($editedParameter->getType() === 'font' && null !== $editedParameter->getParamValue()) {
            $this->handleFont($editedParameter);
        }
    }

    private function searchParamByKey ($params, $key): ?Parameter
    {
        foreach ($params as $param) {
            if ($param->getParamKey() === $key) {
                return $param;
            }
        }

        return null;
    }

    private function handleFont($editedParameter): void {
        $fileName = explode('.', $editedParameter->getParamValue())[0];
        $fontFilePath = $this->sf->get('pathGetter')->getPublicDir() . "/uploads/parameter/" . $editedParameter->getParamValue();
        $destFileFolder = $this->sf->get('pathGetter')->getPublicDir() . "/uploads/parameter/" . $fileName . '/';

        $font = Font::load($fontFilePath);

        // $font->parse();
        // $font->setSubset("abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ.:,;' (!?)+-*/== 1234567890"); // characters to include
        // $font->reduce();

        // if (!is_dir($destFileFolder)) {
        //     mkdir($destFileFolder, 0777, true);
        // }
        // touch($destFileFolder . 'fontfile.subset.ttf');

        // $font->open($destFileFolder . 'fontfile.subset.ttf', BinaryStream::modeReadWrite);
        // $font->encode(array("OS/2"));
        // $font->close();

        //dd($fileName, $fontFilePath, $font);
    }
}
