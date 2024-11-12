<?php

namespace App\Service\File;

use Dompdf\Dompdf;
use Dompdf\Options;

class Pdf
{
    public const SERVICE_NAME = 'pdf';

    public function generatePDFFromHTML(string $html, string $defaultFront = "Arial", string $format = "A4", string $orientation = "portrait"): string
    {
        // Create options for the DomPdf instance.
        $pdfOptions = new Options();
        $pdfOptions->set('defaultFront', $defaultFront);

        // Create DomPdf instance with pdfOptions, format, orientation, and rendered HTML.
        $domPdf = new Dompdf($pdfOptions);
        $domPdf->loadHtml($html);
        $domPdf->setPaper($format, $orientation);
        $domPdf->render();

        // Return the PDF File as a string
        return $domPdf->output();
    }
}
