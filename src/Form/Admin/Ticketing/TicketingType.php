<?php

namespace App\Form\Admin\Ticketing;

use App\Entity\Addon\Module;
use App\Entity\Ticketing\Ticketing;
use App\Form\Admin\AdminBaseFormType;
use App\Manager\FormManager;
use App\Repository\ModuleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TicketingType extends AdminBaseFormType
{
    protected $em;

    public function __construct(FormManager $fm, EntityManagerInterface $em)
    {
        parent::__construct($fm);

        $this->em = $em;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',                                CheckboxType::class,          ['false_values' => ['0', 'null', 'false']])
            ->add('name',                                  TextType::class,              [])
            ->add('catalogSynchronization',                CheckboxType::class,          ['false_values' => ['0', 'null', 'false']])
            ->add('customerProfile',                       CheckboxType::class,          ['false_values' => ['0', 'null', 'false']])
            ->add('orderTunnel',                           CheckboxType::class,          ['false_values' => ['0', 'null', 'false']])
            ->add('defaultTicketing',                      CheckboxType::class,          ['false_values' => ['0', 'null', 'false']])
            ->add('type',                                  ChoiceType::class,            [
                'choices'  => array_flip(Ticketing::TYPE_MAPPING)
            ])
            ->add('module',                                EntityType::class,            [
                'class'         => Module::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (ModuleRepository $m) {
                    return $m
                        ->createQueryBuilder('m')
                        ->orderBy('m.name', 'ASC');
                }
            ]);

        $builder->addEventListener(FormEvents::PRE_SUBMIT, [$this, 'onPreSubmit']);
    }

    public function onPreSubmit(FormEvent $event): void
    {
        $data = $event->getData();

        if (isset($data["module"]) && $data['module'] !== "") {
            $module = $this->em->getRepository(Module::class)->findOneForAdmin(intval($data['module']));
            $className = null !== $module ? "TicketFactory\Module\\" . $module->getName() . "\Form\Admin\Ticketing\TicketingDataType" : null;

            if (null !== $module && class_exists($className)) {
                $event->getForm()->add('data', $className,  []);
            }
        } else {
            $event->getForm()->add('data', TicketingDataType::class,  []);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Ticketing::class,
            'csrf_protection' => false
        ]);
    }
}
