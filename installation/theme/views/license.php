<h2 id="licenses-agreement">Licence</h2>

<div id="license-content">
    <?php echo $this->getTemplate('license_content'); ?>
</div>

<div>
    <input type="checkbox" id="set_license" class="required" name="licence_agrement" value="1" style="vertical-align: middle;float:left" <?php if ($this->session->licence_agrement) { ?>checked="checked" <?php } ?> />
    <div id="set_license_label">
        <label for="set_license">
            <strong>J'accepte les termes et conditions d'utilisation.</strong>
        </label>
    </div>
</div>
