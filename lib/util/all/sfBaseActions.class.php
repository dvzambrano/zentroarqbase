<?php

/**
 * category actions.
 *
 * @package    SGArqBase
 * @subpackage sfBaseActions
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class sfBaseActions extends sfActions {

    /**
     * Executes index action
     *
     * @param sfRequest $request A request object
     */
    public function executeIndex(sfWebRequest $request) {
        try {
            $this->title = Util::getMetadataValue('app_name');
//            $this->title = htmlspecialchars_decode(Util::getMetadataValue('app_name'));
        } catch (Exception $exc) {
            $uri = $request->getUri();
            $install = 'install.php';

            $array = explode('/', $uri);
            if ($array[count($array) - 1] != '')
                $install = '/install.php';

            header("Location: " . $uri . $install);
        }
    }

    public function executeRequest(sfWebRequest $request) {
        Util::setExecutionEnviroment();
        $response = array();
        try {
            switch ($request->getParameter('method')) {
                case 'save':
                    $data = $this->save($request);
                    $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful', 'data' => $data);
                    break;
                case 'load':
                    $response = $this->load($request);
                    break;
                case 'delete':
                    $response = $this->delete($request);
                    $response = array('success' => true, 'message' => 'app.msg.info.deletedsuccessful');
                    break;
                default:
                    $response['success'] = true;
                    $response['message'] = array();
                    $response['mac'] = sfSecurity::getServerUniqueINFO() . '-' . sfSecurity::getSystemInstallDate('admin');

                    if (extension_loaded('openssl')) {
                        $result = sfSecurity::validateRegistrationCode(sfConfig::get('app_sg_arq_base_register_code'));
                        if (!$result['success']) {
                            $response['success'] = false;
                            $response['message'][] = array('code' => 'regcode', 'data' => sfConfig::get('app_sg_arq_base_register_code'));
                        }
                        
                        $array = sfSecurity::validateRegistrationHash(sfConfig::get('app_sg_arq_base_register_code'));
                        if (!$array["success"]) {
                            $response['success'] = false;
                            
                            $validation = sfSecurity::validateRegistrationCode(sfConfig::get('app_sg_arq_base_register_code'));
                            
                            $response['message'][] = array('code' => $array["code"], 'data' => $validation['expirationdate']);
                        }
                        
                        if (!$response['success']) {
                            // checking remining period
                            $remfile = Util::getRootPath('/apps/backend/config/rem.yml', true);
                            $remining = php_strip_whitespace($remfile);
                            if (!$remining || $remining == "") {
                                $code = sfSecurity::encrypt(date('Y-m-d H:i:s'), Util::generateCode(Util::getMetadataValue("app_name")));
                                file_put_contents($remfile, $code);
                            }
                        }

                        if (!sfSecurity::validateCheckSum()) {
                            $response['success'] = false;
                            $response['message'][] = array('code' => 'checksum', 'data' => '');
                        }
                    } else {
                        $response['success'] = false;
                        $response['message'][] = array('code' => 'extension', 'data' => 'openssl');
                    }



                    break;
            }
        } catch (Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }
        return $this->renderText(json_encode($response));
    }

    public function getFilter(sfWebRequest $request, $mandatoryentityid = false) {
        $filter = $request->getParameter('filter');
        if ($request->getParameter('customfilter') && $request->getParameter('customfilter') != '')
            $filter = $request->getParameter('customfilter');
        $filter = json_decode(stripslashes($filter));

        if ($mandatoryentityid) {
            $obj = new stdClass();
            $obj->type = "int";
            $obj->field = "entityid";
            if ($request->getParameter('entityid') && $request->getParameter('entityid') != '') {
                $obj->comparison = "eq";
                $obj->value = $request->getParameter('entityid');
            }
            else
                $obj->comparison = "null";

            $filter[] = $obj;
        }
        else {
            if ($request->getParameter('entityid') && $request->getParameter('entityid') != '') {
                $obj = new stdClass();
                $obj->type = "int";
                $obj->field = "entityid";
                $obj->comparison = "eq";
                $obj->value = $request->getParameter('entityid');
                $filter[] = $obj;
            }
        }

        if ($request->getParameter('distinct') && $request->getParameter('distinct') != '') {
            $distinct = json_decode($request->getParameter('distinct'));
            for ($i = 0; $i < count($distinct); $i++)
                if ($distinct[$i]->id && $distinct[$i]->id != "") {
                    $obj = new stdClass();
                    $obj->type = "int";
                    $obj->field = "id";
                    $obj->comparison = "dt";
                    $obj->value = $distinct[$i]->id;
                    $filter[] = $obj;
                }
        }

        if ($request->getParameter('query') && $request->getParameter('query') != '') {
            $obj = new stdClass();
            $obj->type = "string";
            $obj->field = "name";
            $obj->value = $request->getParameter('query');
            $filter[] = $obj;
        }

        return $filter;
    }

}
