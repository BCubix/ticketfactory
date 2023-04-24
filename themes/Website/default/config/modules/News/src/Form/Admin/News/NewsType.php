<?php

namespace TicketFactory\Module\News\Form\Admin\News;

use App\Entity\Media\Media;
use App\Repository\MediaRepository;
use TicketFactory\Module\News\Entity\News\News;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class NewsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('active',               CheckboxType::class,        ['false_values' => ['0']])
            ->add('homeDisplayed',        CheckboxType::class,        ['false_values' => ['0']])
            ->add('title',                TextType::class,            [])
            ->add('subtitle',             TextType::class,            [])
            ->add('description',          TextareaType::class,        [])
            ->add('mainMedia',            EntityType::class,          [
                'class'         => Media::class,
                'choice_label'  => 'media',
                'multiple'      => false,
                'query_builder' => function (MediaRepository $mr) {
                    return $mr
                        ->createQueryBuilder('m')
                        ->orderBy('m.title', 'ASC')
                    ;
                }
            ])
            ->add('newsBlocks',           CollectionType::class,      [
                'entry_type'   => NewsBlockType::class,
                'allow_add'    => true,
                'allow_delete' => true,
                'delete_empty' => true,
                'by_reference' => false
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => News::class,
        ]);
    }
}
