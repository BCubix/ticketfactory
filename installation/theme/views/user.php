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
    <p class="userInfos">Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caratère spécial. (10 caractères minimum)</p>
    <?php echo $this->displayError('admin_password'); ?>
</div>

<div class="field">
    <label for="infosPasswordRepeat">Confirmer le mot de passe</label>
    <div class="contentinput">
        <input type="password" autocomplete="off" class="text required" id="infosPasswordRepeat" name="admin_password_confirm" value="<?php echo htmlspecialchars($this->session->admin_password_confirm ?? ''); ?>" />
        <sup class="required">*</sup>
    </div>
    <?php echo $this->displayError('admin_password_confirm'); ?>
</div>
