<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title>TicketFactory Installation</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="Cache-Control" content="no-cache, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Cache" content="no store" />
    <meta http-equiv="Expires" content="-1" />
    <meta name="robots" content="noindex" />
    <link rel="stylesheet" type="text/css" media="all" href="/install/view.css" />
</head>

<body>
    <div id="container">

        <!-- Header -->
        <div id="header">
            <img id="TicketFactoryLogo" src="images/logos/TicketFactoryRougeHori.svg" alt="TicketFactoryLogo" />
        </div>

        <div id="body-container">
            <?php echo $this->getTemplate('menu'); ?>

            <!-- Page content -->
            <form id="mainForm" action="index.php" method="post">
                <div id="sheets" class="sheet shown">
                    <div id="sheet_<?php echo self::getSteps()->current()->getName(); ?>" class="sheet">
                        <div class="contentTitle">
                            <h1>Outil d'installation</h1>
                        </div>

                        <div>
                            <?php echo $this->getContent(); ?>
                        </div>
                    </div>
                </div>

                <div id="buttons">
                    <?php if (!$this->isLastStep()) { ?>
                        <?php if ($this->nextButton) { ?>
                            <input id="btNext" class="button" type="submit" name="submitNext" value="Suivant" />
                        <?php } else { ?>
                            <input id="btNext" class="button disabled" type="submit" name="submitNext" value="Suivant" disabled="disabled" />
                        <?php } ?>
                    <?php } ?>

                    <?php if (!$this->isFirstStep() && $this->previousButton) { ?>
                        <input id="btBack" class="button" type="submit" name="submitPrevious" value="Précédent" />
                    <?php } ?>
                </div>
            </form>
        </div>

    </div>

</body>

</html>
