<?php

/**
 * print actions.
 *
 * @package    SGARQBASE
 * @subpackage print
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
 
class printActions extends sfBaseActions {

    public function executeIndex(sfWebRequest $request) {
//    $this->forward('default', 'module');
    }
    
    public function executePdf(sfWebRequest $request) {
        // the file parameter should be like "web/uploads/assets/20201216-103102.html"
        $file = Util::getRootPath($request->getParameter('file'), true, true);
        $content = file_get_contents($file);
        
        $orientation = 'P';
        switch($request->getParameter('orientation')){
            case 'l':
            case 'L':
            case 'landscape':
                $orientation = 'L';
                break;
            default:
                break;
        }
            
        $mpdf = new \Mpdf\Mpdf([
            'orientation' => $orientation
        ]);
        
        // Write some HTML code:
        $mpdf->WriteHTML($content);
        
        // Output a PDF file directly to the browser
        $mpdf->Output();
        
        // delete the temporary file
        unlink($file);
    }

}
