<?php

namespace App\Form\Admin\Feature;

use App\Entity\Feature\Feature;
use App\Entity\Feature\FeatureLink;
use App\Repository\FeatureRepository;
use App\Repository\FeatureValueRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FeatureLinkType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('feature',                     EntityType::class,          [
                'class'         => Feature::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (FeatureRepository $fr) {
                    return $fr
                        ->createQueryBuilder('f')
                        ->where('f.active = 1')
                        ->orderBy('f.name', 'ASC');
                }
            ])
            ->add('featureValueRaw',             TextType::class,            []);

        $builder->addEventListener(
            FormEvents::PRE_SUBMIT,
            [$this, 'onPreSubmit']
        );
    }

    public function onPreSubmit(FormEvent $event): void
    {
        $object = $event->getData();
        $form = $event->getForm();

        $id = 0;
        if (!empty($object['feature'])) {
            $id = $object['feature'];
        }

        $form
            ->add('featureValue',             EntityType::class,          [
                'class'         => FeatureValue::class,
                'choice_label'  => 'name',
                'multiple'      => false,
                'query_builder' => function (FeatureValueRepository $fvr) use ($id) {
                    return $fvr
                        ->createQueryBuilder('fv')
                        ->innerJoin('fv.feature', 'f')
                        ->where('f.active = 1')
                        ->andWhere('f.id = :id')
                        ->orderBy('f.name', 'ASC')
                        ->setParameter('id', $id);
                }
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => FeatureLink::class,
        ]);
    }
}
