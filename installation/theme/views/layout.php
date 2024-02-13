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
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
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
                <div class="contentTitle">
                    <h1>Installation de TicketFactory</h1>
                </div>
                <div id="sheets" class="sheet shown">
                    <div id="sheet_<?php echo self::getSteps()->current()->getName(); ?>" class="sheet">

                        <div>
                            <?php echo $this->getContent(); ?>
                        </div>
                    </div>
                </div>

                <div id="buttons">
                    <?php if (!$this->isLastStep()) { ?>
                        <input id="btNext" class="button" type="submit" name="submitNext" value="Suivant" <?php if (!$this->nextButton) { ?> disabled="disabled" <?php } ?> />
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
