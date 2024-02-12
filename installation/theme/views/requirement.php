<h2>Prérequis système</h2>

<p>Nous vérifions la compatibilité de votre environnement système.</p>

<p><input class="button" value="Vérifier la compatibilité" type="submit" id="req_bt_refresh" /></p>

<?php if ($this->tests['success']) { ?>
    <h3 class="okBlock">
        Votre système est compatible.
    </h3>
<?php } else { ?>
    <div class="errorBlock">
        <h3>
            Veuillez corriger les éléments suivants, et testez la compatibilité de votre système à nouveau.
        </h3>

        <ul>
            <?php $i = 0; ?>
            <?php foreach ($this->testsRender as $id => $msg) : ?>
                <li class="required <?php if ($i == 0) : ?>first<?php endif; ?> <?php echo isset($this->tests['checks'][$id]) ? $this->tests['checks'][$id] : 'fail'; ?>">
                    <?php echo $msg; ?>
                </li>
                <?php ++$i; ?>
            <?php endforeach; ?>
        </ul>
    </div>
<?php } ?>
