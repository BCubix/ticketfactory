<script type="text/javascript" src="/install/js/process.js"></script>
<script type="text/javascript">
  var install_is_done = '<?php echo addslashes('Installation terminé !'); ?>';
  var process_steps = <?php echo json_encode($this->process_steps); ?>;
</script>

<h2>Installation</h2>

<div id="install_process_form">
  <div id="progress_bar">
    <div class="installing"></div>

    <div class="total">
      <p>Progression : </p>
      <span>0%</span>
    </div>
  </div>

  <ol class="process_list">
    <?php foreach ($this->process_steps as $item) : ?>
      <li id="process_step_<?php echo $item['key']; ?>" class="process_step">
        <?php echo $item['step']; ?>
      </li>
    <?php endforeach; ?>
  </ol>

  <div id="error_process" class="block errorBlock">
    <div class="block-header">
      <span class="material-icons">error_outline</span>
      <h3>Une erreur a eu lieu durant l'installation...</h3>
    </div>

    <p>Vous pouvez utiliser les liens de la colonne de gauche pour revenir à une étape précédente, ou redémarrer le processus d'installation en <a href="index.php?restart=true">cliquant ici</a>.</p>
  </div>

  <input type="submit" value="Redirection vers TicketFactory" name="endInstall" id="btnEnd" class="button" />
</div>
