<?php

/**
 * title actions.
 *
 * @package    SGARQBASE
 * @subpackage file
 * @author    MSc. Donel Vazquez Zambrano
 * @version    SVN: $Id: actions.class.php 12479 2008-10-31 10:54:40Z fabien $
 */
class fileActions extends sfBaseActions {

    public function executeRequest(sfWebRequest $request) {
        Util::setExecutionEnviroment();
        $response = array();
        try {
            switch ($request->getParameter('method')) {
                case 'readfile':
                    $content = Util::getFileContent($request->getParameter('file'), $request->getParameter('type'), $request->getParameter('returnas'));
                    $response = array('success' => true, 'message' => $content);
                    break;
                case 'indexfile':
                    $this->indexfile($request);
                    $response = array('success' => true, 'message' => '');
                    break;
                    break;
                case 'writefile':
                    $location = Util::getRootPath('/' . $request->getParameter('file'), true, true);
                    $content = $request->getParameter('content');
                    file_put_contents($location, $content);

                    $response = array('success' => true, 'message' => '');
                    break;
                case 'upload':
                    $url = $this->upload($request);
                    $response = array('success' => true, 'message' => $url);
                    break;
                case 'duplicate':
                    $response = $this->duplicateModel($request);
                    $response = $response && $this->duplicateController($request);
                    $response = $response && $this->duplicateView($request);

                    // cleaning cache
                    $folder = Util::getRootPath('cache', true);
                    $response = Util::removeDirectory($folder);
                    if (!is_dir($folder))
                        $response = $response && mkdir($folder, 0, true);

                    if ($response)
                        $response = array('success' => $response, 'message' => 'module.generate.code.successful');
                    else
                        $response = array('success' => $response, 'message' => 'module.generate.code.unsuccessful');
                    break;
                case 'degenerate':
                    $response = $this->degenerate($request);
                    if ($response)
                        $response = array('success' => $response, 'message' => 'module.degenerate.code.successful');
                    else
                        $response = array('success' => $response, 'message' => 'module.degenerate.code.unsuccessful');
                    break;
                case 'clearcache':
                    // deleting controller folder
                    $folder = Util::getRootPath('cache', true);
                    $response = Util::removeDirectory($folder);
                    if (!is_dir($folder))
                        $response = $response && mkdir($folder, 0, true);
                    if ($response)
                        $response = array('success' => $response, 'message' => 'app.layout.clearcache.successful');
                    else
                        $response = array('success' => $response, 'message' => 'app.layout.clearcache.unsuccessful');
                    break;
                case 'snapshot':
                    $response = $this->snapshot($request);
//                    $response = array('success' => true, 'message' => $response);
                    break;
                case 'checksum':
                    $response = sfSecurity::getSystemCheckSum();
                    $response = array('success' => true, 'message' => $response);
                    break;
                case 'explore':
                    set_time_limit(480);
                    $paths = json_decode(stripslashes($request->getParameter('paths')));
                    $response = $this->explore($paths);
                    $response = array('success' => true, 'message' => $response);
                    break;
                case 'getlogo':
                    $location = Util::getRootPath('/web/images/logo-white-transpatent.png', true);
                    $file = file_get_contents($location);

                    $response = array('success' => true, 'message' => 'data:image/png;base64,' . base64_encode($file));
                    break;
                case 'export':
                    $toofuscate = array(
                        'lib' . DIRECTORY_SEPARATOR . 'util' . DIRECTORY_SEPARATOR . 'all'
                    );
                    $toexclude = array(
                        'lib' . DIRECTORY_SEPARATOR . 'model' . DIRECTORY_SEPARATOR . 'doctrine' . DIRECTORY_SEPARATOR . '_base',
                        'lib' . DIRECTORY_SEPARATOR . 'util' . DIRECTORY_SEPARATOR . 'all' . DIRECTORY_SEPARATOR . 'SimpleHtmlDom.class.php',
                    );
                    /*
                    $toofuscate = array(
                        'apps' . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . 'modules',
                        'lib' . DIRECTORY_SEPARATOR . 'util' . DIRECTORY_SEPARATOR . 'all',
                        'web' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'app'
                    );
                    $toexclude = array(
                        'doc',
                        'nbproject',
                        'apps' . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . 'modules' . DIRECTORY_SEPARATOR . '_base',
                        'lib' . DIRECTORY_SEPARATOR . 'model' . DIRECTORY_SEPARATOR . 'doctrine' . DIRECTORY_SEPARATOR . '_base',
                        'lib' . DIRECTORY_SEPARATOR . 'util' . DIRECTORY_SEPARATOR . 'all' . DIRECTORY_SEPARATOR . 'SimpleHtmlDom.class.php',
                        'web' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . '_init.js',
                        'web' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . '_install.js',
                        'web' . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . '_base',
                        'data' . DIRECTORY_SEPARATOR . 'fixtures'
                    );
                    */
                    $response = $this->export($request->getParameter('path'), $request->getParameter('target'), $toofuscate, $toexclude);
                    break;
                case 'render':
                    $file = Doctrine::getTable('File')->find($request->getParameter('id'));

                    $filename = explode("/", $file->getUrl());
                    $filename = $filename[count($filename) - 1];

                    $extension = explode(".", $filename);
                    $extension = $extension[count($extension) - 1];

                    $info = parse_url($file->getUrl());

                    $from = Util::getRootPath('web' . $info['path'], true, true);
                    $to = Util::getRootPath('/web/tmp/' . $filename, true, true);

                    $location = 'tmp';
                    if (!is_dir($location))
                        mkdir($location, 0777, true);

                    if (copy($from, $to)) {
                        header('Content-type: ' . Util::getTypeFromExtension($extension));
                        header('Content-Disposition: attachment; filename=' . chr(octdec('42')) . $file->getName() . chr(octdec('42')));
                        readfile($to);
                    }

                    break;
                case 'html2doc':
                    $response = $this->html2doc($request);
                    $response = array('success' => true, 'message' => $response);
                    break;
                case 'gzipfile':
                    $source = Util::getRootPath($request->getParameter('source'));
                    $dest = $source . '.gz';
                    $mode = 'wb9';
                    if ($fpOut = gzopen($dest, $mode)) {
                        if ($fpIn = fopen($source, 'rb')) {
                            while (!feof($fpIn)) {
                                gzwrite($fpOut, fread($fpIn, 1024 * 256));
                            }
                            fclose($fpIn);
                        } else {
                            return false;
                        }
                        gzclose($fpOut);

                        if ($request->getParameter('unlinksource') && $request->getParameter('unlinksource') != '') {
                            if (!unlink($source)) {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }

                    $array = explode("web\uploads", $dest);
                    $dest = $array[1];

                    $response = array('success' => true, 'message' => $dest);
                    break;
                case 'test':
                    echo Util::getFileContent('web/tmp/PDF.pdf', 'pdf');
//                    $request->setParameter('name', 'prueba');
//                    $request->setParameter('url', 'http://localhost:5811//thesis.php?method=renderashtml&id=1&languaje=1');
//                    $request->setParameter('path', 'web/tmp');
//                    $response = $this->html2doc($request);
//
//                    header("Location: ../../../$response");
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

    public function save(sfWebRequest $request) {
        $path = $request->getParameter('name');
        if ($request->getParameter('path') && $request->getParameter('path') != '')
            $path = $request->getParameter('path') . '/' . $path;

        $location = Util::getRootPath($path, true, true);

        if (!is_dir($location))
            mkdir($location, 0777, true);
    }

    public function delete(sfWebRequest $request) {
        $paths = json_decode($request->getParameter('paths'));
        $indexablefiles = Util::getMetadataValue('app_indexablefiles');
        $indexablefiles = str_replace(' ', '', strtolower($indexablefiles));
        $indexablefiles = explode(',', $indexablefiles);

        foreach ($paths as $path) {
            if ($path->path && $path->path != '') {
                $path->id = '';
                $path->url = $location = Util::getRootPath($path->path, true, true);
            }

            Util::removeFile($path->url);

            if ($path->id && $path->id != '') {
                $extension = explode(".", $path->url);
                $extension = $extension[count($extension) - 1];

                if (in_array(strtolower($extension), $indexablefiles)) {
                    $ak = Util::generateCode(str_replace('/', '', $path->id));
                    $file = Doctrine::getTable('File')->findByAK($ak);
                    if ($file)
                        $file->delete();
                }
            }
        }
    }

    public function load(sfWebRequest $request) {
        $rows = array();

        $href = $request->getParameter('path');

        $dir = Util::getRootPath($request->getParameter('path'), true, true);
        if ($request->getParameter('node') && $request->getParameter('node') != 'NULL')
            if ($request->getParameter('path') && $request->getParameter('path') != '') {
                if (stripos($request->getParameter('node'), $request->getParameter('path')) > -1) {
                    $href = $request->getParameter('node');
                    $dir = Util::getRootPath($request->getParameter('node'), true, true);
                } else {
                    $href = $request->getParameter('path') . '/' . $request->getParameter('node');
                    $dir = Util::getRootPath($request->getParameter('path') . '/' . $request->getParameter('node'), true, true);
                }
            } else {
                $href = $request->getParameter('node');
                $dir = Util::getRootPath($request->getParameter('node'), true, true);
            }

        if (!is_dir($dir))
            mkdir($dir, 0777, true);

        $d = dir($dir);
        while ($name = $d->read()) {
            if ($name == '.' || $name == '..' || substr($name, 0, 1) == '.')
                continue;
            if ($request->getParameter('filtering') && !preg_match('/\.(jpg|gif|png)$/', $name))
                continue;
            $size = $this->formatBytes(filesize($dir . DIRECTORY_SEPARATOR . $name), 2);
            $lastmod = date('d/m/Y g:i a', filemtime($dir . '/' . $name));


            $words = explode(".", $name);
            $ext = $words[count($words) - 1];

            $physicalpath = Util::normalizePath($dir . '/' . $name);

            $id = $name;
            if ($href != '')
                $id = $href . '/' . $name;

            $rows[] = array(
                'noweburl' => str_replace('//', '/', str_replace('web/', '', $id)), // no borrar, usado para modules
                'size' => !is_dir($physicalpath) ? $size : ' ',
                'lastmod' => $lastmod,
                'url' => $physicalpath,
                'ext' => count($words) > 1 ? $ext : '',
                'id' => $id,
                'text' => $name,
                'leaf' => !is_dir($physicalpath)
            );
        }
        $d->close();


        if ($request->getParameter('component') == 'tree')
            return $rows;

        $rows = array(
            'metaData' => array(
                'idProperty' => 'url',
                'root' => 'data',
                'totalProperty' => 'results',
                'fields' => array(
                    array('name' => 'id', 'type' => 'string'),
                    array('name' => 'text', 'type' => 'string'),
                    array('name' => 'url', 'type' => 'string'),
                    array('name' => 'noweburl', 'type' => 'string'),
                    array('name' => 'ext', 'type' => 'string'),
                    array('name' => 'size', 'type' => 'decimal'),
                    array('name' => 'lastmod', 'type' => 'string'),
                    array('name' => 'leaf', 'type' => 'bool')
                ),
                'sortInfo' => array(
                    'field' => 'url',
                    'direction' => 'ASC'
                )
            ),
            'success' => true,
            'message' => 'app.msg.info.loadedsuccessful',
            'results' => count($rows),
            'data' => $rows,
            'page' => 1
        );
        return $rows;
    }

    public function upload(sfWebRequest $request) {
        $response = array();
        $filemaxsize = Util::getMetadataValue('app_filemaxsize');
        foreach ($request->getFiles() as $file) {
            //$fileSize = $file['size'];
            //$fileType = $file['type'];

            if ($file['size'] > $filemaxsize)
                throw new Exception(json_encode(array(
                            msg => 'app.error.filesizeexeded',
                            params => array($file['name'], $filemaxsize)
                        )));
            $filename = str_replace('-', '.', Doctrine_Inflector::urlize($file['name'], false));

            $extension = explode(".", $file['name']);
            $extension = $extension[count($extension) - 1];

            if ($request->getParameter('redefinename') && $request->getParameter('redefinename') != '')
                $filename = date("Ymd-his") . "-" . strtoupper(Util::generateCode($file['name'])) . '.' . $extension;

            $location = Util::getRootPath('', true, true);
            $customPath = '';
            $href = $filename;
            if ($request->getParameter('custompath') && $request->getParameter('custompath') != '') {
                $customPath = explode('/', $request->getParameter('custompath'));
                if ($request->getParameter('redefinename') && $request->getParameter('redefinename') != '')
                    for ($index = 0; $index < count($customPath); $index++)
                        $customPath[$index] = Doctrine_Inflector::urlize($customPath[$index]);
                $customPath = implode('/', $customPath);
                $location = Util::getRootPath($customPath, true, true);
                $href = '/' . $customPath . '/' . $filename;
            }

            if (!is_dir($location))
                mkdir($location, 0777, true);

            $fullpath = "$location/$filename";

            move_uploaded_file($file['tmp_name'], $fullpath);

            $response[] = $href;
            return $href;
        }
        return $response;
    }

    public function indexfile(sfWebRequest $request) {
        $href = $request->getParameter('href');

        $href = str_replace(chr(octdec('42')), '', $href);
        $href = str_replace("'", '', $href);

        $filename = explode("/", $href);
        $filename = $filename[count($filename) - 1];

        $extension = explode(".", $filename);
        $extension = $extension[count($extension) - 1];

        $indexablefiles = Util::getMetadataValue('app_indexablefiles');
        $indexablefiles = str_replace(' ', '', strtolower($indexablefiles));
        $indexablefiles = explode(',', $indexablefiles);
        if (in_array(strtolower($extension), $indexablefiles)) {
            $content = Util::getFileContent($href, $extension);

            $ak = Util::generateCode(str_replace('/', '', $href));
            $file = Doctrine::getTable('File')->findByAK($ak);
            if (!$file) {
                $file = new File();
                $file->setCode($ak);
                $file->setName($filename);
            }

            $file->setUrl($_SERVER['HTTP_REFERER'] . str_replace('//', '/', str_replace('web/', '', $href)));
            $file->setContent($content);

            $file->save();
        }
    }

    public function duplicateView(sfWebRequest $request) {
        $response = true;

        $options = json_decode(stripslashes($request->getParameter('options')));
        $attributes = json_decode(stripslashes($request->getParameter('attributes')));

        // copying and editing base.js
        $templateDir = Util::getRootPath('web\js\app', true, true);

        // creating application js folder
        $folder = $templateDir . DIRECTORY_SEPARATOR . $request->getParameter('appname');
        if (!is_dir($folder))
            $response = $response && mkdir($folder, 0, true);
        $base = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . '_base.js';
        $content = file_get_contents($base, true);

        // setting apropiate view
        if (in_array("view-grid", $options)) {
            $viewassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'filters.txt';
            $viewassetcode = file_get_contents($viewassetcode, true);
            $content = str_replace(chr(octdec('47')) . "filters: []" . chr(octdec('47')) . ";", $viewassetcode, $content);

            $viewassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'grid.txt';
            $viewassetcode = file_get_contents($viewassetcode, true);
            $content = str_replace(chr(octdec('47')) . "[this.gridPanel]" . chr(octdec('47')), $viewassetcode, $content);

            $content = str_replace("+" . chr(octdec('47')) . "selection: ?" . chr(octdec('47')), ".getSelections()", $content);

            // generating dinamic filters
            $filterstext = "";
            for ($index = count($attributes) - 1; $index >= 0; $index--) {
                $attribute = $attributes[$index];

                $filterassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'filter.txt';
                $filterassetcode = file_get_contents($filterassetcode, true);

                $filterassetcode = str_replace('_attributetype', strtolower($attribute->type), $filterassetcode);
                $filterassetcode = str_replace('_attribute', strtolower($attribute->nick), $filterassetcode);

                if ($filterstext != "")
                    $filterstext = $filterassetcode . "," . $filterstext;
                else
                    $filterstext = $filterassetcode . $filterstext;
                $filterstext = str_replace("integer", "int", $filterstext); // necesario para q funcione en los filtros con integer q debe ser int                
            }
            $content = str_replace(chr(octdec('47')) . "filters: []" . chr(octdec('47')), $filterstext, $content);
        }
        if (in_array("view-treegrid", $options)) {
            $viewassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'filters.txt';
            $viewassetcode = file_get_contents($viewassetcode, true);
            $content = str_replace(chr(octdec('47')) . "filters: []" . chr(octdec('47')) . ";", $viewassetcode, $content);

            $viewassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'treegrid.txt';
            $viewassetcode = file_get_contents($viewassetcode, true);
            $content = str_replace(chr(octdec('47')) . "[this.gridPanel]" . chr(octdec('47')), $viewassetcode, $content);

            $content = str_replace("+" . chr(octdec('47')) . "selection: ?" . chr(octdec('47')), ".getSelectedNodes()", $content);
            $content = str_replace("records[0]?records[0].get(" . chr(octdec('47')) . "id" . chr(octdec('47')) . ")", "records?records.id", $content);
            $content = str_replace("window[" . chr(octdec('47')) . "_BaseApp" . chr(octdec('47')) . "].store.load()", "window[" . chr(octdec('47')) . "_BaseApp" . chr(octdec('47')) . "].gridPanel.getRootNode().removeAll();window[" . chr(octdec('47')) . "_BaseApp" . chr(octdec('47')) . "].gridPanel.getLoader().load(window[" . chr(octdec('47')) . "_BaseApp" . chr(octdec('47')) . "].gridPanel.getRootNode())", $content);

            // generating dinamic filters
            $filterstext = "";
            for ($index = count($attributes) - 1; $index >= 0; $index--) {
                $attribute = $attributes[$index];

                $filterassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'filter.txt';
                $filterassetcode = file_get_contents($filterassetcode, true);

                $filterassetcode = str_replace('_attributetype', strtolower($attribute->type), $filterassetcode);
                $filterassetcode = str_replace('_attribute', strtolower($attribute->nick), $filterassetcode);

                if ($filterstext != "")
                    $filterstext = $filterassetcode . "," . $filterstext;
                else
                    $filterstext = $filterassetcode . $filterstext;
                $filterstext = str_replace("integer", "int", $filterstext); // necesario para q funcione en los filtros con integer q debe ser int                
            }
            $content = str_replace(chr(octdec('47')) . "filters: []" . chr(octdec('47')), $filterstext, $content);
        }
        // setting the columns & fields for grids & treegrids. setting languaje variables.
        $columnstext = "";
        $formstext = "";
        $fieldstext = "";

        $beginpattern = $request->getParameter('modulenick') . '-START';
        $endpattern = $request->getParameter('modulenick') . '-END';

        $newline = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'newline.txt';
        $newline = file_get_contents($newline, true);

        $languajeassetcode = $newline . $newline . '/*' . $beginpattern . "*/" . $newline;

        for ($index = count($attributes) - 1; $index >= 0; $index--) {
            $attribute = $attributes[$index];
            $columnassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'column.txt';
            $columnassetcode = file_get_contents($columnassetcode, true);
            $columnassetcode = str_replace('_attributetype', strtolower($attribute->type), $columnassetcode);
            $columnassetcode = str_replace('_module', strtolower($request->getParameter('modulenick')), $columnassetcode);
            $columnassetcode = str_replace('_attribute', strtolower($attribute->nick), $columnassetcode);
            if ($index == 0)
                $columnassetcode = str_replace("{", "{id:" . chr(octdec('47')) . "_basecolname" . chr(octdec('47')) . ", ", $columnassetcode);
            if ($columnstext != "")
                $columnstext = $columnassetcode . "," . $columnstext;
            else
                $columnstext = $columnassetcode . $columnstext;
            //-----------------------------------------------------------------------------------------------
            $formassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'form.txt';
            $formassetcode = file_get_contents($formassetcode, true);
            $formassetcode = str_replace('_attribute', strtolower($attribute->nick), $formassetcode);
            if ($formstext != "")
                $formstext = $formassetcode . "," . $newline . '                                    ' . $formstext;
            else
                $formstext = $formassetcode . $formstext;
            //-----------------------------------------------------------------------------------------------
            $fieldassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'field.txt';
            $fieldassetcode = file_get_contents($fieldassetcode, true);

            $fieldassetcode = str_replace('_module', strtolower($request->getParameter('modulenick')), $fieldassetcode);
            $fieldassetcode = str_replace('_attribute', strtolower($attribute->nick), $fieldassetcode);

            if ($fieldstext != "")
                $fieldstext = $fieldassetcode . "," . $fieldstext;
            else
                $fieldstext = $fieldassetcode . $fieldstext;


            // setting languaje variables
            $languajeassetcode = $languajeassetcode .
                    strtolower($request->getParameter('modulenick')) .
                    '.field.' .
                    strtolower($attribute->nick) .
                    ' ' . chr(octdec('42')) . $attribute->name . chr(octdec('42')) . $newline;
        }
        $content = str_replace(chr(octdec('47')) . "columns: []" . chr(octdec('47')), $columnstext, $content);
        $content = str_replace(chr(octdec('47')) . "forms: []" . chr(octdec('47')), $formstext, $content);
        $content = str_replace(chr(octdec('47')) . "items: []" . chr(octdec('47')), $fieldstext, $content);

        // saving settings for languaje variables 
        $languajeassetcode = $languajeassetcode .
                strtolower($request->getParameter('modulenick')) .
                '.window.title ' . chr(octdec('42')) . 'Propiedades de ' . strtolower($request->getParameter('modulename')) . chr(octdec('42')) . $newline;
        $languajeassetcode = $languajeassetcode .
                strtolower($request->getParameter('modulenick')) .
                '.grid.title ' . chr(octdec('42')) . 'Listado de ' . strtolower($request->getParameter('modulename')) . 's' . chr(octdec('42')) . $newline;
        $languajeassetcode = $languajeassetcode .
                strtolower($request->getParameter('modulenick')) .
                '.tab.label ' . chr(octdec('42')) . ucfirst($request->getParameter('modulename')) . chr(octdec('42')) . $newline;
        $languajeassetcode = $languajeassetcode .
                strtolower($request->getParameter('modulenick')) .
                '.field.parent ' . chr(octdec('42')) . ucfirst($request->getParameter('modulename')) . ' al que pertenece' . chr(octdec('42')) . $newline;
        $languajeassetcode = $languajeassetcode . '/*' . $endpattern . "*/";

        $languajefile = $templateDir . '\..\..\languajes\languaje_es-ES.json';

        $languajecontent = file_get_contents($languajefile, true);
        $languajecontent = str_replace("# ", '/*', $languajecontent);
        if (stripos($languajecontent, $beginpattern))
            $languajecontent = preg_replace("#/\*" . $beginpattern . "\*/(.*?)/\*" . $endpattern . "\*/#sm", $languajeassetcode, $languajecontent);
        else
            $languajecontent = $languajecontent . $languajeassetcode;


        $languajecontent = str_replace('/*', "# ", $languajecontent);

        file_put_contents($languajefile, Util::getAsUTF8($languajecontent));


        if ($request->getParameter('multientidable') && $request->getParameter('multientidable') == 'false')
            $content = str_replace("entityid: config.app_entityid,", "", $content);

        $content = str_replace('_base', strtolower($request->getParameter('modulenick')), $content);
        $content = str_replace('_Base', ucfirst($request->getParameter('modulenick')), $content);
        $js = $folder . DIRECTORY_SEPARATOR . strtolower($request->getParameter('modulenick')) . '.js';
        file_put_contents($js, Util::getAsUTF8($content));

        return $response;
    }

    public function duplicateController(sfWebRequest $request) {
        $response = true;

        $options = json_decode(stripslashes($request->getParameter('options')));

        $templateDir = Util::getRootPath('apps/' . strtolower($request->getParameter('appname')) . '/modules/' . strtolower($request->getParameter('modulenick')), true, true);
        // creating actions folder
        $folder = $templateDir . DIRECTORY_SEPARATOR . 'actions';
        if (!is_dir($folder))
            $response = $response && mkdir($folder, 0, true);
        // copying and editing actions.class
        $base = str_replace(strtolower($request->getParameter('modulenick')), '_base', $folder);
        $base = $base . DIRECTORY_SEPARATOR . 'actions.class.php';
        $actionsclass = $folder . DIRECTORY_SEPARATOR . 'actions.class.php';
        $content = file_get_contents($base, true);
        // generating dinamic load cases
        $cases = "";
        if (in_array("controller-combo", $options)) {
            $assetcode = str_replace(strtolower($request->getParameter('modulenick')), '_base', $folder);
            $assetcode = $assetcode . '\combo.txt';
            $assetcode = file_get_contents($assetcode, true);

            if (in_array("controller-grid", $options)) {
                $array1 = explode(':', $assetcode);
                $array2 = explode(';', $assetcode);

                $assetcode = $array1[0] . ":" . $array2[count($array2) - 1];
            }

            $cases = $cases . $assetcode;
        }
        if (in_array("controller-grid", $options)) {
            $assetcode = str_replace(strtolower($request->getParameter('modulenick')), '_base', $folder);
            $assetcode = $assetcode . '\grid.txt';
            $assetcode = file_get_contents($assetcode, true);
            $cases = $cases . $assetcode;
        }
        if (in_array("controller-tree", $options)) {
            $assetcode = str_replace(strtolower($request->getParameter('modulenick')), '_base', $folder);
            $assetcode = $assetcode . '\tree.txt';
            $assetcode = file_get_contents($assetcode, true);
            $cases = $cases . $assetcode;
        }
        if ($cases == "")
            $cases = "case " . chr(octdec('47')) . "CASES" . chr(octdec('47')) . ":";
        $content = str_replace("case " . chr(octdec('47')) . "CASES" . chr(octdec('47')) . ":", $cases, $content);
        // setting module custom attributes
        $attributestext = "";
        $akfieldtext = "";
        $attributes = json_decode(stripslashes($request->getParameter('attributes')));
        foreach ($attributes as $attribute) {
            $assetcode = str_replace(strtolower($request->getParameter('modulenick')), '_base', $folder);
            $assetcode = $assetcode . '\setattribute.txt';
            $assetcode = file_get_contents($assetcode, true);

            if ($attribute->isak)
                $akfieldtext = $attribute->nick;

            if ($attribute->ispk) {
                $assetcode = str_replace("$" . "request->getParameter(" . chr(octdec('47')) . "_attribute" . chr(octdec('47')) . ")", "$" . "ak", $assetcode);
                $assetcode = str_replace('_Attribute', ucfirst($attribute->nick), $assetcode);
            } else {
                $assetcode = str_replace('_attribute', strtolower($attribute->nick), $assetcode);
                $assetcode = str_replace('_Attribute', ucfirst($attribute->nick), $assetcode);
            }

            $attributestext = $attributestext . $assetcode;
        }
        if ($request->getParameter('multientidable') && $request->getParameter('multientidable') == 'true')
            $attributestext = $attributestext . "        $" . "_base->setEntityid(" . "$" . "request->getParameter(" . chr(octdec('47')) . "entityid" . chr(octdec('47')) . "));";
        $content = str_replace("$" . "setAttributes = " . chr(octdec('47')) . chr(octdec('47')) . ";", $attributestext, $content);
        $content = str_replace("_akfield", $akfieldtext, $content);
        $content = str_replace('_Akfield', ucfirst($akfieldtext), $content);

        $content = str_replace('_base', strtolower($request->getParameter('modulenick')), $content);
        $content = str_replace('_Base', ucfirst($request->getParameter('modulenick')), $content);

        file_put_contents($actionsclass, Util::getAsUTF8($content));
        // creating templates folder
        $folder = $templateDir . DIRECTORY_SEPARATOR . 'templates';
        if (!is_dir($folder))
            $response = $response && mkdir($folder, 0, true);
        // copying request template
        $base = str_replace(strtolower($request->getParameter('modulenick')), '_base', $folder);
        $base = $base . DIRECTORY_SEPARATOR . 'requestSuccess.php';
        $response = $response && copy($base, $folder . DIRECTORY_SEPARATOR . 'requestSuccess.php');

        return $response;
    }

    public function duplicateModel(sfWebRequest $request) {
        $response = true;

        $options = json_decode(stripslashes($request->getParameter('options')));
        $attributes = json_decode(stripslashes($request->getParameter('attributes')));
        $relations = json_decode(stripslashes($request->getParameter('relations')));

        if (in_array("model-all", $options)) {
            // copying and editing BaseTable.class.php    
            $templateDir = Util::getRootPath('lib\model\doctrine', true);
            $base = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'BaseTable.class.php';
            $content = file_get_contents($base, true);

            // generating dinamic formats & schema 
            $fieldstext = "";
            $akfieldtext = "";


            $beginpattern = $request->getParameter('modulenick') . '-START';
            $endpattern = $request->getParameter('modulenick') . '-END';

            $newline = $templateDir . '\..\..\..\web\js\app\_base\newline.txt';
            $newline = file_get_contents($newline, true);

            $schemaassetcode = $newline . $newline . '/*' . $beginpattern . "*/" . $newline;
            $schemaassetcode = $schemaassetcode . $request->getParameter('modulenick') . ':' . $newline;
            $schemaassetcode = $schemaassetcode . '  connection: doctrine' . $newline;
            $schemaassetcode = $schemaassetcode . '  tableName: zab_' . strtolower($request->getParameter('modulenick')) . $newline;
            $schemaassetcode = $schemaassetcode . '  columns:' . $newline;


            if ($request->getParameter('multientidable') && $request->getParameter('multientidable') == 'true')
                $fieldstext = "array(" . chr(octdec('47')) . "name" . chr(octdec('47')) . " => " . chr(octdec('47')) . "entityid" . chr(octdec('47')) . ", " . chr(octdec('47')) . "type" . chr(octdec('47')) . " => " . chr(octdec('47')) . "int" . chr(octdec('47')) . ")";
            if (in_array("view-treegrid", $options)) {
                $fieldassetcode = "array(" . chr(octdec('47')) . "name" . chr(octdec('47')) . " => " . chr(octdec('47')) . "path" . chr(octdec('47')) . ", " . chr(octdec('47')) . "type" . chr(octdec('47')) . " => " . chr(octdec('47')) . "string" . chr(octdec('47')) . ")";
                if ($fieldstext != "")
                    $fieldstext = $fieldassetcode . "," . $fieldstext;
                else
                    $fieldstext = $fieldassetcode . $fieldstext;
            }

            for ($index = count($attributes) - 1; $index >= 0; $index--) {
                $attribute = $attributes[$index];

                if ($attribute->isak)
                    $akfieldtext = $attribute->nick;

                $fieldassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'field.txt';
                $fieldassetcode = file_get_contents($fieldassetcode, true);

                $fieldassetcode = str_replace('_attributetype', strtolower($attribute->type), $fieldassetcode);
                $fieldassetcode = str_replace('_attribute', strtolower($attribute->nick), $fieldassetcode);

                if ($fieldstext != "")
                    $fieldstext = $fieldassetcode . "," . $fieldstext;
                else
                    $fieldstext = $fieldassetcode . $fieldstext;
                $fieldstext = str_replace("integer", "int", $fieldstext); // necesario para q funcione en los filtros con integer q debe ser int                
                //setting schema variables
                $schemaassetcode = $schemaassetcode . '    ' . strtolower($attribute->nick) . ':' . $newline;
                $schemaassetcode = $schemaassetcode . '      type: ' . $attribute->type . '(' . $attribute->restriction . ')' . $newline;

                if ($attribute->ispk || $attribute->isak) {
                    if ($attribute->ispk) {
                        $schemaassetcode = $schemaassetcode . '      notnull: true' . $newline;
                        $schemaassetcode = $schemaassetcode . '      unique: true' . $newline;
                    }
                    if ($attribute->isak) {
                        $schemaassetcode = $schemaassetcode . '      notnull: true' . $newline;
                    }
                } else
                if ($attribute->nulleable && ($attribute->nulleable == true || $attribute->nulleable == 1 || $attribute->nulleable == 'true' ))
                    $schemaassetcode = $schemaassetcode . '      notnull: false' . $newline;
                else
                    $schemaassetcode = $schemaassetcode . '      notnull: true' . $newline;
            }
            $relationassetcode = '';
            $relationcomponentassetcode = '';
            for ($index = count($relations) - 1; $index >= 0; $index--) {
                $relation = $relations[$index];
                switch ($relation->typeid) {
                    case 'onetoone':
                    /*
                      sfGuardUser: { onDelete: CASCADE, local: sf_guard_user_id, foreign: id }
                     */
//                        break;
                    case 'onetomany':
                        $schemaassetcode = $schemaassetcode . '    path:' . $newline;
                        $schemaassetcode = $schemaassetcode . '      type: string()' . $newline;

                        $relationassetcode = $relationassetcode . '    ' . $relation->moduleid . ': { onDelete: CASCADE, local: ' . strtolower($relation->attributeid) . ', foreign: id, foreignAlias: ' . $relation->moduleid . 's }' . $newline;
                        break;
                    case 'manytomany':
                        $relationassetcode = $relationassetcode . '    ' . $request->getParameter('modulenick') . $relation->moduleid . 's: { class: ' . $request->getParameter('modulenick') . ', refClass: ' . $request->getParameter('modulenick') . $relation->moduleid . 'Relation, local: ' . strtolower($request->getParameter('modulenick')) . '_id, foreign: ' . strtolower($relation->moduleid) . '_id, type: many }' . $newline;

                        $relationcomponentassetcode = $relationcomponentassetcode . $request->getParameter('modulenick') . $relation->moduleid . 'Relation:' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '  connection: doctrine' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '  tableName: sgab_' . strtolower($request->getParameter('modulenick') . $relation->moduleid . 'Relation') . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '  columns:' . $newline;

                        $relationcomponentassetcode = $relationcomponentassetcode . '    ' . strtolower($request->getParameter('modulenick') . '_id') . ':' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      type: integer' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      primary: true' . $newline;

                        $relationcomponentassetcode = $relationcomponentassetcode . '    ' . strtolower($relation->moduleid . '_id') . ':' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      type: integer' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      primary: true' . $newline;

                        $relationcomponentassetcode = $relationcomponentassetcode . '  relations:' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '    ' . $relation->moduleid . ':' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      class: ' . $relation->moduleid . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      local: ' . strtolower($relation->moduleid . '_id') . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      onDelete: CASCADE' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '    ' . $request->getParameter('modulenick') . ':' . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      class: ' . $request->getParameter('modulenick') . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      local: ' . strtolower($request->getParameter('modulenick') . '_id') . $newline;
                        $relationcomponentassetcode = $relationcomponentassetcode . '      onDelete: CASCADE' . $newline;
                        break;
                    default:
                        break;
                }
            }
            if ($relationassetcode != '') {
                $schemaassetcode = $schemaassetcode . '  relations:' . $newline;
                $schemaassetcode = $schemaassetcode . $relationassetcode . $newline;
                $schemaassetcode = $schemaassetcode . $relationcomponentassetcode . $newline;
            }

            $content = str_replace(chr(octdec('47')) . "fields: []" . chr(octdec('47')), $fieldstext, $content);
            $content = str_replace("_akfield", $akfieldtext, $content);


            // saving settings for schema
            $schemaassetcode = $schemaassetcode . '/*' . $endpattern . "*/";

            $schemafile = $templateDir . '\..\..\..\config\doctrine\schema.yml';

            $schemacontent = file_get_contents($schemafile, true);
            $schemacontent = str_replace("# ", '/*', $schemacontent);
            if (stripos($schemacontent, $beginpattern))
                $schemacontent = preg_replace("#/\*" . $beginpattern . "\*/(.*?)/\*" . $endpattern . "\*/#sm", $schemaassetcode, $schemacontent);
            else
                $schemacontent = $schemacontent . $schemaassetcode;

            $schemacontent = str_replace('/*', "# ", $schemacontent);

            file_put_contents($schemafile, Util::getAsUTF8($schemacontent));



            if (in_array("view-treegrid", $options)) {
                $methodassetcode = $templateDir . DIRECTORY_SEPARATOR . '_base' . DIRECTORY_SEPARATOR . 'treegridgetByParent.txt';
                $methodassetcode = file_get_contents($methodassetcode, true);

                $methodassetcode = str_replace('_attribute', $request->getParameter('parentattribute'), $methodassetcode);

                $content = str_replace("//[getByParentMethod]", $methodassetcode, $content);
            }

            $content = str_replace('_Base', ucfirst($request->getParameter('modulenick')), $content);

            $table = $templateDir . DIRECTORY_SEPARATOR . ucfirst($request->getParameter('modulenick')) . 'Table.class.php';
            file_put_contents($table, Util::getAsUTF8($content));
        }

        return $response;
    }

    public function degenerate(sfWebRequest $request) {
        $response = true;

        $templateDir = Util::getRootPath('lib\model\doctrine', true, true);
        // deleting BaseTable.class.php      
        $table = $templateDir . DIRECTORY_SEPARATOR . ucfirst($request->getParameter('modulenick')) . 'Table.class.php';
        if (is_file($table))
            $response = $response && unlink($table);
        // deleting Base.class.php    
        $table = $templateDir . DIRECTORY_SEPARATOR . ucfirst($request->getParameter('modulenick')) . '.class.php';
        if (is_file($table))
            $response = $response && unlink($table);
        // deleting BaseBaseTable.class.php    
        $table = $templateDir . DIRECTORY_SEPARATOR . 'base' . DIRECTORY_SEPARATOR . 'Base' . ucfirst($request->getParameter('modulenick')) . '.class.php';
        if (is_file($table))
            $response = $response && unlink($table);

        $templateDir = Util::getRootPath('lib\form\doctrine', true, true);
        // deleting BaseForm.class.php      
        $table = $templateDir . DIRECTORY_SEPARATOR . ucfirst($request->getParameter('modulenick')) . 'Form.class.php';
        if (is_file($table))
            $response = $response && unlink($table);
        // deleting BaseBaseForm.class.php    
        $table = $templateDir . DIRECTORY_SEPARATOR . 'base' . DIRECTORY_SEPARATOR . 'Base' . ucfirst($request->getParameter('modulenick')) . 'Form.class.php';
        if (is_file($table))
            $response = $response && unlink($table);

        $templateDir = Util::getRootPath('lib\filter\doctrine', true, true);
        // deleting BaseFilter.class.php      
        $table = $templateDir . DIRECTORY_SEPARATOR . ucfirst($request->getParameter('modulenick')) . 'FormFilter.class.php';
        if (is_file($table))
            $response = $response && unlink($table);
        // deleting BaseBaseFilter.class.php    
        $table = $templateDir . DIRECTORY_SEPARATOR . 'base' . DIRECTORY_SEPARATOR . 'Base' . ucfirst($request->getParameter('modulenick')) . 'FormFilter.class.php';
        if (is_file($table))
            $response = $response && unlink($table);

        // deleting controller folder
        $templateDir = Util::getRootPath('apps/' . strtolower($request->getParameter('appname')) . '/modules/' . strtolower($request->getParameter('modulenick')), true, true);
        $folder = $templateDir;
        $response = $response && Util::removeDirectory($folder);

        // deleting base.js
        $templateDir = Util::getRootPath('web/js/app/' . $request->getParameter('appname'), true);
        $js = $templateDir . DIRECTORY_SEPARATOR . strtolower($request->getParameter('modulenick')) . '.js';
        if (is_file($js))
            $response = $response && unlink($js);

        return $response;
    }

    public function formatBytes($val, $digits = 3, $mode = 'SI', $bB = 'B') { //$mode == 'SI'|'IEC', $bB == 'b'|'B'
        $si = array('', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y');
        $iec = array('', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi');
        switch (strtoupper($mode)) {
            case 'SI' : $factor = 1000;
                $symbols = $si;
                break;
            case 'IEC' : $factor = 1024;
                $symbols = $iec;
                break;
            default : $factor = 1000;
                $symbols = $si;
                break;
        }
        switch ($bB) {
            case 'b' : $val *= 8;
                break;
            default : $bB = 'B';
                break;
        }
        for ($i = 0; $i < count($symbols) - 1 && $val >= $factor; $i++)
            $val /= $factor;
        $p = strpos($val, '.');
        if ($p !== false && $p > $digits)
            $val = round($val);
        elseif ($p !== false)
            $val = round($val, $digits - $p);
        return round($val, $digits) . ' ' . $symbols[$i] . $bB;
    }

    public function snapshot(sfWebRequest $request) {
        $destination = Util::getMetadataValue('app_uploadimagedestination');

        $input = file_get_contents('php://input');
        $snapshot = '';

        switch ($destination) {
            case 'db':
                $snapshot = 'data:image/jpeg;base64,' . base64_encode($input);
                break;
            case 'file':
                $folder = 'uploads/webcam/';
                if (!is_dir($folder))
                    mkdir($folder, 0777);

                $filename = date('YmdHis') . '.jpg';
                $snapshot = $folder . $filename;

                $result = file_put_contents($snapshot, $input);
                if (!$result)
                    throw new Exception('Failed save the image. Make sure you chmod the uploads folder and its subfolders to 777.');
                break;
            default:
                break;
        }

        return $snapshot;
    }

    public function explore($paths) {
        if (count($paths) == 0)
            $paths = json_decode(stripslashes('["apps","lib/util","lib/model/doctrine/_base","web/js/app","web/js/util"]'));

        $result = array();
        $location = Util::getRootPath('', true);

        foreach ($paths as $path) {
            $current = Util::normalizePath($location . '/' . $path);
            $result = array_merge($result, Util::getFilesOnDirectory($current));
        }
        return $result;
    }

    public function export($filePath, $target, $toofuscate = array(), $toexclude = array()) {
        $location = Util::getRootPath('', true);

        $purgearqbase = false;
        if (!$target || $target == '') {
            $target = $location;
            $purgearqbase = true;
        }

        $filePath = str_replace("/", DIRECTORY_SEPARATOR, $filePath);
        $filePath = str_replace(DIRECTORY_SEPARATOR . DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $filePath);

        $target = $target . DIRECTORY_SEPARATOR . str_replace($location, "", $filePath);
        $targetinfo = pathinfo($target);

        $directory = $targetinfo['dirname'];
        $directory = str_replace(DIRECTORY_SEPARATOR . DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR, $directory);

        mkdir($directory, 0777, true);

        $content = file_get_contents($filePath, true);

        $sourceinfo = pathinfo($filePath);

        foreach ($toexclude as $itemtoexclude) {
            if (stripos($sourceinfo['dirname'], $location . $itemtoexclude)) {
                if ($purgearqbase)
                    Util::removeDirectory($sourceinfo['dirname']);
                return;
            }
        }

        $ofuscate = false;
        foreach ($toofuscate as $itemtoofuscate) {
            if (stripos($sourceinfo['dirname'], $itemtoofuscate) || stripos($sourceinfo['dirname'] . DIRECTORY_SEPARATOR . $sourceinfo['filename'] . '.' . $sourceinfo['extension'], $itemtoofuscate)) {
                if (!stripos($sourceinfo['dirname'], 'templates'))
                    $ofuscate = true;
                if ($ofuscate)
                    foreach ($toexclude as $itemtoexclude)
                        if (stripos($itemtoexclude, $sourceinfo['filename'] . '.' . $sourceinfo['extension']))
                            $ofuscate = false;

                break;
            }
        }

        // deleting dangerous source code                    
        $content = preg_replace("#/\*deletefromhere\*/(.*?)/\*deletetohere\*/#sm", " ", $content);
        $content = preg_replace("#/\* deletefromhere \*/(.*?)/\* deletetohere \*/#sm", " ", $content);

        if ($ofuscate) {
            switch ($sourceinfo['extension']) {
                case 'js':
                    // deleting source comments in // format
                    $content = preg_replace("#//(.*)$#m", " ", $content);
                    // deleting source comments in /**/ format
                    $content = preg_replace("#/\*(.*?)\*/#sm", " ", $content);
                    // deleting car returns and line jumps
                    $content = str_replace("\n", " ", $content);
                    $content = str_replace("\r", "", $content);
                    // putting missing ;
                    $content = str_replace(" var ", "; var ", $content);
                    $content = str_replace("} new ", "}; new ", $content);
                    $content = str_replace(";; ", "; ", $content);
                    $content = str_replace("; ; ", "; ", $content);
                    // deleting duplicated spaces
                    $content = preg_replace('/\s\s+/', ' ', $content);
                    break;
                case 'php':
                    $text = $content;

                    $text = str_replace("\"\47\"", "\"\\47\"", $text);

                    $text = Util::matchAllReplace("\47([^\47]*)\47", $text, create_function('$text', 'return Util::encodeToHexdexANDOctal($text);'));

                    preg_match_all("#window\[\47([^\47]*)\47\]#sm", $text, $strings, PREG_PATTERN_ORDER);
                    for ($index = 0; $index < count($strings[1]); $index++)
                        $text = str_replace("window[\47" . $strings[1][$index] . "\47]", "window[\\42" . $strings[1][$index] . "\\42]", $text);

                    file_put_contents($target, $text);

                    $array = file($target, FILE_IGNORE_NEW_LINES);
                    $text = "";
                    foreach ($array as $line) {
                        if (strpos($line, "->") > -1 || strpos($line, "::") > -1) {
                            preg_match_all("#((->|::)(.*?)\()*#sm", $line, $strings, PREG_PATTERN_ORDER);

                            $array = array();
                            foreach ($strings[3] as $value)
                                if ($value && $value != "" && !strpos($value, " ") && !strpos($value, "->"))
                                    $array[] = $value;

                            foreach ($array as $key => $value) {
                                $var = "\$x" . md5($value);
                                if (!in_array($var, $prevlinecodes)) {
                                    $newline = $var . " = \"" . $value . "\";";
                                    $prevlinecodes[] = $var;
                                }

                                $extravars = "";
                                if (!in_array("\$xg", $prevlinecodes)) {
                                    $extravars .= "\$xg = \"" . Util::encodeToHexdexANDOctal("gzinflate") . "\";\n";
                                    $prevlinecodes[] = "\$xg";
                                }
                                if (!in_array("\$xb", $prevlinecodes)) {
                                    $extravars .= "\$xb = \"" . Util::encodeToHexdexANDOctal("base64_decode") . "\";\n";
                                    $prevlinecodes[] = "\$xb";
                                }

                                $newline = base64_encode(gzdeflate($newline, 9));

                                $newline = $extravars . "eval(\$xg(\$xb(\42" . $newline . "\42)));";

                                $text = str_replace($prevline, $prevline . "\n" . $newline . "\n", $text);
                                $prevline .= "\n" . $newline;

                                $line = str_replace("->" . $value . "(", "->" . $var . "(", $line);
                                $line = str_replace("::" . $value . "(", "::" . $var . "(", $line);
                            }
                        }
                        $text .= $line . "\n";

                        $tests = array("switch", "if", "else", "foreach", "for", "do", "while", "try", "catch");
                        $isprevline = true;
                        foreach ($tests as $test) {
                            $claves = preg_split("/" . $test . "[\s]*(\(|\{)/", $line);
                            if (count($claves) > 1) {
                                $isprevline = false;
                                break;
                            }
                        }

                        if ($line != "" && substr($line, -1) == "{" && $isprevline) {
                            $prevline = $line;
                            $prevlinecodes = array();
                        }
                    }

                    $text = str_replace("'", "\42", $text);
                    $text = str_replace('\0', '', $text);

                    while (strpos($text, "\n\n") > -1)
                        $text = str_replace("\n\n", "\n", $text);

                    $content = $text;


                    file_put_contents($target, $content);
                    $content = php_strip_whitespace($target);
                    break;
                default:
                    break;
            }
        }

        file_put_contents($target, $content);
    }

    public function refineAttributes($attributes) {
        $cleanattributes = array();
        if (isset($attributes['FACE'])) {
            $attributes['NAME'] = $attributes['FACE'];
            unset($attributes['FACE']);
        }

        foreach ($attributes as $key => $attribute)
            $cleanattributes[strtolower($key)] = $attribute;

        return $cleanattributes;
    }

    public function html2doc(sfWebRequest $request) {
        $name = $request->getParameter('name');
        $url = $request->getParameter('url');
        $data = $request->getParameter('data');
        $path = $request->getParameter('path');

        // New Word Document
        $PHPWord = new PHPWord();
        $section = $PHPWord->createSection(); // New portrait section
        // Add header
        $header = $section->createHeader();
        $table = $header->addTable();
        $table->addRow();
        $table->addCell(9000)->addText(Util::switchTextFormat($name), array('bold' => true, 'size' => 13));
        // Add footer
        $footer = $section->createFooter();
        $footer->addPreserveText('{PAGE}', array('align' => 'center'));
        // Initialize text
        $textrun = $section->createTextRun(array('spacing' => 100));

        // Define table style arrays
        $styleTable = array('borderSize' => 6, 'borderColor' => 'black', 'cellMargin' => 80);
        $styleFirstRow = array('borderBottomSize' => 18, 'borderBottomColor' => 'black', 'bgColor' => 'CCCCCC');

        // Define font style for first row
        $fontStyle = array('bold' => true, 'align' => 'center');

        // Add table style
        $PHPWord->addTableStyle('myOwnTableStyle', $styleTable, $styleFirstRow);

        // Get content
        $html = '';
        if ($url && $url != '')
            $html = SimpleHtmlDom::file_get_html($url);

        if ($data && $data != '')
            $html = $data;

        $html = str_replace('<br>', '<br/>', $html);
        $html = str_replace('&nbsp;', ' ', $html);
        $simple = '<sgtcontent>' . $html . '</sgtcontent>';
        xml_parse_into_struct(xml_parser_create(), $simple, $values, $index);
        //print_r($values);
        //echo '<hr/>';
        $modifiers = array();
        $specialtags = array('B', 'I', 'U', 'FONT', 'IMG');
        foreach ($values as $value) {
            $properkey = $value['tag'] . $value['level'];
            switch ($value['type']) {
                case 'open':
                    if ($value['tag'] != 'SGTCONTENT' && $value['tag'] != 'BR' && $value['tag'] != 'IMG')
                        $modifiers[$properkey] = array(
                            'tag' => $value['tag'],
                            'attributes' => $this->refineAttributes($value['attributes'])
                        );
                    break;
                case 'close':
                    if ($value['tag'] != 'SGTCONTENT')
                        unset($modifiers);
                    break;
                default:
                    if (in_array($value['tag'], $specialtags)) {
                        $modifiers[$properkey] = array(
                            'tag' => $value['tag'],
                            'attributes' => $this->refineAttributes($value['attributes']),
                            'destroy' => true
                        );
                        $value['tag'] = 'SPAN';
                    }
                    break;
            }

            $fontstyle = array();
            //echo $value['tag'];
            foreach ($modifiers as $modifier) {
                //echo '->' . $modifier['tag'] . ' ';
                foreach ($modifier['attributes'] as $key => $attribute)
                //echo ' ' . $key . '[' . $attribute . ']';
                    switch (strtolower($modifier['tag'])) {
                        case 'b':
                            $fontstyle['bold'] = true;
                            break;
                        case 'i':
                            $fontstyle['italic'] = true;
                            break;
                        case 'u':
                            $fontstyle['underline'] = PHPWord_Style_Font::UNDERLINE_SINGLE;
                            break;
                        case 'u':
                            $fontstyle['underline'] = PHPWord_Style_Font::UNDERLINE_SINGLE;
                            break;
                        case 'div':
                            if ($modifier['attributes']['align'] && $modifier['attributes']['align'] != '')
                                $textrun = $section->createTextRun(array('align' => $modifier['attributes']['align'], 'spacing' => 100));
                            break;
                        case 'font':
                            if ($modifier['attributes']['name'] && $modifier['attributes']['name'] != '')
                                $fontstyle['name'] = $modifier['attributes']['name'];
                            if ($modifier['attributes']['size'] && $modifier['attributes']['size'] != '')
                                $fontstyle['size'] = $modifier['attributes']['size'] * 9 / 2;
                            if ($modifier['attributes']['color'] && $modifier['attributes']['color'] != '')
                                $fontstyle['color'] = $modifier['attributes']['color'];
                            break;
                        default:
                            break;
                    }
            }

            // scaping modifiers tagged as destroy
            $temp = array();
            foreach ($modifiers as $modifier)
                if (!$modifier['destroy'])
                    $temp[] = $modifier;
            $modifiers = $temp;

            //echo '(' . $value['value'] . ')' . '<br/>';
            //print_r($value);
            //echo '<br/>';
            //print_r($modifiers);
            //echo '<hr/>';

            switch (strtolower($value['tag'])) {
                case 'hr':
                    $section->addPageBreak();
                    break;
                case 'table':
                    if ($value['type'] != 'close')
                        $table = $section->addTable('myOwnTableStyle');
                    break;
                case 'tr':
                    if ($value['type'] != 'close' && $value['type'] != 'cdata')
                        $table->addRow();
                    break;
                case 'td':
                    if ($value['type'] != 'close')
                        $table->addCell()->addText($value['value']);
                    break;
                case 'br':
                case 'ol':
                case 'ul':
                    $textrun = $section->createTextRun(array('spacing' => 100));
                    break;
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                case 'h7':
                    $hx = str_replace("h", "", strtolower($value['tag']));
                    $PHPWord->addTitleStyle($hx, array('size' => (19 - ($hx * 3)), 'color' => '333333', 'bold' => true));
                    $section->addTitle($value['value'], $hx);
                    break;
                case 'a':
                    $textrun->addLink($value['attributes']['HREF'], $value['value'], array('color' => '0000FF', 'underline' => PHPWord_Style_Font::UNDERLINE_SINGLE));
                    break;
                case 'toc':
                    // Add Table Of Contents
                    $fontStyle = array('spaceAfter' => 60, 'size' => 12); // Define the TOC font style
                    $section->addTOC($fontStyle);
                    break;
                case 'li':
                    $ol = false;
                    foreach ($modifiers as $modifier)
                        if ($modifier['tag'] == 'OL') {
                            $ol = true;
                            break;
                        }
                    if ($ol)
                        $section->addListItem($value['value'], 0, null, array('listType' => PHPWord_Style_ListItem::TYPE_NUMBER));
                    else
                        $section->addListItem($value['value'], 0);
                    break;
                case 'img':
                    $style = array();
                    if ($value['attributes']['VSPACE'] != '')
                        $style['vspace'] = $value['attributes']['VSPACE'];
                    if ($value['attributes']['HSPACE'] != '')
                        $style['hspace'] = $value['attributes']['HSPACE'];
                    if ($value['attributes']['WIDTH'] != '') {
                        $style['width'] = $value['attributes']['WIDTH'];
                        if (!$value['attributes']['HEIGHT'])
                            $style['height'] = $value['attributes']['WIDTH'];
                    }
                    if ($value['attributes']['HEIGHT'] != '') {
                        $style['height'] = $value['attributes']['HEIGHT'];
                        if (!$value['attributes']['WIDTH'])
                            $style['width'] = $value['attributes']['HEIGHT'];
                    }
                    if ($value['attributes']['ALIGN'] != '')
                        $style['align'] = $value['attributes']['ALIGN'];
                    $href = explode('uploads', $value['attributes']['SRC']);
                    if (count($href) > 1) {
                        unset($href[0]);
                        $href = 'uploads' . implode('uploads', $href);
                    }
                    else
                        $href = $href[0];
                    $section->addImage($href, $style);
                    break;
                case 'u':
                    $fontstyle['underline'] = PHPWord_Style_Font::UNDERLINE_SINGLE;
                default:
                    $textrun->addText($value['value'], $fontstyle, $paragraphstyle);
                    break;
            }
        }

        // Saving
        $folder = Util::getRootPath(utf8_decode($path), true, true);
        if (!is_dir($folder))
            mkdir($folder, 0777, true);

        $objWriter = PHPWord_IOFactory::createWriter($PHPWord, 'Word2007');
        $objWriter->save($folder . '/' . Util::generateCode($name) . '.docx');

        return str_replace('web/', '', $path) . '/' . Util::generateCode($name) . '.docx';
    }

}

