<script type="text/javascript" src="/install/js/user.js"></script>

<h2>Création de l'utilisateur admin</h2>

<div class="field">
    <label for="infosFirstname">Prénom</label>
    <div class="contentinput">
        <input class="text required" type="text" id="infosFirstname" name="admin_firstname" value="<?php echo htmlspecialchars($this->session->admin_firstname ?? ''); ?>" />
        <sup class="required">*</sup>
    </div>
    <?php echo $this->displayError('admin_firstname'); ?>
</div>

<div class="field">
    <label for="infosName">Nom</label>
    <div class="contentinput">
        <input class="text required" type="text" id="infosName" name="admin_lastname" value="<?php echo htmlspecialchars($this->session->admin_lastname ?? ''); ?>" />
        <sup class="required">*</sup>
    </div>
    <?php echo $this->displayError('admin_lastname'); ?>
</div>

<div class="field">
    <label for="infosEmail">Adresse e-mail</label>
    <div class="contentinput">
        <input type="email" class="text required" id="infosEmail" name="admin_email" value="<?php echo htmlspecialchars($this->session->admin_email ?? ''); ?>" />
        <sup class="required">*</sup>
    </div>
    <?php echo $this->displayError('admin_email'); ?>
</div>

<div class="field field-password">
    <label for="infosPassword">Mot de passe</label>
    <div class="contentinput">
        <input autocomplete="off" type="password" data-minlength="8" data-maxlength="72" data-minscore="3" class="text required" id="infosPassword" name="admin_password" value="<?php echo htmlspecialchars($this->session->admin_password ?? ''); ?>" />
        <sup class="required">*</sup>
    </div>
    <?php echo $this->displayError('admin_password'); ?>
    <p class="userInfos">Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caratère spécial. (10 caractères minimum)</p>
    <div class="block errorBlock" style="margin-top: 10px;" hidden>
        <div class="block-header">
            <span class="material-icons">error_outline</span>
            <h3>Mot de passe invalide</h3>
        </div>
        <ul>
            <li class="errorPassword" id="pwLength">Le mot de passe doit contenir au moins 10 caractères.</li>
            <li class="errorPassword" id="pwUpper">Le mot de passe doit contenir au moins une majuscule.</li>
            <li class="errorPassword" id="pwLower">Le mot de passe doit contenir au moins une minuscule.</li>
            <li class="errorPassword" id="pwNumber">Le mot de passe doit contenir au moins un chiffre.</li>
            <li class="errorPassword" id="pwSpecial">Le mot de passe doit contenir au moins un caractère spécial.</li>
        </ul>
    </div>
</div>

<div class="field">
    <label for="infosPasswordRepeat">Confirmer le mot de passe</label>
    <div class="contentinput">
        <input type="password" autocomplete="off" class="text required" id="infosPasswordRepeat" name="admin_password_confirm" value="<?php echo htmlspecialchars($this->session->admin_password_confirm ?? ''); ?>" />
        <sup class="required">*</sup>
    </div>
    <?php echo $this->displayError('admin_password_confirm'); ?>
</div>

<div class="field">
    <label for="infosStructure">Type de strucure</label>
    <div class="contentinput">
        <select class="required" id="infosStructure" name="admin_structure">
            <option value="">--Choisissez une option--</option>
            <option value="0">Théatre</option>
            <option value="1">Musée</option>
            <option value="2">Cinéma</option>
            <option value="3">Festival</option>
            <option value="4">Salle de concert</option>
            <option value="5">Parc d'attraction</option>
        </select>
        <sup class="required">*</sup>
    </div>
    <?php echo $this->displayError('admin_structure'); ?>
</div>
