<?php

/**
 * BasesfGuardUserPassword
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @property integer $user_id
 * @property string $algorithm
 * @property string $salt
 * @property string $password
 * @property sfGuardUser $User
 * 
 * @method integer             getUserId()    Returns the current record's "user_id" value
 * @method string              getAlgorithm() Returns the current record's "algorithm" value
 * @method string              getSalt()      Returns the current record's "salt" value
 * @method string              getPassword()  Returns the current record's "password" value
 * @method sfGuardUser         getUser()      Returns the current record's "User" value
 * @method sfGuardUserPassword setUserId()    Sets the current record's "user_id" value
 * @method sfGuardUserPassword setAlgorithm() Sets the current record's "algorithm" value
 * @method sfGuardUserPassword setSalt()      Sets the current record's "salt" value
 * @method sfGuardUserPassword setPassword()  Sets the current record's "password" value
 * @method sfGuardUserPassword setUser()      Sets the current record's "User" value
 * 
 * @package    sfDoctrineGuardExtraPlugin
 * @subpackage model
 * @author     Your name here
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
abstract class BasesfGuardUserPassword extends sfDoctrineRecord
{
    public function setTableDefinition()
    {
        $this->setTableName('sf_guard_user_password');
        $this->hasColumn('user_id', 'integer', null, array(
             'type' => 'integer',
             ));
        $this->hasColumn('algorithm', 'string', 128, array(
             'type' => 'string',
             'default' => 'sha1',
             'notnull' => true,
             'length' => 128,
             ));
        $this->hasColumn('salt', 'string', 128, array(
             'type' => 'string',
             'length' => 128,
             ));
        $this->hasColumn('password', 'string', 128, array(
             'type' => 'string',
             'length' => 128,
             ));
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('sfGuardUser as User', array(
             'local' => 'user_id',
             'foreign' => 'id'));

        $timestampable0 = new Doctrine_Template_Timestampable(array(
             ));
        $this->actAs($timestampable0);
    }
}