<?php

/**
 * File
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @package    SGArqBase
 * @subpackage model
 * @author     MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: Builder.php 7490 2010-03-29 19:53:27Z jwage $
 */
class File extends BaseFile {

    public function getSummary($query, $hilight = false) {
        return Util::getSummaryFromHTML($this->getContent(), $query, 85, $hilight);
    }

}