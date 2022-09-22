<?php

namespace App\Manager;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Validator\Constraints as Assert;

class ContentTypeManager extends AbstractManager
{
    private const TYPE_FILES_PATH = '/src/Form/Admin/ContentType/Types/*.php';
    private const NAMESPACE_PATH = '\App\Form\Admin\ContentType\Types\\';

    private $projectDir;
    private $types;

    public function __construct(EntityManagerInterface $em, string $projectDir)
    {
        parent::__construct($em);

        $this->projectDir = $projectDir;
        $this->types = $this->loadTypes();
    }

    public function getFieldsSelect() {
        return $this->types;
    }

    public function getFieldParams(string $fieldName) {
        if (!isset($this->data[$fieldName])) {
            return null;
        }

        return $this->data[$fieldName];
    }

    private function loadTypes() {
        $types = [];
        $files = glob($this->projectDir . self::TYPE_FILES_PATH);

        foreach ($files as $file) {
            $className = explode('/', $file);
            $className = $className[count($className) - 1];

            $className = explode('.', $className);
            $className = $className[0];

            $className = (self::NAMESPACE_PATH . $className);
            $typeName = $className::FIELD_NAME;

            $types[$typeName] = $className;
        }

        return $types;
    }
}
