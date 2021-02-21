<?php

/**
 * bd actions.
 *
 * @package    SGARQBASE
 * @subpackage bd
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class dbActions extends sfBaseActions {

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
        try {
            switch ($request->getParameter('method')) {
                case 'loadConfig':
                    $array = MetadataTable::getInstance()->getAll(array(), true);

                    foreach ($array as $row) {
                        $row = $row->toArray();
                        if ($row['value'])
                            $response[$row['name']] = $row['value'];
                        else
                            $response[$row['name']] = false;
                    }
                    $response['success'] = true;

                    $response['app_banner'] = $response['app_name'];

                    $response['app_host'] = $request->getUri();
                    $response['app_host'] = str_replace('/db/request/method/loadConfig', '', $response['app_host']);

                    $response['app_validation'] = sfSecurity::validateRegistrationCode(sfConfig::get('app_sg_arq_base_register_code'));


                    $entity = false;
                    $m = ModuleTable::getInstance()->getMultientityManager();
                    if ($m) {
                        $response['multientityapp'] = $m->getIsActive();

                        $entity = $m->getNick();
                    } else {
                        $response['multientityapp'] = false;

                        $module = Doctrine::getTable('Module')->findByAK(Util::generateCode('Entidades'));
                        $entity = $module->getNick();
                    }

                    if ($entity) {
                        $entity = Doctrine::getTable($entity)->find($response['app_multientityid']);
                        if ($entity && $entity->getId() > 0)
                            $response['app_multientity'] = $entity->toArray();
                    }

                    $array = array();
                    $modules = BaseTable::findByField('Module', 'is_active', 1);
                    foreach ($modules as $module)
                        $array[] = strtolower($module->getNick());
                    $response['app_securitypivotmodule'] = $array[rand(0, count($array) - 1)];

                    $response['app_logueduserdata']['ip'] = $_SERVER['REMOTE_ADDR'];

                    if ($this->getUser()->isAuthenticated()) {
                        $mygroups = array();
                        $permissions = array();
                        $user = sfGuardUserTable::getInstance()->findByAK($this->getUser()->getUsername());
                        if ($user) {
                            $permissions = $user->getPermissions()->toArray();
                            $groups = $user->getGroups();
                            foreach ($groups as $group) {
                                $mygroups[] = $group->toArray();
                                $gpermissions = $group->getPermissions();
                                foreach ($gpermissions as $gpermission)
                                    $permissions[] = $gpermission->toArray();
                            }

                            if ($m) {
                                $profile = json_decode($user->getPerson()->getProfile(), true);

                                $response['app_entityid'] = $profile['entity']['id'];

                                $response['app_entitys'] = array();
                                foreach ($user->getEntities() as $entity)
                                    $response['app_entitys'][] = Doctrine::getTable($m->getNick())->find($entity->getId())->toArray();
//                                // uncomment to adquire access to all entities if superadmin
//                                if ($user->getIsSuperAdmin())
//                                    $response['app_entitys'] = Doctrine::getTable($m->getNick())->getAll(array(), true)->toArray();
//                                else {
//                                    $response['app_entitys'] = array();
//                                    foreach ($user->getEntities() as $relation)
//                                        $response['app_entitys'][] = Doctrine::getTable($m->getNick())->find($relation->getEntityId())->toArray();
//                                }

                                if ($response['app_entityid'] && $response['app_entityid'] != '*') {
                                    $response['app_entity'] = Doctrine::getTable($m->getNick())->find($response['app_entityid'])->toArray();
                                    $rn = $profile['entity']['name'];
                                    $rn = str_replace('|_|', ' ', $rn);
                                    $response['app_entityname'] = $rn;
                                    if ($rn && $rn != '')
                                        $response['app_banner'] = $response['app_name'] . ': <b>' . $rn . '</b>';
                                }
                            }
                        }

                        $response['app_logueduserdata'] = $user->toArray();
                        $response['app_logueduserdata']['groups'] = $mygroups;
                        $response['app_logueduserdata']['permissions'] = $permissions;
                        // setting appropiate logued user name
                        if ($response['app_logueduserdata'] && $response['app_logueduserdata']['sfGuardUser']) {
                            $response['app_logueduser'] = $response['app_logueduserdata']['first_name'] . ' ' . $response['app_logueduserdata']['last_name'];
                        } elseif ($response['app_logueduserdata']) {
                            $response['app_logueduser'] = $response['app_logueduserdata']['first_name'] . ' ' . $response['app_logueduserdata']['last_name'];
                        } else {
                            $response['app_logueduser'] = $this->getUser()->getUsername();
                        }
                        // setting logued user profile if exists
                        if ($user->getPerson()) {
                            $response['app_logueduserdata']['Person'] = $user->getPerson()->toArray();
                            $response['app_logueduserdata']['profile'] = $user->getPerson()->getProfile();

                            $response['app_logueduserdata']['personid'] = $user->getPerson()->getId();
                            $response['app_logueduserdata']['picture'] = $user->getPerson()->getPicture();
                        }
                    }
                    break;
                case 'saveConfig':
                    $configs = json_decode($request->getParameter('config'));
                    foreach ($configs as $config) {
                        $record = MetadataTable::getInstance()->find($config->name);

                        if (!$record || $record == NULL) {
                            $record = new Metadata();
                            $record->setName($config->name);
                            $record->setIsVisible(false);
                        }

                        if ($record->getValue() != $config->value || $record->isNew()) {
                            $record->setValue($config->value);
                            $record->save();

                            if ($config->name == 'app_ismultientidable')
                                $this->prepareMultientityModules($record->getValue());

                            if ($config->name == 'app_multientityid') {
                                $app_ismultientidable = MetadataTable::getInstance()->find('app_ismultientidable');
                                if ($app_ismultientidable && $app_ismultientidable->getValue() != '')
                                    $this->prepareMultientityModules($app_ismultientidable->getValue());
                            }
                        }
                    }
                    $response = MetadataTable::getInstance()->getAll();
                    break;
                case 'loadEntities':
                    $component = $request->getParameter('component');

                    $m = ModuleTable::getInstance()->getMultientityManager();
                    if ($m) {
                        if ($component && $component == 'combo')
                            $response = Doctrine::getTable($m->getNick())->getAll();
                        else {
                            if ($m->isTree()) {
                                $filter = array();

                                $obj = new stdClass();
                                $obj->type = "int";
                                $obj->field = "parentid";
                                if ($request->getParameter('node') == '' || $request->getParameter('node') == 'NULL')
                                    $obj->comparison = "null";
                                else {
                                    $obj->comparison = "eq";
                                    $obj->value = $request->getParameter('node');
                                }
                                $filter[] = $obj;

                                $response = LocationTable::getInstance()->getByParent($filter, $request->getParameter('checkeable'));
                            } else {
                                $response = Doctrine::getTable($m->getNick())->getAll();
                                $response = $response['data'];
                                $icon = ModuleTable::getIconByNick($m->getNick());
                                for ($index = 0; $index < count($response); $index++) {
                                    $response[$index]['text'] = $response[$index]['name'];
                                    $response[$index]['customicon'] = $icon;
                                    $response[$index]['leaf'] = true;
                                }
                            }
                        }
                    }
                    break;

                // security cases
                /* deletefromhere */
                case 'regcode':
                    $response['extra'] = array();

                    // guessing installation date
                    $installed = date_create_from_format('Y-m-d', date('Y-m-d'));
                    $array = explode('-', $request->getParameter('checksum'));
                    $installed = date_create_from_format('Y-m-d', date("Y-m-d", $array[count($array)-1]));
                    unset($array[count($array)-1]);
                    
                    $key = implode('-', $array);
                    $response['extra']['installed'] = $installed->format('d/m/Y');

                    $period = '';
                    if ($request->getParameter('expire') && $request->getParameter('expire') != '') {
                        $expire = date_create_from_format('d/m/Y', $request->getParameter('expire'));
                        $span = $expire->diff($installed);
                        $period = "";
                        if ($span->format('%y') > 0)
                            $period = $period . $span->format('%y') . 'Y';
                        if ($span->format('%m') > 0)
                            $period = $period . $span->format('%m') . 'M';
                        if ($span->format('%d') > 0)
                            $period = $period . $span->format('%d') . 'D';

                        $request->setParameter('period', '');
                    }

                    if ($request->getParameter('period') && $request->getParameter('period') != '')
                        $period = strtoupper($request->getParameter('period'));

                    $response['key'] = sfSecurity::generateRegistrationCode(strtoupper($request->getParameter('system') . $key), $period, $request->getParameter('build'));
                    $response['success'] = true;

                    // auxiliar variable to show info in firebug
                    $response['extra']['given'] = $period;
                    $response['extra']['expire'] = '';
                    if ($period != '')
                        $response['extra']['expire'] = $installed->add(new DateInterval('P' . $period))->format('d/m/Y');
                    break;
                /* deletetohere */
                case 'checksum':
                    $response = sfSecurity::getSystemCheckSum();
                    $response = array('success' => true, 'message' => $response);
                    break;
                case 'saveprofile':
                    if ($this->getUser()->getUsername() != '') {
                        $user = sfGuardUserTable::getInstance()->retrieveByUsername($this->getUser()->getUsername());

                        $profile = json_decode($user->getPerson()->getProfile(), true);

                        if ($request->getParameter('theme') && $request->getParameter('theme') != '')
                            $profile['theme'] = $request->getParameter('theme');

                        if ($request->getParameter('languaje') && $request->getParameter('languaje') != '')
                            $profile['languaje'] = $request->getParameter('languaje');

                        if ($request->getParameter('customcolor') && $request->getParameter('customcolor') != '')
                            $profile['customcolor'] = $request->getParameter('customcolor');

                        $user->getPerson()->setProfile(json_encode($profile));
                        $user->getPerson()->save();

                        $response = array('success' => true, 'message' => '');
                    }
                    break;

                // install cases
                case 'loadproviders':
                    $rows = array();
                    if (class_exists('PDO')) {
                        $drivers = PDO::getAvailableDrivers();
                        foreach ($drivers as $driver)
                            if ($driver == 'mysql') {
                                $name = $driver;
                                $name = str_replace('mysql', 'MySQL 5.5.16+', $name);
                                $name = str_replace('pgsql', 'PostgreSQL 8.3+', $name);
                                $rows[] = array(
                                    'id' => $driver,
                                    'name' => $name
                                );
                            }
                    }
                    $response = array(
                        'metaData' => array(
                            'idProperty' => 'id',
                            'root' => 'data',
                            'totalProperty' => 'results',
                            'fields' => array(
                                array('name' => 'id', 'type' => 'string'),
                                array('name' => 'name', 'type' => 'string')
                            ),
                            'sortInfo' => array(
                                'field' => 'id',
                                'direction' => 'ASC'
                            )
                        ),
                        'success' => true,
                        'message' => 'app.msg.info.loadedsuccessful',
                        'results' => $count,
                        'data' => $rows,
                        'page' => 1
                    );
                    break;
                case 'configuredatabase':
                    if($request->getParameter('provider') && $request->getParameter('provider')=='mysql'){
                        $mysqli = new mysqli($request->getParameter('server'), $request->getParameter('username'), $request->getParameter('password'));
                        if ($mysqli->connect_errno) 
                            $response = array('success' => false, 'message' => 'install.serveraccess.cantconect', 'data' => $mysqli->connect_error);
                        else
                            $response = array('success' => true, 'message' => 'install.serveraccess.conectsuccessful', 'data' => false);
                    }
                    else
                        $response = array('success' => false, 'message' => 'install.serveraccess.cantconect');
                    break;
                case 'loaddatabases':
                    $rows = array();
                    if($request->getParameter('provider') && $request->getParameter('provider')=='mysql'){
                        $mysqli = new mysqli($request->getParameter('server'), $request->getParameter('username'), $request->getParameter('password'));
                        $result = $mysqli->query("SHOW DATABASES");
                        while ($row = $result->fetch_assoc()) {
                            $rows[] = array(
                                'id' => $row['Database'],
                                'name' => $row['Database']
                            );
                        }
                    }

                    $response = array(
                        'metaData' => array(
                            'idProperty' => 'id',
                            'root' => 'data',
                            'totalProperty' => 'results',
                            'fields' => array(
                                array('name' => 'id', 'type' => 'string'),
                                array('name' => 'name', 'type' => 'string')
                            ),
                            'sortInfo' => array(
                                'field' => 'id',
                                'direction' => 'ASC'
                            )
                        ),
                        'success' => true,
                        'message' => 'app.msg.info.loadedsuccessful',
                        'results' => $count,
                        'data' => $rows,
                        'page' => 1
                    );
                    break;
                case 'createdatabase':
                    $mysqli = new mysqli($request->getParameter('server'), $request->getParameter('username'), $request->getParameter('password'));
                    // creating database
                    if ($request->getParameter('variant')) {
                        // new db
                        $result = $mysqli->query('CREATE DATABASE ' . $request->getParameter('database'));
                        if($result)
                            $response = array('success' => true, 'message' => 'install.databaseselection.createdsuccessful', 'data' => false);
                        else
                            $response = array('success' => false, 'message' => 'install.databaseselection.createdunsuccessful', 'data' => $mysqli->error);
                    } else {
                        // existing db
                        $result = $mysqli->query('DROP DATABASE ' . $request->getParameter('database'));
                        if($result)
                            $response = array('success' => true, 'message' => 'install.databaseselection.deletedsuccessful', 'data' => false);
                        else
                            $response = array('success' => false, 'message' => 'install.databaseselection.deletedunsuccessful', 'data' => $mysqli->error);
                        
                        $result = $mysqli->query('CREATE DATABASE ' . $request->getParameter('database'));
                        if($result)
                            $response = array('success' => true, 'message' => 'install.databaseselection.createdsuccessful', 'data' => false);
                        else
                            $response = array('success' => false, 'message' => 'install.databaseselection.createdunsuccessful', 'data' => $mysqli->error);
                    }
                    
                    // configuring databases.yml                    
                    $location = Util::getRootPath('/config/_base/_databases.yml', true, true);
                    $content = file_get_contents($location, true);

                    $content = str_replace('thisprovidername', $request->getParameter('provider'), $content);
                    $content = str_replace('thisservername', $request->getParameter('server'), $content);
                    $content = str_replace('thisdatabasename', $request->getParameter('database'), $content);
                    $content = str_replace('thisusername', $request->getParameter('username'), $content);
                    $content = str_replace('thisuserpassword', $request->getParameter('password'), $content);

                    $location = Util::getRootPath('/config/databases.yml', true, true);
                    file_put_contents($location, $content);
                    // backup file upload
                    foreach ($request->getFiles() as $fileName) {
                        $theFileName = 'db.sql';
                        $uploadDir = Util::getRootPath('/db');
                        $filesDir = $uploadDir;

                        if (!is_dir($filesDir))
                            mkdir($filesDir, 0777);

                        move_uploaded_file($fileName['tmp_name'], "$filesDir/$theFileName");
                        $response['data'] = array(
                            "directory" => $filesDir,
                            "file" => $theFileName
                        );
                    }
                    break;
                    
                // exporting SQL file cases
                case 'gettables':
                    $array = $this->getDatabaseInfo();
                    $connection = $array["connection"];

                    // finding tables
                    $tables = $request->getParameter('tables');
                    if ($tables == '*') {
                        $tables = array();
                        $result = mysqli_query($connection, 'SHOW TABLES');
                        while ($row = mysqli_fetch_row($result)) {
                            $tables[] = $row[0];
                        }
                    } else {
                        $tables = is_array($tables) ? $tables : explode(',', str_replace(' ', '', $tables));
                    }

                    $text = date('YmdHis') . '-' . rand(1111, 9999);
                    $location = Util::getRootPath('/db/' . $text . '.sql');


                    $content = '';
                    if ($request->getParameter('includedb') && $request->getParameter('includedb') != '') {
                        $content .= 'CREATE DATABASE IF NOT EXISTS `' . $array["db"] . "`;\n\n";
                        $content .= 'USE `' . $array["db"] . "`;\n\n";
                    }
                    $content .= "SET foreign_key_checks = 0;\n\n";
                    /* We want exported AUTO_INCREMENT fields to have still same value, do this only for recent MySQL exports */
                    $content .= "SET SQL_MODE=\"NO_AUTO_VALUE_ON_ZERO\";\n\n";
                    file_put_contents($location, $content);


                    $response = array('success' => true, 'message' => $tables, 'location' => $text);
                    break;
                case 'exporttable':
                    $this->exportTable($request);
                    $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful');
                    break;
                case 'afterexporttables':
                    $location = Util::getRootPath('/db/' . $request->getParameter('location') . '.sql');

                    $content = file_get_contents($location, true);
                    $content .= "SET foreign_key_checks = 1;\n";
                    file_put_contents($location, $content);

                    $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful');
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

    public function prepareMultientityModules($app_ismultientidable) {
        $module = Doctrine::getTable('Module')->findByAK(Util::generateCode('Entidades'));
        if ($module) {
            $module->setIsMultientity($app_ismultientidable == '1');
            $module->setIsActive($app_ismultientidable == '1');
            $module->save();
        }
        $module = Doctrine::getTable('Module')->findByAK(Util::generateCode('Entidad'));
        if ($module) {
            $module->setIsActive($app_ismultientidable == '1' || $app_ismultientidable == '2');
            $module->save();
        }
    }

    public function getDatabaseInfo() {
        // getting db info
        $host = "";
        $db = "";
        $username = "";
        $password = "";
        foreach (Doctrine_Manager::getInstance()->getConnections() as $conection) {
            $options = $conection->getoptions();

            preg_match('/host=(.*);/', $options["dsn"], $host);
            $host = $host[1];

            preg_match('/dbname=(.*)/', $options["dsn"], $db);
            $db = $db[1];

            $username = $options["username"];
            $password = $options["password"];
        }

        return array(
            "host" => $host,
            "username" => $username,
            "password" => $password,
            "db" => $db,
            "connection" => mysqli_connect($host, $username, $password, $db)
        );
    }

    public function exportTable(sfWebRequest $request) {
        $result = array();

        $array = $this->getDatabaseInfo();
        $connection = $array["connection"];

        $location = Util::getRootPath('/db/' . $request->getParameter('location') . '.sql');

        $content = file_get_contents($location, true);
        $table = $request->getParameter('table');
        $batchsize = 100; // amount of rows in every INSER INTO


        /**
         * CREATE TABLE
         */
        $content .= 'DROP TABLE IF EXISTS `' . $table . '`;';
        $row = mysqli_fetch_row(mysqli_query($connection, 'SHOW CREATE TABLE `' . $table . '`'));
        $content .= "\n\n" . $row[1] . ";\n\n";

        /**
         * INSERT INTO
         */
        $row = mysqli_fetch_row(mysqli_query($connection, 'SELECT COUNT(*) FROM `' . $table . '`'));
        $numRows = $row[0];

        // Split table in batches in order to not exhaust system memory 
        $numBatches = intval($numRows / $batchsize) + 1; // Number of while-loop calls to perform

        $search = array("\x00", "\x0a", "\x0d", "\x1a"); //\x08\\x09, not required
        $replace = array('\0', '\n', '\r', '\Z');

        for ($b = 1; $b <= $numBatches; $b++) {

            $query = 'SELECT * FROM `' . $table . '` LIMIT ' . ($b * $batchsize - $batchsize) . ',' . $batchsize;
            $result = mysqli_query($connection, $query);
            $realBatchSize = mysqli_num_rows($result); // Last batch size can be different from $batchsize
            $numFields = mysqli_num_fields($result);

            if ($realBatchSize !== 0) {
                $content .= 'INSERT INTO `' . $table . '` VALUES ';

                for ($i = 0; $i < $numFields; $i++) {
                    $rowCount = 1;
                    while ($row = mysqli_fetch_row($result)) {
                        $content.='(';
                        for ($j = 0; $j < $numFields; $j++) {
                            if (isset($row[$j])) {
                                $row[$j] = addslashes($row[$j]);
                                $row[$j] = str_replace("\n", "\\n", $row[$j]);
                                $row[$j] = str_replace("\r", "\\r", $row[$j]);
                                $row[$j] = str_replace("\f", "\\f", $row[$j]);
                                $row[$j] = str_replace("\t", "\\t", $row[$j]);
                                $row[$j] = str_replace("\v", "\\v", $row[$j]);
                                $row[$j] = str_replace("\a", "\\a", $row[$j]);
                                $row[$j] = str_replace("\b", "\\b", $row[$j]);

                                // solving export acute vocals like í
                                $row[$j] = str_replace($search, $replace, $row[$j]);


                                if ($row[$j] == 'true' or $row[$j] == 'false' or preg_match('/^-?[0-9]+$/', $row[$j]) or $row[$j] == 'NULL' or $row[$j] == 'null') {
                                    $content .= $row[$j];
                                } else {
                                    $content .= "'" . $row[$j] . "'";
                                }
                            } else {
                                $content.= 'NULL';
                            }

                            if ($j < ($numFields - 1)) {
                                $content .= ',';
                            }
                        }

                        if ($rowCount == $realBatchSize) {
                            $rowCount = 0;
                            $content.= ");\n"; //close the insert statement
                        } else {
                            $content.= "),\n"; //close the row
                        }

                        $rowCount++;
                    }
                }
            }
        }

        $content.="\n\n";

        file_put_contents($location, $content);
    }

    public function executeReport(sfWebRequest $request) {
        $this->user = Doctrine::getTable('sfGuardUser')->retrieveByUsername($this->getUser()->getUsername());
        
        $listlength = 100;

        $items = array('Sprockets (13 tooth)', 'Cogs (Cylindrical)', 'Gears (15 tooth)', 'Leaf springs (13 N/m)', 'Coil springs (6 N/deg)');

        $this->items = array();
        $this->total = 0;

        for ($index = 1; $index <= $listlength; $index++) {
            $number = rand(0, count($items) - 1);
            $amount = rand(1, 10);
            $unitprice = rand(1, 1000000);

            $obj = new stdClass();
            $obj->index = $index;
            $obj->name = $items[$number];
            $obj->amount = $amount;
            $obj->unitprice = $unitprice;
            $obj->subtotal = $unitprice * $amount;

            $this->total += $obj->subtotal;

            $obj->unitprice = Util::getNumberFormated($obj->unitprice);
            $obj->subtotal = Util::getNumberFormated($obj->subtotal);

            $this->items[] = $obj;
        }
        $this->letters = Util::getNumberSpell($this->total);

        $this->total = Util::getNumberFormated($this->total);
    }

}
