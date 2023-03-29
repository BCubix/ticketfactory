<?php

namespace App\Manager;

use App\Entity\Content\ContentType;
use App\Entity\Content\ContentTypeField;
use App\Exception\ApiException;
use App\Service\File\PathGetter;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Validator\Constraints as Assert;

class ContentTypeManager extends AbstractManager
{
    private const TYPE_FILES_PATH = 'src/Form/Admin/Content/Types/*.php';
    private const NAMESPACE_PATH = '\App\Form\Admin\Content\Types\\';

    protected $ff;
    protected $pg;
    protected $types;

    public function __construct(
        ManagerFactory $mf,
        EntityManagerInterface $em,
        RequestStack $rs,
        FormFactoryInterface $ff,
        PathGetter $pg
    ) {
        parent::__construct($mf, $em, $rs);

        $this->ff = $ff;
        $this->pg = $pg;
        $this->types = $this->loadTypes();
    }

    public function getFieldsSelect() {
        return $this->types;
    }

    public function getContentTypeFromId(int $contentTypeId) {
        $contentType = $this->em->getRepository(ContentType::class)->findOneForAdmin($contentTypeId);
        if (null === $contentType) {
            throw new ApiException(Response::HTTP_NOT_FOUND, 1404, 'Ce type de contenu n\'existe pas.');
        }

        return $contentType;
    }

    public function getContentTypeFieldFromType(string $contentType) {
        if (isset($this->types[$contentType])) {
            $contentTypeField = $this->types[$contentType];
            $contentTypeField = ltrim($contentTypeField, $contentTypeField[0]);

            return $contentTypeField;
        }

        throw new ApiException(
            Response::HTTP_INTERNAL_SERVER_ERROR,
            1500,
            "Le composant rattaché au type de contenu " . $contentType . " n'a pas été trouvé."
        );
    }

    public function getContentTypeInstanceFromType(string $contentType) {
        $contentTypeField = $this->getContentTypeFieldFromType($contentType);

        $form = $this->ff->create($contentTypeField);
        $type = $form->getConfig()->getType()->getInnerType();
        
        return $type;
    }

    public function getOptionsFromField(ContentTypeField $contentTypeField) {
        $component = $this->getContentTypeFieldFromType($contentTypeField->getType());
        $explicitOptions = $component::getOptions();

        $form = $this->ff->create($component);
        $implicitOptions = $form->getconfig()->getOptions();

        $filledOptions = [];
        foreach ($contentTypeField->getOptions() as $option) {
            // We only pass options that are defined
            if (
                !isset($implicitOptions[$option->getName()]) ||
                !isset($explicitOptions[$option->getName()])
            ) {
                continue;
            }

            // We convert the value in the desired format
            $format = $explicitOptions[$option->getName()]['type'];
            $value = $option->getValue();

            switch ($format) {
                case "array":
                    $value = [$value];
                    break;

                case "boolean":
                    $value = ($value === 'true');
                    break;

                default:
                    $value = settype($value, $format);
                    break;
            }

            // We fill the option's value
            $filledOptions[$option->getName()] = $value;
        }

        return $filledOptions;
    }

    public function getParametersFromField(ContentTypeField $contentTypeField) {
        $component = $this->getContentTypeFieldFromType($contentTypeField->getType());
        $expectedParameters = $component::getParameters();

        $parameters = [];
        foreach ($contentTypeField->getParameters() as $parameter) {
            // We only pass parameters that are defined
            if (!in_array($parameter->getName(), $expectedParameters)) {
                continue;
            }

            $parameters[] = $parameter;
        }

        return $parameters;
    }

    private function loadTypes() {
        $types = [];
        $files = glob($this->pg->getProjectDir() . self::TYPE_FILES_PATH);

        foreach ($files as $file) {
            $className = explode('/', $file);
            $className = $className[count($className) - 1];

            $className = explode('.', $className);
            $className = $className[0];

            $className = (self::NAMESPACE_PATH . $className);

            if (defined( "$className::FIELD_NAME" )) {
                $typeName = $className::FIELD_NAME;
                $types[$typeName] = $className;
            }
        }

        return $types;
    }
}
