<h2>Configuration de la base de données</h2>

<p>
    Pour procéder à l'installation de TicketFactory, vous devez créer une base de données avant de compléter cette étape.
    <br />
    Veuillez compléter les champs ci-dessous afin de permettre à TicketFactory de se connecter à votre base de données.
</p>

<div id="formCheckSQL">
    <div class="field">
        <label for="dbServer">Adresse de la base</label>
        <div class="contentinput">
            <input size="25" class="text" type="text" id="dbServer" name="dbServer" value="<?php echo htmlspecialchars($this->database_server ?? ''); ?>" />
            <sup class="required">*</sup>
        </div>
        <span class="userInfos">Le port par défaut est 3306. Pour utiliser un port différent, ajoutez le numéro de port à la fin de l'adresse. (ex: ":4242")</span>
        <?php echo $this->displayError('db_server'); ?>
    </div>
    <div class="field">
        <label for="dbName">Nom de la base</label>
        <div class="contentinput">
            <input size="10" class="text" type="text" id="dbName" name="dbName" value="<?php echo htmlspecialchars($this->database_name ?? ''); ?>" />
            <sup class="required">*</sup>
        </div>
        <?php echo $this->displayError('db_name'); ?>
    </div>
    <div class="field">
        <label for="dbLogin">Identifiant</label>
        <div class="contentinput">
            <input class="text" size="10" type="text" id="dbLogin" name="dbLogin" value="<?php echo htmlspecialchars($this->database_login ?? ''); ?>" />
            <sup class="required">*</sup>
        </div>
        <?php echo $this->displayError('db_login'); ?>
    </div>
    <div class="field">
        <label for="dbPassword">Mot de passe</label>
        <div class="contentinput">
            <input class="text" size="10" type="password" id="dbPassword" name="dbPassword" value="<?php echo htmlspecialchars($this->database_password ?? ''); ?>" />
            <sup class="required">*</sup>
        </div>
        <?php echo $this->displayError('db_password'); ?>
    </div>

    <?php if (array_key_exists('db_connection', $this->errors) && $this->errors['db_connection']) : ?>
        <div id="dbResultCheck" class="block errorBlock">
            <div class="block-header">
                <span class="material-icons">error_outline</span>
                <h3>Une erreur est survenu lors de la connection à la base de données</h3>
            </div>
            <p><?php echo implode('<br />', $this->errors['db_connection']); ?></p>
        </div>
    <?php else : ?>
        <div id="dbResultCheck" style="display: none;"></div>
    <?php endif; ?>
</div>
