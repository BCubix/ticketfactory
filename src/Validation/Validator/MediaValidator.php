<?php

namespace App\Validation\Validator;

use App\Entity\Event\Media;
use App\Validation\Constraint\MediaConstraint;
use App\Utils\MimeTypeMapping;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

#[\Attribute]
class MediaValidator extends ConstraintValidator
{
    public function validate(mixed $object, Constraint $constraint): void
    {
        if (!$object instanceof Media) {
            throw new UnexpectedValueException($receipt, Media::class);
        }

        if (!$constraint instanceof MediaConstraint) {
            throw new UnexpectedTypeException($constraint, MediaConstraint::class);
        }

        if (empty($value)) {
            return;
        }

        if ($object->getSize() > $this->getMaxSize()) {
            $this->context
                ->buildViolation($constraint->sizeMessage)
                ->atPath('documentType')
                ->addViolation()
            ;
        }

        if (!in_array($object->getMimeType(), MimeTypeMapping::getAllMimes())) {
            $this->context
                ->buildViolation($constraint->mimeMessage)
                ->atPath('documentType')
                ->addViolation()
            ;
        }

        $errorMessage = $this->getErrorMessage($object->getError());
        if (null !== $errorMessage) {
            $this->context
                ->buildViolation($errorMessage)
                ->atPath('documentType')
                ->addViolation()
            ;
        }
    }

    // Returns a file size limit in bytes based on the PHP upload_max_filesize and post_max_size
    private function getMaxSize() {
        $maxSize = -1;

        // Start with post_max_size.
        $postMaxSize = $this->parseSize(ini_get('post_max_size'));
        if ($postMaxSize > 0) {
            $maxSize = $postMaxSize;
        }

        // If upload_max_size is less, then reduce. Except if upload_max_size is
        // zero, which indicates no limit.
        $uploadMax = $this->parseSize(ini_get('upload_max_filesize'));
        if ($uploadMax > 0 && $uploadMax < $maxSize) {
            $maxSize = $uploadMax;
        }

        return $maxSize;
    }

    private function parseSize($size) {
        $unit = preg_replace('/[^bkmgtpezy]/i', '', $size); // Remove the non-unit characters from the size.
        $size = preg_replace('/[^0-9\.]/', '', $size); // Remove the non-numeric characters from the size.

        if ($unit) {
            return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
        } else {
            return round($size);
        }
    }

    private function getErrorMessage($error) {
        if (\UPLOAD_ERR_OK === $error) {
            return null;
        }

        $errors = [
            \UPLOAD_ERR_INI_SIZE => $constraint->sizeMessage,
            \UPLOAD_ERR_FORM_SIZE => 'Le fichier d??passe la limite d\'upload renseign??e dans le formulaire.',
            \UPLOAD_ERR_PARTIAL => 'Le fichier n\'a ??t?? upload?? que partiellement.',
            \UPLOAD_ERR_NO_FILE => 'Aucun fichier n\'a ??t?? upload??.',
            \UPLOAD_ERR_CANT_WRITE => 'Le fichier ne peut pas ??tre enregistr?? sur le disque.',
            \UPLOAD_ERR_NO_TMP_DIR => 'Le fichier ne peut ??tre upload?? : le r??pertoire temporaire n\'existe pas.',
            \UPLOAD_ERR_EXTENSION => 'Une extension PHP a stopp?? l\'upload du fichier.',
        ];

        if (isset($errors[$error])) {
            return $errors[$error];
        }

        return 'Le fichier n\'a pu ??tre upload?? ?? cause d\'une erreur inconnue.';
    }
}
