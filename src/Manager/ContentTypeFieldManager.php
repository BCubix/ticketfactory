<?php

namespace App\Manager;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Yaml\Yaml;

class ContentTypeFieldManager extends AbstractManager
{
    const FIELDS_FILE     = '/src/Data/ContentTypeFields.yaml';
    const OPTIONS_FILE    = '/src/Data/ContentTypeOptions.yaml';
    const VALIDATIONS_FILE = '/src/Data/ContentTypeValidations.yaml';

    private $projectDir;
    private $data;

    public function __construct(EntityManagerInterface $em, string $projectDir)
    {
        parent::__construct($em);

        $this->projectDir = $projectDir;
        $this->loadData();
    }

    public function getAllFields() {
        return $this->data;
    }

    public function getFieldsSelect() {
        $list = [];

        foreach ($this->data as $key => $field) {
            $list[$key] = $field['label'];
        }

        return $list;
    }

    public function getFieldParams(string $fieldName) {
        if (!isset($this->data[$fieldName])) {
            return null;
        }

        return $this->data[$fieldName];
    }

    private function loadData(): void
    {
        $fields = Yaml::parseFile($this->projectDir . self::FIELDS_FILE);
        $options = Yaml::parseFile($this->projectDir . self::OPTIONS_FILE);
        $validations = Yaml::parseFile($this->projectDir . self::VALIDATIONS_FILE);

        $fields = $fields['fields'];
        $options = $options['options'];
        $validations = $validations['validations'];

        $this->data = [];

        foreach ($fields as $name => $field) {
            $this->data[$name] = $field;

            $currOptions = $field['options'];
            $currOptions = explode(',', $currOptions);

            $realOptions = [];
            foreach ($currOptions as $currOption) {
                if (!empty($currOption)) {
                    $realOptions[$currOption] = $options[$currOption];
                }
            }
            $this->data[$name]['options'] = $realOptions;

            $currValidations = $field['validations'];
            $currValidations = explode(',', $currValidations);

            $realValidations = [];
            foreach ($currValidations as $currValidation) {
                if (!empty($currValidation)) {
                    $realValidations[$currValidation] = $validations[$currValidation];
                }
            }
            $this->data[$name]['validations'] = $realValidations;
        }
    }
}
