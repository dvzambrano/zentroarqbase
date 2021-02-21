<?php

class BaseTable extends Doctrine_Table {

    public static function processFilters($query, $filters, $basechar, $replacements = array()) {
        foreach ($filters as $filter) {
            $char = $basechar;
            foreach ($replacements as $replacement) {
				if (is_array($replacement['field'])) {
					foreach ($replacement['field'] as $field){
						if ($filter->field == $field) {
							$filter->field = $replacement['realfield'];
							$char = $replacement['char'];
							break;
						}
					}
				}
                if ($filter->field == $replacement['field']) {
                    $filter->field = $replacement['realfield'];
                    $char = $replacement['char'];
                    break;
                }
            }

            switch ($filter->type) {
                case 'string':
                    if (is_array($filter->field)) {
                        $sql = '';
                        $values = array();
                        foreach ($filter->field as $key => $value) {
                            $realchar = $char;
                            if (is_array($char))
                                $realchar = $char[$key];

                            if ($sql == '')
                                $sql = $realchar . '.' . $value . ' LIKE ?';
                            else
                                $sql .= ' OR ' . $realchar . '.' . $value . ' LIKE ?';
                            $values[] = '%' . $filter->value . '%';
                        }
                        $query->addWhere($sql, $values);
                    }
                    else {
                        switch ($filter->comparison) {
                            case 'notlike':
								if (is_array($char)){
									$sql = '';
									$values = array();
									foreach ($char as $currentchar) {
										if ($sql == '')
											$sql = $currentchar . '.' . $filter->field . ' NOT LIKE ?';
										else
											$sql .= ' OR ' . $currentchar . '.' . $filter->field . ' NOT LIKE ?';
										$values[] = '%' . $filter->value . '%';
									}
									$query->addWhere($sql, $values);
								}
                                $query->addWhere($char . '.' . $filter->field . ' NOT LIKE ?', '%' . $filter->value . '%');
                                break;
                            default:
								if (is_array($char)){
									$sql = '';
									$values = array();
									foreach ($char as $currentchar) {
										if ($sql == '')
											$sql = $currentchar . '.' . $filter->field . ' LIKE ?';
										else
											$sql .= ' OR ' . $currentchar . '.' . $filter->field . ' LIKE ?';
										$values[] = '%' . $filter->value . '%';
									}
									$query->addWhere($sql, $values);
								}
								else
									$query->addWhere($char . '.' . $filter->field . ' LIKE ?', '%' . $filter->value . '%');
                                break;
                        }
                    }

                    break;
                case 'date':
                    if (strlen($filter->value) > 10)
                        $filter->value = Util::convertToDate($filter->value, 'd/m/Y H:i:s', 'Y-m-d H:i:s');
                    else
                        $filter->value = Util::convertToDate($filter->value, 'd/m/Y', 'Y-m-d');
                    switch ($filter->comparison) {
                        case 'gt':
                            $query->addWhere('DATE(' . $char . '.' . $filter->field . ') > ?', $filter->value);
                            break;
                        case 'get':
                            $query->addWhere('DATE(' . $char . '.' . $filter->field . ') >= ?', $filter->value);
                            break;
                        case 'lt':
                            $query->addWhere('DATE(' . $char . '.' . $filter->field . ') < ?', $filter->value);
                            break;
                        case 'let':
                            $query->addWhere('DATE(' . $char . '.' . $filter->field . ') <= ?', $filter->value);
                            break;
                        default:
                            $query->addWhere('DATE(' . $char . '.' . $filter->field . ') = ?', $filter->value);
                            break;
                    }
                    break;
                default:
                    switch ($filter->comparison) {
                        case 'gt':
                            $query->addWhere($char . '.' . $filter->field . ' > ?', $filter->value);
                            break;
                        case 'get':
                            $query->addWhere($char . '.' . $filter->field . ' >= ?', $filter->value);
                            break;
                        case 'lt':
                            $query->addWhere($char . '.' . $filter->field . ' < ?', $filter->value);
                            break;
                        case 'let':
                            $query->addWhere($char . '.' . $filter->field . ' <= ?', $filter->value);
                        case 'dt':
                            $query->addWhere($char . '.' . $filter->field . ' != ?', $filter->value);
                            break;
                        case 'null':
                            $query->addWhere($char . '.' . $filter->field . ' is null');
                            break;
                        case 'notnull':
                            $query->addWhere($char . '.' . $filter->field . ' is not null');
                            break;
                        case 'in':
                            if (is_array($filter->value))
                                $query->addWhere($char . '.' . $filter->field . ' IN (' . implode(',', $filter->value) . ')');
                            else
                                $query->addWhere($char . '.' . $filter->field . ' IN (' . $filter->value . ')');
                            break;
                        case 'notin':
                            if (is_array($filter->value))
                                $query->addWhere($char . '.' . $filter->field . ' NOT IN (' . implode(',', $filter->value) . ')');
                            else
                                $query->addWhere($char . '.' . $filter->field . ' NOT IN (' . $filter->value . ')');
                            break;
                        default:
                            if (is_array($char)) {
                                $sql = '';
                                $values = array();
                                foreach ($char as $key => $value) {
                                    $field = $filter->field;
                                    if (is_array($filter->field))
                                        $field = $filter->field[$key];

                                    if ($sql == '')
                                        $sql = $value . '.' . $field . ' = ?';
                                    else
                                        $sql .= ' OR ' . $value . '.' . $field . ' = ?';

                                    $values[] = $filter->value;
                                }
                                $query->addWhere($sql, $values);
                            }
                            else
                                $query->addWhere($char . '.' . $filter->field . ' = ?', $filter->value);
                            break;
                    }
                    break;
            }
        }
        return $query;
    }

    public static function getAllPaged($table, $start, $limit, $filters = array(), $joins = array(), $replacements = array(), $ordered = false, $select = false, $where = false) {

        if (!$limit || $limit == '')
            $limit = PHP_INT_MAX;

        if (!$select)
            $select = 't.*';
        else
            $select = 't.*, ' . $select;
        if (!stripos($select, 'customicon'))
            $select .= ', (SELECT m.icon FROM Module m WHERE m.nick = "' . $table . '") as customicon';

        $q = Doctrine_Query::create()
                ->select($select)
                ->from($table . ' t');
        if ($where)
            $q = $q->addWhere($where);
        foreach ($joins as $join)
            $q = $q->leftJoin($join);

        if ($ordered)
            $q = $q->orderBy($ordered);

        $pager = new sfDoctrinePager($table, $limit);

        if ($filters)
            $q = self::processFilters($q, $filters, 't', $replacements);

        $pager->setQuery($q);

        $page = $start ? $start / $limit + 1 : 1;
        $pager->setPage($page);

        $pager->init();

        return array('results' => $pager->getResults(), 'page' => $page, 'count' => $q->count());
    }

    public static function getByParent($table, $filters = array(), $checkeable = false, $select = false, $joins = array(), $replacements = array(), $ordered = false) {
        if (!$select)
            $select = 't.icon as customicon, "" as icon, (SELECT COUNT(l.id) FROM ' . $table . ' l WHERE l.parentid = t.id)<1 as leaf';
        else
            $select = 't.icon as customicon, "" as icon, (SELECT COUNT(l.id) FROM ' . $table . ' l WHERE l.parentid = t.id)<1 as leaf, ' . $select;

        if ($checkeable)
            $select .= ', false as checked';

        $query = self::getAllPaged($table, 0, PHP_INT_MAX, $filters, $joins, $replacements, $ordered, $select);
        return $query['results']->toArray();
    }

    public static function findByAK($table, $field, $ak) {
        $q = Doctrine_Query::create()
                ->from($table . ' t')
                ->where('t.' . $field . ' = ?', $ak)
                ->limit(1);
        return $q->fetchOne();
    }
    
    public static function findLikeAK($table, $field, $ak, $ordered = false) {
        $q = Doctrine_Query::create()
                ->from($table . ' t')
                ->where('t.' . $field . ' LIKE ?', $ak)
                ->limit(1);
		if ($ordered)
            $q = $q->orderBy($ordered);
        return $q->fetchOne();
    }

    public static function findByField($table, $field, $ak) {
        $q = Doctrine_Query::create()
                ->from($table . ' t')
                ->where('t.' . $field . ' = ?', $ak);
        return $q->execute();
    }

    public static function deleteByPK($instance, $pks) {
        $count = 0;
        foreach ($pks as $pk) {
            $obj = $instance->find($pk);
            $obj->delete();
            $count++;
        }
        return $count;
    }

    public static function getAllChilds($table, $attribute, $pk, $dept = false) {
        $finalids = array($pk);
        $ids = array($pk);

        do {
            $q = Doctrine_Core::getTable($table)->createQuery('t')
                    ->whereIn($attribute, $ids);
            $ids = array();

            $all = $q->execute();
            foreach ($all as $value)
                if ($value->getId()) {
                    array_push($ids, $value->getId());
                    array_push($finalids, $value->getId());
                }

            $finalids = array_unique($finalids);
            $ids = array_unique($ids);

            if (!$dept)
                $ids = array();
        } while (count($ids) > 0);

        $q = Doctrine_Core::getTable($table)->createQuery('t')
                ->whereIn($attribute, $finalids);

        return array(
            'ids' => $finalids,
            'objs' => $q->execute()
        );
    }

    public static function orderByIncrease($table, $tree = true, $parentid = false) {
        $where = '';
        if ($tree) {
            $where = 't.parentid is NULL';
            if ($parentid && $parentid > 0)
                $where = 't.parentid = ' . $parentid;
        }

        $q = Doctrine_Query::create()
                ->select('t.*')
                ->from($table . ' t')
                ->orderBy('t.increase ASC');

        if ($where != '')
            $q = $q->addWhere($where);

        $array = $q->execute();

        $index = 1;
        foreach ($array as $value)
            if ($parentid && $parentid > 0) {
                $x = Doctrine::getTable($table)->find($parentid);
                $value->setIncrease($x->getIncrease());
                $value->save();

                self::orderByIncrease($table, false);
            } else {
                $value->setIncrease(str_pad(str_replace("-", "", ($index++) . "0-"), 10, "0", STR_PAD_LEFT));
                $value->save();
            }
    }

    public static function moveIncrease($entity, $table, $tree = true, $step = false) {
        self::orderByIncrease($table, $tree, $entity->getParentid());

        $where = '';
        if ($tree) {
            $where = 't.parentid is NULL';
            if ($entity->getParentid() && $entity->getParentid() > 0)
                $where = 't.parentid = ' . $parentid;
        }

        $q = Doctrine_Query::create()
                ->select('t.*')
                ->from($table . ' t')
                ->orderBy('t.increase ASC');

        if ($where != '')
            $q = $q->addWhere($where);

        $array = $q->execute();

        $pos = false;
        for ($index = 0; $index < count($array); $index++)
            if ($entity->getId() == $array[$index]->getId())
                $pos = $index;

        if ($pos > -1) {
            $siblingpos = false;
            if ($step)
                $siblingpos = $pos + 1;
            else
                $siblingpos = $pos - 1;

            if ($siblingpos > -1 && $siblingpos < count($array)) {
                $tmp = $array[$pos]->getIncrease();

                $array[$pos]->setIncrease($array[$siblingpos]->getIncrease());
                if ($entity->getParentid() && $entity->getParentid() > 0)
                    $array[$pos]->setParentid($entity->getParentid());
                else
                    $array[$pos]->setParentid(null);
                $array[$pos]->save();

                $array[$siblingpos]->setIncrease($tmp);
                if ($entity->getParentid() && $entity->getParentid() > 0)
                    $array[$siblingpos]->setParentid($entity->getParentid());
                else
                    $array[$siblingpos]->setParentid(null);
                $array[$siblingpos]->save();
            }
        }
    }

}