<?php

/**
 * module actions.
 *
 * @package    SGARQBASE
 * @subpackage module
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class moduleActions extends sfBaseActions {

    public function executeRequest(sfWebRequest $request) {
        Util::setExecutionEnviroment();
        $response = array();
        try {
            switch ($request->getParameter('method')) {
                case 'moveincrease':
                    $data = $this->moveIncrease($request);
                    $response = array('success' => true, 'message' => 'app.msg.info.savedsuccessful', 'data' => $data);
                    break;
                case 'test':

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

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        $permissions = false;
        if (!$request->getParameter('permissions') || $request->getParameter('permissions') == '') {
            $permissions = array();
            if ($this->getUser()->isAuthenticated()) {
                $mygroups = array();
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
                }
            }
        }
        
        switch ($request->getParameter('component')) {
            case 'combo':
                $rows = ModuleTable::getInstance()->getAll($filter);
                break;

            case 'tree':
                if ($permissions && count($permissions) > 0) {
                    $obj = new stdClass();
                    $obj->type = "bool";
                    $obj->field = "is_active";
                    $obj->comparison = "eq";
                    $obj->value = true;
                    $filter[] = $obj;

                    $obj = new stdClass();
                    $obj->type = "int";
                    $obj->field = "permission_id";
                    $obj->comparison = "in";
                    $obj->value = array();

                    for ($index = 0; $index < count($permissions); $index++)
                        $obj->value[] = $permissions[$index]['id'];

                    $filter[] = $obj;
                }

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
                $rows = ModuleTable::getInstance()->getByParent($filter, $request->getParameter('checkeable'));
                break;

            case 'completetree':
                $rows = ModuleTable::getInstance()->getCompleteTree('NULL', $permissions);
                break;

            case 'treeintegrator':
                $id = $request->getParameter('node');
                $entity = $request->getParameter('entity');

                $path = explode('/', $request->getParameter('path'));
                for ($index = 0; $index < count($path); $index++)
                    if (stripos($path[$index], 'specialquot')) {
                        $array = json_decode(str_replace('[specialquot]', chr(octdec('42')), $path[$index]), true);
                        $path[$index] = strtolower($array['entity']) . '-' . $array['id'];
                    }
                $path = implode('/', $path);

                $rows = ModuleTable::getInstance()->getTreeIntegration($entity, $id, $filter, $path);
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request) {
        $module = array();
        $ak = Util::generateCode($request->getParameter('name'));

        if ($request->getParameter('id') != '')
            $module = Doctrine::getTable('Module')->find($request->getParameter('id'));

        if ($module == array()) {
            $module = Doctrine::getTable('Module')->findByAK($ak);
            if ($module)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('module.field.label', 'module.field.name', $request->getParameter('name'))
                        )));
            $module = new Module();
        }
        else {
            $testobj = Doctrine::getTable('Module')->findByAK($ak);
            if ($testobj && ($request->getParameter('id') == '' || $testobj->getName() != $module->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('module.field.label', 'module.field.name', $request->getParameter('name'))
                        )));
        }

        $module->setCode($ak);
        $module->setName($request->getParameter('name'));
        $module->setNick(ucfirst(strtolower($request->getParameter('nick'))));
        $module->setComment($request->getParameter('comment'));

        if ($request->getParameter('parent_id') && $request->getParameter('parent_id') != '')
            $module->setParentid($request->getParameter('parent_id'));
        else
            $module->setParentid(null);

        $module->setAttributes($request->getParameter('attributes'));
        $module->setRelations($request->getParameter('relations'));

        if ($request->getParameter('icon') && $request->getParameter('icon') != '') {
            $str = $request->getParameter('icon');
            //$str = str_replace('.png', '', $str);
            $module->setIcon($str);
        }
        else
            $module->setIcon(null);

        if ($request->getParameter('is_multientity') == 'on') {
            $m = Doctrine::getTable('Module')->getMultientityManager();
            if ($m) {
                $m->setIsMultientity(false);
                $m->save();
            }
            $module->setIsMultientity(true);

            // cleaning entity user relations
            $q = Doctrine_Query::create()->from('EntityUserRelation cbr');
            $asociations = $q->execute();
            foreach ($asociations as $asociation)
                $asociation->delete();
        }
        else
            $module->setIsMultientity(false);

        if ($request->getParameter('is_multientidable') == 'on')
            $module->setIsMultientidable(true);
        else
            $module->setIsMultientidable(false);

        $module->setIsActive($request->getParameter('module_is_active') == 'true');

        // cleaning module permissions relations
        $q = Doctrine_Query::create()->from('ModulePermission cbr');
        $asociations = $q->execute();
        foreach ($asociations as $asociation)
            $asociation->delete();
        $pks = explode(",", $request->getParameter('permissions'));
        $module->unlink('Permissions');
        $module->link('Permissions', $pks);

        // cleaning module dependency relations
        $q = Doctrine_Query::create()->from('ModuleDependencyRelation cbr');
        $asociations = $q->execute();
        foreach ($asociations as $asociation)
            $asociation->delete();
        $pks = explode(",", $request->getParameter('dependencies'));
        $module->link('DependentModules', $pks);

        $module->save();
        sfContext::getInstance()->getLogger()->alert('Salvado modulo ' . $module->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        if ($request->getParameter('path') && $request->getParameter('path') != '') {
            $module->setPath($request->getParameter('path') . '/' . $module->getId());
            $module->save();
        }

        return $module->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Module')->deleteByPK($pks, $this->getUser()->getUsername());
    }

    public function moveIncrease(sfWebRequest $request) {
        $module = Doctrine::getTable('Module')->find($request->getParameter('id'));
        BaseTable::moveIncrease($module, 'Module', true, $request->getParameter('step') && $request->getParameter('step') != '');
    }

}
