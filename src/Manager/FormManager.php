<?php

namespace App\Manager;

use Symfony\Component\Form\FormEvent;

class FormManager extends AbstractManager
{
    public const SERVICE_NAME = 'form';

    public function onPreSetData(FormEvent $event): void
    {
        if (!$event->getForm()->getConfig()->hasOption('data_class')) {
            return;
        }

        $entityClass = $event->getForm()->getConfig()->getOption('data_class');
        if (null === $entityClass) {
            return;
        }

        $path = explode('\\', $entityClass ?? "");
        $entityClassName = array_pop($path);
        $this->mf->get('hook')->exec('action' . $entityClassName . 'FormPreSetData', [
            'formEvent' => $event,
        ]);
    }
}
