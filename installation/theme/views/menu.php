<div id="leftpannel">
  <h2 id="title">Etapes d'installation</h2>

  <ol id="tabs">
    <?php foreach (self::getSteps() as $step) : ?>
      <?php
      $stepIndex = self::getSteps()->getOffsetFromStepName($step->getName()) + 1;
      if (1 === $stepIndex) {
        $stepIndex = 'one';
      } elseif (2 === $stepIndex) {
        $stepIndex = 'two';
      }
      ?>
      <?php if ($this->isStepFinished($step->getName())) : ?>
        <a href="index.php?step=<?php echo $step->getName(); ?>">
          <li class="finished">
            <span class="icon material-icons"><?php echo 'looks_' . $stepIndex; ?></span>
            <div class="stepName"><?php echo $step; ?></div>
          </li>
        </a>
      <?php else : ?>
        <li <?php if (self::getSteps()->current()->getName() == $step->getName()) { ?> class="selected" <?php } ?>>
          <span class="icon material-icons"><?php echo 'looks_' . $stepIndex; ?></span>
          <div class="stepName"><?php echo $step; ?></div>
        </li>
      <?php endif; ?>
    <?php endforeach; ?>
  </ol>
</div>
