<h2>Prérequis système</h2>

<p>Nous vérifions la compatibilité de votre environnement système.</p>

<?php if ($this->tests['success']) { ?>
    <div class="block okBlock">
        <div class="block-header">
            <span class="material-icons">task_alt</span>
            <h3>Votre système est compatible.</h3>
        </div>
    </div>
<?php } else { ?>
    <div class="block errorBlock">
        <div class="block-header">
            <span class="material-icons">error_outline</span>
            <h3>
                Veuillez corriger les éléments suivants, et testez la compatibilité de votre système à nouveau.
            </h3>
        </div>

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

<input class="button" value="Vérifier la compatibilité" type="submit" id="btRefreshRequirement" />
