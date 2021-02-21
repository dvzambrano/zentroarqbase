<div class="webtop">
    <div id="x-desktop">
        <div style="margin:15px; float:right;">
            <dl id="x-shortcuts">
                <dt id="effects-shortcut">
                <a href="#"><img src="images/webtop/s.gif" />
                    <div>Apariencia</div></a>
                </dt>
            </dl>
            <dl id="x-shortcuts">
                <dt id="logout-shortcut">
                <a href="#"><img src="images/webtop/s.gif" />
                    <div>Cerrar sesi&oacute;n</div></a>
                </dt>
            </dl>
        </div>
        <!-- 
        
                <dl id="x-shortcuts">
                    <dt id="charts-shortcut">
                    <a href="#"><img src="images/webtop/s.gif" />
                        <div>Gr&aacute;ficos</div></a>
                    </dt>
                </dl>
        
                <dl id="x-shortcuts">
                    <dt id="calendars-shortcut">
                    <a href="#"><img src="images/webtop/s.gif" />
                        <div>Calendario</div></a>
                    </dt>
                </dl>
        
                <dl id="x-shortcuts">
                    <dt id="users-shortcut">
                    <a href="#"><img src="images/webtop/s.gif" />
                        <div>Usuarios</div></a>
                    </dt>
                </dl>
        
                <dl id="x-shortcuts">
                    <dt id="explorer-shortcut">
                    <a href="#"><img src="images/webtop/s.gif" />
                        <div>Explorador</div></a>
                    </dt>
                </dl>
        
                <dl id="x-shortcuts">
                    <dt id="reminders-shortcut">
                    <a href="#"><img src="images/webtop/s.gif" />
                        <div>Recordatorios</div></a>
                    </dt>
                </dl>
        
                <dl id="x-shortcuts">
                    <dt id="modules-shortcut">
                    <a href="#"><img src="images/webtop/s.gif" />
                        <div>M&oacute;dulos</div></a>
                    </dt>
                </dl>-->
    </div>

    <div id="ux-taskbar">
        <div id="ux-taskbar-start"></div>
        <div id="ux-taskbuttons-panel"></div>
        <div class="x-clear"></div>
    </div>
</div>

<!--Webtop-->
<?php use_stylesheet('../js/util/form/webtop/desktop.css') ?>
<?php use_javascript('util/form/webtop/StartMenu.js') ?> 
<?php use_javascript('util/form/webtop/TaskBar.js') ?> 
<?php use_javascript('util/form/webtop/Desktop.js') ?> 
<?php use_javascript('util/form/webtop/App.js') ?> 
<?php use_javascript('util/form/webtop/Module.js') ?> 


<!--Tree Grid de Ejemplos-->
<?php use_javascript('util/form/treegrid/TreeGrid.js') ?> 
<?php use_stylesheet('../js/util/form/treegrid/TreeGrid.css') ?>

<?php use_javascript('extjs/ux/statusbar/StatusBar.js') ?> 

<!--Editor de filas de los grids-->
<?php use_javascript('extjs/ux/RowEditor.js') ?> 
<?php use_stylesheet('../js/extjs/ux/css/RowEditor.css') ?>

<!--Bloqueo de columnas filas de los grids-->
<?php use_javascript('extjs/ux/LockingGridView.js') ?> 
<?php use_stylesheet('../js/extjs/ux/css/LockingGridView.css') ?>

<!--Filtros de los grids-->
<?php use_javascript('extjs/ux/gridfilters/menu/RangeMenu.js') ?> 
<?php use_javascript('extjs/ux/gridfilters/menu/ListMenu.js') ?> 
<?php use_javascript('extjs/ux/gridfilters/GridFilters.js') ?> 
<?php use_javascript('extjs/ux/gridfilters/filter/Filter.js') ?> 
<?php use_javascript('extjs/ux/gridfilters/filter/StringFilter.js') ?> 
<?php use_javascript('extjs/ux/gridfilters/filter/DateFilter.js') ?> 
<?php use_javascript('extjs/ux/gridfilters/filter/ListFilter.js') ?> 
<?php use_javascript('extjs/ux/gridfilters/filter/NumericFilter.js') ?> 
<?php use_javascript('extjs/ux/gridfilters/filter/BooleanFilter.js') ?> 
<?php use_stylesheet('../js/extjs/ux/gridfilters/css/GridFilters.css') ?>
<?php use_stylesheet('../js/extjs/ux/gridfilters/css/RangeMenu.css') ?>

<!--Agrupado de encabezados de los grids-->
<?php use_javascript('../js/extjs/ux/ColumnHeaderGroup.js') ?>
<?php use_stylesheet('../js/extjs/ux/css/ColumnHeaderGroup.css') ?>

<!--Combo q se puede limpiar-->
<?php use_javascript('util/form/combo/ClearableCombo.js') ?> 
<?php use_javascript('util/form/treecombo/TreeCombo.js') ?> 

<!--Spinner-->
<?php use_javascript('extjs/ux/Spinner.js') ?> 
<?php use_javascript('extjs/ux/SpinnerField.js') ?> 
<?php use_stylesheet('../js/extjs/ux/css/Spinner.css') ?>

<!--Combo de busqueda-->
<?php use_stylesheet('../js/util/form/combo/SearchCombo.css') ?>

<!--Multiselect-->
<?php use_javascript('extjs/ux/MultiSelect.js') ?> 
<?php use_javascript('extjs/ux/ItemSelector.js') ?> 

<!--GroupTabPanel-->
<?php use_javascript('extjs/ux/GroupTabPanel.js') ?>
<?php use_javascript('extjs/ux/GroupTab.js') ?> 
<?php use_stylesheet('../js/extjs/ux/css/GroupTab.css') ?>

<!--Exportador e impresiones-->
<?php use_javascript('util/form/grid/GridPrinter.js') ?>
<?php use_javascript('util/form/exporter/Exporter-all.js') ?>

<!--Botones de tema e idioma-->
<?php use_javascript('util/form/cyclebutton/ThemeCycleButton.js') ?>
<?php use_javascript('util/form/cyclebutton/LanguageCycleButton.js') ?>
<?php use_stylesheet('../js/extjs/resources/css/xtheme-blue.css') ?>



<!--Plugin de grid para expandir-->
<?php use_javascript('extjs/ux/RowExpander.js') ?> 

<!--Subida de archivos-->
<?php use_javascript('extjs/ux/fileuploadfield/FileUploadField.js') ?> 

<!--Calendario-->
<?php use_javascript('util/form/calendar/extensible-all.js') ?> 
<?php use_stylesheet('../js/util/form/calendar/extensible-all.css') ?>
<?php use_stylesheet('../js/util/form/calendar/test-app.css') ?>

<!--Tree Grid Generalizado-->
<?php use_stylesheet('../js/extjs/ux/treegrid/treegrid.css') ?>
<?php use_javascript('extjs/ux/treegrid/TreeGridSorter.js') ?> 
<?php use_javascript('extjs/ux/treegrid/TreeGridColumnResizer.js') ?> 
<?php use_javascript('extjs/ux/treegrid/TreeGridNodeUI.js') ?> 
<?php use_javascript('extjs/ux/treegrid/TreeGridLoader.js') ?> 
<?php use_javascript('extjs/ux/treegrid/TreeGridColumns.js') ?> 
<?php use_javascript('extjs/ux/treegrid/TreeGrid.js') ?> 






<?php use_javascript('extjs/ux/GroupSummary.js') ?> 

<?php use_javascript('extjs/ux/FieldLabeler.js') ?> 

<!--inclusiones de criptografia-->
<?php use_javascript('util/cryptography/md5.js') ?>

<!-- CSS para el dataview de servicios -->
<?php use_stylesheet('data-view.css') ?>

<!--inclusiones para trabajo con webcam-->
<?php use_javascript('util/webcam/webcam.js') ?>

<!--Aplicacion-->
<?php use_javascript('app/backend/user.js') ?>
<?php use_javascript('app/backend/webtop.js') ?>
<?php use_javascript('app/_init.js') ?>
 

