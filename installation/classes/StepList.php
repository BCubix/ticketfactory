<?php

namespace TicketFactory\Installer\Classes\StepList;

use TicketFactory\Installer\Classes\Step\Step;

class StepList implements \IteratorAggregate
{
    protected int $offset = 0;
    protected array $steps = [];

    private array $stepNames = [];

    public function __construct(array $stepConfig)
    {
        foreach ($stepConfig as $key => $config) {
            $this->stepNames[$key] = $config['name'];
            $this->steps[$key] = new Step();
            $this->steps[$key]->setName($config['name']);
            $this->steps[$key]->setDisplayName($config['displayName']);
            $this->steps[$key]->setControllerName($config['controllerName']);
        }
    }

    public function getOffset(): int
    {
        return $this->offset;
    }

    public function setOffset(int $offset): self
    {
        $this->offset = $offset;

        return $this;
    }

    public function setOffsetFromStepName(string $stepName): self
    {
        $this->offset = (int) array_search($stepName, $this->stepNames);

        return $this;
    }

    public function getOffsetFromStepName(string $stepName): int
    {
        return (int) array_search($stepName, $this->stepNames);
    }

    public function getSteps(): array
    {
        return $this->steps;
    }

    public function current(): Step
    {
        return $this->steps[$this->offset];
    }

    public function next(): self
    {
        if (array_key_exists($this->offset + 1, $this->steps)) {
            ++$this->offset;
        }

        return $this;
    }

    public function previous(): self
    {
        if (array_key_exists($this->offset - 1, $this->steps)) {
            --$this->offset;
        }

        return $this;
    }

    public function isFirstStep(): bool
    {
        return 0 == $this->offset;
    }

    public function isLastStep(): bool
    {
        return $this->offset == count($this->steps) - 1;
    }

    public function getIterator(): \Traversable
    {
        return new \ArrayIterator($this->steps);
    }
}
