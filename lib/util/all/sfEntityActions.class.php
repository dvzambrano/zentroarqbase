<?php

/**
 * title actions.
 *
 * @package    SGARQBASE
 * @subpackage entity
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class sfEntityActions extends sfBaseActions {
	
    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {
            case 'combo':
                $request->setParameter('limit', PHP_INT_MAX);
            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');

                $rows = EntityTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;

            case 'tree':
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

                $rows = EntityTable::getInstance()->getByParent($filter, $request->getParameter('checkeable'));
                break;

            default:
                break;
        }

        return $rows;
    }

    public function save(sfWebRequest $request, $riseexception = true) {
        $entity = array();
        $ak = Util::generateCode($request->getParameter('name'));

        if ($request->getParameter('id') != '')
            $entity = Doctrine::getTable('Entity')->find($request->getParameter('id'));

        if ($entity == array()) {
            $entity = Doctrine::getTable('Entity')->findByAK($ak);
            if ($riseexception && $entity)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('entity.field.label', 'entity.field.name', $request->getParameter('name'))
                        )));
            $entity = new Entity();
        }
        else {
            $testobj = Doctrine::getTable('Entity')->findByAK($ak);
            if ($riseexception && $testobj && ($request->getParameter('id') == '' || $testobj->getName() != $entity->getName()))
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('entity.field.label', 'entity.field.name', $request->getParameter('name'))
                        )));
        }

        $entity->setCode($ak);
        $entity->setName($request->getParameter('name'));
        $entity->setComment($request->getParameter('comment'));
        $entity->setLogo($request->getParameter('logo'));
        $entity->setImages($request->getParameter('images'));
        $entity->setPath($request->getParameter('path'));

        $values = json_decode($request->getParameter('values'));
        $indexes = json_decode($request->getParameter('indexes'));
        $profile = array();
        for ($index = 0; $index < count($indexes); $index++)
            $profile[$indexes[$index]] = $values[$index];
        $entity->setProfile(json_encode($profile));
        
        if ($request->getParameter('parentid') && $request->getParameter('parentid') != '')
            $entity->setParentid($request->getParameter('parentid'));
        else
            $entity->setParentid(null);

        $entity->save();
        sfContext::getInstance()->getLogger()->alert('Salvada entidad ' . $entity->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');

        return $entity->toArray();
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('Entity')->deleteByPK($pks);
    }

}
