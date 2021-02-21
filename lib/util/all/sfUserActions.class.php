<?php

/**
 * title actions.
 *
 * @package    SGARQBASE
 * @subpackage user
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class sfUserActions extends sfBaseActions {

    public function executeRequest(sfWebRequest $request) {
        Util::setExecutionEnviroment();
        $response = array();
        try {
            switch ($request->getParameter('method')) {
                case 'changepassword':
                    $response = $this->changepassword($request);
                    break;
                case 'validate':
                    $response = $this->validate($request);
                    $response = array('success' => true, 'message' => $response);
                    break;
                case 'editprofile':
                    $response = $this->editprofile($request);
                    break;
                case 'newpassword':
                    $response = $this->newpassword($request);
                    break;
                case 'checkemail':
                    $response = $this->checkemail($request);
                    break;
                case 'checkusername':
                    $response = $this->checkusername($request);
                    break;
                case 'checkcredentials':
                    $response = $this->checkcredentials($request);
                    break;
                case 'getldapusers':
                    $response = $this->getldapusers($request);
                    $response = array('success' => true, 'data' => $response);
                    break;
                case 'importldapusers':
                    $this->importldapusers($request);
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

    public function load(sfWebRequest $request) {
        $rows = array();
        $filter = $this->getFilter($request);

        switch ($request->getParameter('component')) {
            case 'combo':
                switch ($request->getParameter('type')) {
                    case 'sfggroup':
                        $rows = sfGuardGroupTable::getInstance()->getAll($filter);
                        break;
                    case 'sfgusergroup':
                        $rows = sfGuardUserGroupTable::getInstance()->getAll($filter);
                        break;
                    case 'sfgpermission':
                        $rows = sfGuardPermissionTable::getInstance()->getAll($filter);
                        break;
                    case 'sfguserpermission':
                        $rows = sfGuardUserPermissionTable::getInstance()->getAll($filter);
                        break;
                    case 'sfguserentity':
                        $rows = EntityUserRelationTable::getInstance()->getAll($filter);
                        break;
                    case 'validate':
                        $this->validate($request);
                        break;
                    default:
                        $rows = sfGuardUserTable::getInstance()->getAll($filter);
                        break;
                }
                break;
            case 'grid':
                $start = $request->getParameter('start');
                $limit = $request->getParameter('limit');

                if ($request->getParameter('groups') && $request->getParameter('groups') != '') {
                    if (!is_array($filter))
                        $filter = array();

                    $groups = json_decode($request->getParameter('groups'));


                    $obj = new stdClass();
                    $obj->field = "groupid";
                    $obj->comparison = "in";
                    $obj->value = array();
                    foreach ($groups as $group) {
                        $r = Doctrine::getTable('sfGuardGroup')->findByAK($group);
                        if ($r && $r->getId() > 0)
                            $obj->value[] = $r->getId();
                    }
                    $filter[] = $obj;
                }
                if ($request->getParameter('permissions') && $request->getParameter('permissions') != '') {
                    if (!is_array($filter))
                        $filter = array();

                    $permissions = json_decode($request->getParameter('permissions'));


                    $obj = new stdClass();
                    $obj->field = "permissionid";
                    $obj->comparison = "in";
                    $obj->value = array();
                    foreach ($permissions as $permission) {
                        $r = Doctrine::getTable('sfGuardPermission')->findByAK($permission);
                        if ($r && $r->getId() > 0)
                            $obj->value[] = $r->getId();
                    }
                    $filter[] = $obj;
                }
                $rows = sfGuardUserTable::getInstance()->getAllPaged($start, $limit, $filter);
                break;
            default:
                break;
        }

        return $rows;
    }

    public function validate(sfWebRequest $request) {
        $user = array();
        $ak = $request->getParameter('username');
        $ak1 = $request->getParameter('email_address');

        if ((!$ak || $ak == '') && (!$ak1 || $ak1 == ''))
            return;

        if ($request->getParameter('id') != '') {
            $user = Doctrine::getTable('sfGuardUser')->find($request->getParameter('id'));
            $user1 = Doctrine::getTable('sfGuardUser')->findByAK($ak);
            if ($user1)
                if ($user1->getId() != $request->getParameter('id'))
                    throw new Exception(json_encode(array(
                                msg => 'app.error.duplicatedalternatekey',
                                params => array('user.field.label', 'user.first.name', $request->getParameter('username'))
                            )));
            $user2 = Doctrine::getTable('sfGuardUser')->findByAK1($ak1);
            if ($user2)
                if ($user2->getId() != $request->getParameter('id'))
                    throw new Exception(json_encode(array(
                                msg => 'app.error.duplicatedalternatekey',
                                params => array('user.field.label', 'app.form.email', $request->getParameter('email_address'))
                            )));
        }
        if ($user == array()) {
            $user = Doctrine::getTable('sfGuardUser')->findByAK($request->getParameter('username'));
            if ($user)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('user.field.label', 'user.first.name', $request->getParameter('username'))
                        )));
            $user1 = Doctrine::getTable('sfGuardUser')->findByAK1($request->getParameter('email_address'));
            if ($user1)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('user.field.label', 'app.form.email', $request->getParameter('email_address'))
                        )));
        }
        return;
    }

    public function save(sfWebRequest $request) {
        $user = array();
        $isnew = false;

        $emailalloewd = Util::getMetadataValue('app_sendsystememails');
        $mailline = array();

        if ($request->getParameter('app') && $request->getParameter('app') == 'frontend')
            $request = $this->prepareRequest($request);

        if ($request->getParameter('id') != '')
            $user = Doctrine::getTable('sfGuardUser')->find($request->getParameter('id'));

        if ($user == array()) {
            $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')->where('u.username = ?', $request->getParameter('username'));
            $user = $q->fetchOne();
            if ($user)
                throw new Exception(json_encode(array(
                            msg => 'app.error.duplicatedalternatekey',
                            params => array('user.field.label', 'user.first.name', $request->getParameter('username'))
                        )));

            if ($request->getParameter('email_address') && $request->getParameter('email_address') != '') {
                $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')->where('u.email_address = ?', $request->getParameter('email_address'));
                $user = $q->fetchOne();
                if ($user)
                    throw new Exception(json_encode(array(
                                msg => 'app.error.duplicatedalternatekey',
                                params => array('user.field.label', 'app.form.email', $request->getParameter('email_address'))
                            )));
            }

            $user = new sfGuardUser();
            $user->setPerson(new Person());
            $user->getPerson()->setCode(Util::generateCode($request->getParameter('username')));

            $isnew = true;
        }
        else {
            $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')
                    ->where('u.username = ?', array($request->getParameter('username')));
            $testuser = $q->fetchOne();
            if ($testuser) {
                if ($request->getParameter('id') == '' || $testuser->getUsername() != $user->getUsername())
                    throw new Exception(json_encode(array(
                                msg => 'app.error.duplicatedalternatekey',
                                params => array('user.field.label', 'user.first.name', $request->getParameter('username'))
                            )));
            }
        }
        
        $user->getPerson()->setPicture($request->getParameter('picture'));

        $user->setFirstName($request->getParameter('first_name'));
        $user->setLastName($request->getParameter('last_name'));
        $user->setEmailAddress($request->getParameter('email_address'));
        if ($request->getParameter('username') && $request->getParameter('username') != '')
            $user->setUsername($request->getParameter('username'));
        if ($request->getParameter('password') && $request->getParameter('password') != '')
            $user->setPassword($request->getParameter('password'));
        if ($request->getParameter('is_active') == 'true' || $request->getParameter('is_active') == '1')
            $user->setIsActive(true);
        else
            $user->setIsActive(false);

        if ($request->getParameter('app') != 'frontend') {
            $pks = explode(",", $request->getParameter('groups'));
            $user->unlink('Groups');
            $user->link('Groups', $pks);

            $pks = explode(",", $request->getParameter('permissions'));
            $user->unlink('Permissions');
            $user->link('Permissions', $pks);
        }

        $user->save();
        if ($this->getUser()->isAuthenticated())
            sfContext::getInstance()->getLogger()->alert('Salvado usuario ' . $user->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');
		
        if ($request->getParameter('app') != 'frontend') {
            $q = Doctrine_Query::create()
                    ->delete('EntityUserRelation')
                    ->addWhere('sf_guard_user_id = ?', $user->getId());
            if ($request->getParameter('app') == 'frontend' && $request->getParameter('entities') && $request->getParameter('entities') != '') {
                $entities = explode(",", $request->getParameter('entities'));
                $q = $q->addWhere('entity_id IN (' . implode(',', $entities) . ')');
            }
            $deleted = $q->execute();
        }

        if ($request->getParameter('entities') && $request->getParameter('entities') != '') {
            $entities = explode(",", $request->getParameter('entities'));
            foreach ($entities as $entityid) {
                $entity = new EntityUserRelation();
                $entity->setEntityId($entityid);
                $entity->setSfGuardUserId($user->getId());
                $entity->save();
            }
        }

        if ($emailalloewd) {
            if ($isnew) {
                $mailline[] = array(
                    'sendto' => $user->getEmailAddress(),
                    'subject' => array(
                        'msg' => 'user.action.registrationconfirm.mailsubject',
                        'params' => array(Util::getMetadataValue('app_name'))
                    ),
                    'partial' => 'mail/NewUserSuccess',
                    'params' => array(
                        'fullname' => $user->getPerson()->getFullName(),
                        'username' => $user->getUsername(),
                        'password' => $request->getParameter('password')
                    )
                );
                $mailline[] = array(
                    'sendto' => Util::getMetadataValue('app_businessmail'),
                    'subject' => array(
                        'msg' => 'user.action.registrationnotify.mailsubject',
                        'params' => array(Util::getMetadataValue('app_name'))
                    ),
                    'partial' => 'mail/NewUserNotificationSuccess',
                    'params' => array(
                        'fullname' => $user->getPerson()->getFullName(),
                        'username' => $user->getUsername(),
                        'password' => $request->getParameter('password')
                    )
                );
            }
        }

        $user = $user->toArray();
        if ($mailline && count($mailline) > 0)
            $user['mailline'] = json_encode($mailline);

        return $user;
    }

    private function prepareRequest(sfWebRequest $request) {
        if ($request->getParameter('mail') && $request->getParameter('mail') != '') {
            $request->setParameter('email_address', $request->getParameter('mail'));
            if ($request->getParameter('id') == '')
                $request->setParameter('username', $request->getParameter('email_address'));
        }
        else
        if ($request->getParameter('id') == '')
            $request->setParameter('username', Util::generateCode($request->getParameter('first_name') . $request->getParameter('last_name') . rand()));
        $request->setParameter('is_active', '1');

        return $request;
    }

    public function delete(sfWebRequest $request) {
        $pks = json_decode(stripslashes($request->getParameter('ids')));
        return Doctrine::getTable('sfGuardUser')->deleteByPK($pks);
    }

    public function changepassword(sfWebRequest $request) {
        $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')
                ->where('u.username = ? OR u.email_address = ?', array($request->getParameter('username'), $request->getParameter('username')));
        $user = $q->fetchOne();
        if ($user) {
            if ($request->getParameter('passwordpreviows') && $request->getParameter('passwordpreviows') != '') {
                if (!$user->checkPassword($request->getParameter('passwordpreviows')))
                    throw new Exception('app.error.notmatch.user.previowspassword');
            }

            $user->setPassword($request->getParameter('password'));

            $user->save();
            sfContext::getInstance()->getLogger()->alert('Cambiada la contraseña del usuario ' . $user->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');
        }
        return array('success' => true, 'message' => 'app.msg.info.changepasswordsuccessful');
    }

    // devuelve true si esta correcto, false si falla la autenticacion
    public function checkcredentials(sfWebRequest $request) {

        $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')
                ->where('u.username = ? OR u.email_address = ?', array($request->getParameter('username'), $request->getParameter('username')));
        $user = $q->fetchOne();
        if ($user) {
            $profile = json_decode($user->getPerson()->getProfile(), true);
            if ($request->getParameter('password') && $request->getParameter('password') != '') {
                $valid = $user->checkPassword($request->getParameter('password'));

                if ($valid && !$user->getIsActive())
                    return array('success' => false, 'message' => 'app.msg.info.wronglogincredentials.userinactive');

                $permissions = $user->getPermissions()->toArray();
                $groups = $user->getGroups();
                foreach ($groups as $group) {
                    $gpermissions = $group->getPermissions();
                    foreach ($gpermissions as $gpermission)
                        $permissions[] = $gpermission->toArray();
                }

                if (count($permissions) < 1)
                    return array('success' => false, 'message' => 'app.msg.info.wronglogincredentials.nopermissions');


                if ($valid) {
                    $lockout = Doctrine::getTable('sfGuardLoginAttempt')->isLockedOut(Util::getIP());
                    if ($lockout)
                        return array(
                            'success' => false,
                            'message' => 'app.error.autentication.userlocked',
                            'details' => array($lockout)
                        );

                    return array('success' => true, 'message' => 'app.msg.info.autenticatedsuccessful');
                }
                else
                    $this->addFailedLogin();
            }
        }
        else
            $this->addFailedLogin();

        return array('success' => false, 'message' => 'app.msg.info.wronglogincredentials');
    }

// devuelve true si esta disponible, false si se esta usando

    public function checkemail(sfWebRequest $request) {
        $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')
                ->where('u.email_address = ?', $request->getParameter('email'));
        $user = $q->fetchOne();

        if ($request->getParameter('id') && $request->getParameter('id') != '') {
            if (!$user)
                return true;

            if ($user->getId() == $request->getParameter('id'))
                return true;

            return false;
        }

        if ($user)
            return false;
        return true;
    }

    public function checkusername(sfWebRequest $request) {
        $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')
                ->where('u.username = ?', array($request->getParameter('username')));
        $user = $q->fetchOne();

        if ($request->getParameter('id') && $request->getParameter('id') != '') {
            if (!$user)
                return true;

            if ($user->getId() == $request->getParameter('id'))
                return true;

            return false;
        }

        if ($user)
            return false;
        return true;
    }

    public function getldapusers(sfWebRequest $request) {
        $rows = array();


        $server = Util::getMetadataValue('app_authldapserver');
        $searchinUser = Util::getMetadataValue('app_authldapsearchinguser');
        $searchinUserPass = Util::getMetadataValue('app_authldapsearchinguserpass');
        $rootDN = Util::getMetadataValue('app_authldaprootdn');
        $filterDN = Util::getMetadataValue('app_authldapfilterdn');

        $ldap = ldap_connect($server);

        if ($ldap) {
            $bind_results = @ldap_bind($ldap, "CN=" . $searchinUser . "," . $rootDN, $searchinUserPass);

            if (!$bind_results)
                throw new Exception("app.msg.info.cantbindtoldap");

            $dn = $filterDN;
            $filter = "(|(sAMAccountname=*))";
            $results = ldap_search($ldap, $dn, $filter);
            $infos = ldap_get_entries($ldap, $results);

            foreach ($infos as $info) {
                if ($info["samaccountname"][0]) {
                    $rows[] = array(
                        "firstName" => Util::getAsUTF8($info["givenname"][0]),
                        "lastName" => Util::getAsUTF8($info["sn"][0]),
                        "userName" => Util::getAsUTF8($info["samaccountname"][0]),
                        "email" => Util::getAsUTF8($info["userprincipalname"][0])
                    );
                }
            }
            ldap_close($ldap);
        } else {
            throw new Exception("app.msg.info.cantconnecttoldap");
        }

        return $rows;
    }

    public function importldapusers(sfWebRequest $request) {
        $users = json_decode(stripslashes($request->getParameter('users')));

        foreach ($users as $user) {
            $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')
                    ->where('u.username = ?', $user->username);
            $thisuser = $q->fetchOne();
            if (!$thisuser) {
                $thisuser = new sfGuardUser();
                $thisuser->setPerson(new Person());
                $thisuser->setPassword(Util::generateCode($user->username));
            }
            $thisuser->setFirstName($user->firstname);
            $thisuser->setLastName($user->lastname);
            $thisuser->setEmailAddress($user->email);
            $thisuser->setUsername($user->username);
            $thisuser->setIsActive(true);

            $thisuser->save();
        }
    }

    public function addFailedLogin() {
        $loginAttempt = new sfGuardLoginAttempt();
        $loginAttempt->ip_address = Util::getIP();
        $loginAttempt->host_name = Util::getHost();
        $loginAttempt->save();
    }

    public function editprofile(sfWebRequest $request) {
        $person = Doctrine::getTable('Person')->find($request->getParameter('id'));

        if ($person) {
            $person->getsfGuardUser()->setFirstName($request->getParameter('first_name'));
            $person->getsfGuardUser()->setLastName($request->getParameter('last_name'));
            $person->getsfGuardUser()->setEmailAddress($request->getParameter('email_address'));
            $person->setPicture($request->getParameter('picture'));

            try {
                $person->save();
                sfContext::getInstance()->getLogger()->alert('Actualizado perfil de usuario ' . $person->exportTo('json') . ' por el usuario "' . $this->getUser()->getUsername() . '".');
            } catch (Exception $exc) {
                return array('success' => false, 'message' => 'app.error.duplicatedalternatekey.email');
            }
            return array('success' => true, 'message' => 'app.msg.info.editprofilesuccessful');
        }

        return array('success' => false, 'message' => 'app.error.loadingdata');
    }

    public function newpassword(sfWebRequest $request) {
        $q = Doctrine_Core::getTable('sfGuardUser')->createQuery('u')
                ->where('u.username = ? OR u.email_address = ?', array($request->getParameter('email_address'), $request->getParameter('email_address')));
        $user = $q->fetchOne();
        if ($user) {
            $password = Util::generatePassword($user->getUsername());
            $user->setPassword($password);
            $user->save();

            $emailalloewd = Util::getConfigurationValue('app_sendsystememails');
            if ($emailalloewd)
                try {
                    $params = array();
                    $params['fullname'] = $user->getPerson()->getFullName();
                    $params['username'] = $user->getUsername();
                    $params['password'] = $password;
                    $params['email'] = $user->getEmailAddress();
                    $params['appname'] = Util::getConfigurationValue('app_name');
                    $params['companyemail'] = Util::getConfigurationValue('app_mailusername');
                    $params['url'] = 'http' . ($request->isSecure() ? 's' : '') . '://' . $request->getHost();
                    $html = $this->getPartial('mail/newPasswordSuccess', $params);

                    $this->getRequest()->setParameter('method', 'send');
                    $this->getRequest()->setParameter('sendto', $request->getParameter('email_address'));
                    $this->getRequest()->setParameter('subject', 'Actualizacion de clave de usuario');
                    $this->getRequest()->setParameter('msg', $html);

                    Util::sendEmail($this->getMailer(), $request->getParameter('sendto'), $request->getParameter('subject'), $request->getParameter('msg'), $companyemail);
                } catch (Exception $exc) {
                    
                }

            return array('success' => true, 'message' => 'app.msg.info.newpasswordcreatedsuccessful');
        }

        return array('success' => false, 'message' => 'app.msg.error.wronglogincredentials');
    }

}
