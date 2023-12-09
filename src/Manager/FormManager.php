<?php

namespace App\Manager;

use Symfony\Component\Form\FormEvent;

class FormManager extends AbstractManager
{
    public const SERVICE_NAME = 'form';

    public function onPreSetData(FormEvent $event, ?string $data_class = null): void
    {
        if (!$event->getForm()->getConfig()->hasOption('data_class') && null === $data_class) {
            return;
        }

        $entityClass = $data_class ?? $event->getForm()->getConfig()->getOption('data_class');
        if (null === $entityClass) {
            return;
        }

        if (null === $data_class) {
            $path = explode('\\', $entityClass ?? "");
            $entityClassName = array_pop($path);
        } else {
            $entityClassName = $data_class;
        }

        $this->mf->get('hook')->exec('action' . $entityClassName . 'FormPreSetData', [
            'formEvent' => $event,
        ]);
    }
}
