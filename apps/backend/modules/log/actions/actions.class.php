<?php

/**
 * log actions.
 *
 * @package    SGARQBASE
 * @subpackage log
 * @author     MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 23810 2009-11-12 11:07:44Z Kris.Wallsmith $
 */
class logActions extends sfBaseActions {

    /**
     * Executes index action
     *
     * @param sfRequest $request A request object
     */
    public function executeIndex(sfWebRequest $request) {
        
    }

    public function executeRequest(sfWebRequest $request) {
        Util::setExecutionEnviroment();
        $response = array();
        $rows = array();

        try {
            $logfile = sfConfig::get('sf_log_dir') . '/' . $request->getParameter('file');

            if (is_file($logfile)) {
                $lines = file($logfile);

                foreach ($lines as $key => $line) {
                    $date = substr($line, 0, stripos($line, ' symfony'));

                    $obj = substr($line, 0, strripos($line, '}') + 1);
                    $obj = substr($obj, stripos($line, '{'));

                    $action = substr($line, 0, strripos($line, $obj));
                    $action = substr($action, stripos($line, '[alert] ') + 8);

                    $objdecoded = json_decode($obj);
                    if ($objdecoded->name)
                        $action = $action . ' ' . strtoupper($objdecoded->name);
                    else
                        $action = $action . ' ' . strtoupper($objdecoded->code);

                    $user = substr($line, 0, strripos($line, '".'));
                    $user = substr($user, strripos($line, 'usuario ') + 9);

                    if ($user)
                        $rows[] = array('id' => $date, 'action' => $action, 'user' => $user, 'obj' => $obj);
                }
                $rows = array_reverse($rows);
            }

            $rows = array(
                'metaData' => array(
                    'idProperty' => 'id',
                    'root' => 'data',
                    'totalProperty' => 'results',
                    'fields' => array(
                        array('name' => 'id', 'type' => 'string'),
                        array('name' => 'action', 'type' => 'string'),
                        array('name' => 'expirationdate', 'type' => 'date'),
                        array('name' => 'user', 'type' => 'string'),
                        array('name' => 'obj')
                    ),
                    'sortInfo' => array(
                        'field' => 'id',
                        'direction' => 'ASC'
                    )
                ),
                'success' => true,
                'message' => 'app.msg.info.loadedsuccessful',
                'results' => count($lines),
                'data' => $rows,
                'page' => 1
            );

            $response = $rows;
        } catch (Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return $this->renderText(json_encode($response));
    }

}
