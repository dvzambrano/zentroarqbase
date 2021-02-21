<?php

/**
 * admin actions.
 *
 * @package    SGARQBASE
 * @subpackage admin
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 23810 2009-11-12 11:07:44Z Kris.Wallsmith $
 */
class adminActions extends sfBaseActions {

    public function executeRequest(sfWebRequest $request) {
        Util::setExecutionEnviroment();
        $response = array();
        try {
            switch ($request->getParameter('method')) {
                // install cases
                case 'systemrequirements':
                    $phpversion = version_compare(phpversion(), '5.2.9', '!=') && version_compare(phpversion(), '5.2.5', '>=');
                    $mod_rewrite = false;
                    if (function_exists('apache_get_modules')) {
                        $modules = apache_get_modules();
                        $mod_rewrite = in_array('mod_rewrite', $modules);
                    }
                    else
                        $mod_rewrite = getenv('HTTP_MOD_REWRITE') == 'On' ? true : false;

                    $accelerator = (function_exists('apc_store') && ini_get('apc.enabled')) || function_exists('eaccelerator_put') && ini_get('eaccelerator.enable') || function_exists('xcache_set');

                    $rows = array(
                        array('name' => 'install.requirement.phpversion', 'value' => $phpversion, 'required' => true, 'data' => phpversion()),
                        array('name' => 'install.requirement.pdoinstalled', 'value' => class_exists('PDO'), 'required' => true),
                        array('name' => 'install.requirement.rewritemodule', 'value' => $mod_rewrite, 'required' => true),
                        array('name' => 'install.requirement.opensslextension', 'value' => extension_loaded('openssl'), 'required' => true),
                        array('name' => 'install.requirement.ldapextension', 'value' => extension_loaded('ldap'), 'required' => false),
                        array('name' => 'install.requirement.domdocumentmodule', 'value' => class_exists('DomDocument'), 'required' => false),
                        array('name' => 'install.requirement.xslmodule', 'value' => class_exists('XSLTProcessor'), 'required' => false),
                        array('name' => 'install.requirement.gd2extension', 'value' => extension_loaded('gd'), 'required' => false),
                        array('name' => 'install.requirement.tokengetallfunction', 'value' => function_exists('token_get_all'), 'required' => false),
                        array('name' => 'install.requirement.mbstrlenfunction', 'value' => function_exists('mb_strlen'), 'required' => false),
                        array('name' => 'install.requirement.iconvfunction', 'value' => function_exists('iconv'), 'required' => false),
                        array('name' => 'install.requirement.utf8decodefunction', 'value' => function_exists('utf8_decode'), 'required' => false),
                        array('name' => 'install.requirement.posixisattyfunction', 'value' => function_exists('posix_isatty'), 'required' => false),
                        array('name' => 'install.requirement.acelerator', 'value' => $accelerator, 'required' => false),
                        array('name' => 'install.requirement.shortopentag', 'value' => !ini_get('short_open_tag'), 'required' => false),
                        array('name' => 'install.requirement.magicquotesgpc', 'value' => !ini_get('magic_quotes_gpc'), 'required' => false),
                        array('name' => 'install.requirement.registerglobals', 'value' => !ini_get('register_globals'), 'required' => false),
                        array('name' => 'install.requirement.sessionautostart', 'value' => !ini_get('session.auto_start'), 'required' => false),
                        array('name' => 'sfSecurity::getServerUniqueINFO', 'data' => sfSecurity::getServerUniqueINFO() . '-' . sfSecurity::getSystemInstallDate('admin'))
                    );

                    $response = array(
                        'metaData' => array(
                            'idProperty' => 'name',
                            'root' => 'data',
                            'totalProperty' => 'results',
                            'fields' => array(
                                array('name' => 'name', 'type' => 'string'),
                                array('name' => 'value', 'type' => 'bool'),
                                array('name' => 'required', 'type' => 'bool'),
                                array('name' => 'data')
                            ),
                            'sortInfo' => array(
                                'field' => 'name',
                                'direction' => 'ASC'
                            )
                        ),
                        'success' => true,
                        'message' => 'app.msg.info.loadedsuccessful',
                        'results' => count($rows),
                        'data' => $rows,
                        'page' => 1
                    );
                    break;
                case 'registersystem':
                    $remfile = Util::getRootPath('/apps/backend/config/rem.yml', true);
                    $remining = php_strip_whitespace($remfile);
                    if ($remining && $remining != "") {
                        $remining = sfSecurity::decrypt($remining, Util::generateCode(Util::getMetadataValue("app_name")));
                        $errordate = date_create_from_format('Y-m-d H:i:s', $remining);

                        if (Util::dateDifference($errordate->format('Y-m-d H:i:s'), date('Y-m-d H:i:s')) < 0) {
                            $response = array('success' => false, 'message' => 'install.regitration.errordateunsuccessful', 'data' => $errordate->format('d/m/Y'));
                            break;
                        }

                        file_put_contents($remfile, "");
                    }

                    // configuring app.yml
                    $location = Util::getRootPath('/apps/backend/config/_base/_app.yml', true, true);
                    $content = file_get_contents($location, true);
                    
                    $content = str_replace('systemname', strtoupper(md5(Util::getMetadataValue('app_name'))), $content);
                    $content = str_replace('inbehalf', $request->getParameter('inbehalf'), $content);
                    $content = str_replace('regcode', $request->getParameter('regcode'), $content);

                    $location = Util::getRootPath('/apps/backend/config/app.yml', true, true);
                    file_put_contents($location, $content);

                    // clearing cache
                    $folder = Util::getRootPath('cache', true);
                    $response = Util::removeDirectory($folder);
                    if (!is_dir($folder))
                        $response = $response && mkdir($folder, 0, true);

                    $response = array('success' => true, 'message' => 'install.regitration.donesuccessful', 'data' => false);
                    break;


                // atom & webservices cases
                case 'getatom':
                    $this->title = Util::switchTextFormat(Util::getMetadataValue('app_name'));
                    $this->updated = date('d/m/Y h:i A');
                    $this->events = EventTable::getInstance()->getLatest();
                    $this->host = 'http' . ($request->isSecure() ? 's' : '') . '://' . $request->getHost() . '/service.php?method=getdetails&id='; //$_SERVER['HTTP_REFERER'];

                    $this->setTemplate('service');
                    return;
                    break;

                case 'getdetails':
                    $this->event = Doctrine::getTable('Event')->find($request->getParameter('id'));
                    $this->setTemplate('show');
                    return;
                    break;

                default:
                    return parent::executeRequest($request);
                    break;
            }
        } catch (Exception $e) {
            $response = array('success' => false, 'message' => $e->getMessage());
        }

        return $this->renderText(json_encode($response));
    }

    public function executeInstall(sfWebRequest $request) {
        $this->title = 'Zentro&reg; INSTALADOR';
    }

}
