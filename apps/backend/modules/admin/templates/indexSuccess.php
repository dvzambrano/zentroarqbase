<?php use_javascript('extjs/ux/statusbar/StatusBar.js') ?> 

<!--Tabs con muchas pestañas-->
<?php use_javascript('extjs/ux/tabscrollermenu/TabScrollerMenu.js') ?> 
<?php use_stylesheet('../js/extjs/ux/tabscrollermenu/tab-scroller-menu.css') ?>

<!--Editor de filas de los grids-->
<?php use_javascript('extjs/ux/RowEditor.js') ?> 
<?php use_stylesheet('../js/extjs/ux/css/RowEditor.css') ?>

<!--Bloqueo de columnas filas de los grids-->
<?php use_javascript('extjs/ux/LockingGridView.js') ?> 
<?php use_stylesheet('../js/extjs/ux/css/LockingGridView.css') ?>

<?php use_javascript('extjs/ux/BufferView.js') ?> 

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

<!--Combo de busqueda-->
<?php use_stylesheet('../js/util/form/combo/SearchCombo.css') ?>
<?php use_javascript('../js/extjs/ux/SearchField.js') ?> 

<!--Multiselect-->
<?php use_javascript('extjs/ux/MultiSelect.js') ?> 
<?php use_javascript('extjs/ux/ItemSelector.js') ?> 

<!--GroupTabPanel-->
<?php use_javascript('extjs/ux/GroupTabPanel.js') ?>
<?php use_javascript('extjs/ux/GroupTab.js') ?> 
<?php use_stylesheet('../js/extjs/ux/css/GroupTab.css') ?>

<!--Exportador e impresiones-->
<?php use_javascript('util/form/grid/GridPrinter.js') ?>
<?php //use_javascript('util/form/exporter/Exporter-all.js') ?>

<!--Botones de tema e idioma-->
<?php use_javascript('util/form/cyclebutton/ThemeCycleButton.js') ?>
<?php use_javascript('util/form/cyclebutton/LanguageCycleButton.js') ?>
<?php use_stylesheet('../js/extjs/resources/css/xtheme-blue.css') ?>

<!--Spinner-->
<?php use_javascript('extjs/ux/Spinner.js') ?> 
<?php use_javascript('extjs/ux/SpinnerField.js') ?> 
<?php use_stylesheet('../js/extjs/ux/css/Spinner.css') ?><!--No puede estar antes q xtheme-blue.css-->



<!--Plugin de grid para paginado-->
<?php use_javascript('extjs/ux/ProgressBarPager.js') ?> 

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


<!--Campos personalizados de SGArqBase-->
<?php use_javascript('util/form/calendar/calendarcombo.js') ?> 
<?php use_javascript('util/form/colorpalette/colorpalette.js') ?> 
<?php use_javascript('util/form/palettecombo/PaletteCombo.js') ?> 
<?php use_javascript('util/form/daterange/daterange.js') ?> 



<?php use_javascript('extjs/ux/GroupSummary.js') ?> 

<?php use_javascript('extjs/ux/FieldReplicator.js') ?> 
<?php use_javascript('extjs/ux/FieldLabeler.js') ?> 

<!--inclusiones de criptografia-->
<?php use_javascript('util/cryptography/md5.js') ?>

<!-- CSS para el dataview de servicios -->
<?php use_stylesheet('data-view.css') ?>

<!--inclusiones para trabajo con webcam-->
<?php use_javascript('util/webcam/webcam.js') ?>

<!--inclusiones para trabajo con Portal-->
<?php use_javascript('extjs/ux/Portal.js') ?> 
<?php use_javascript('extjs/ux/PortalColumn.js') ?> 
<?php use_javascript('extjs/ux/Portlet.js') ?> 
<?php use_stylesheet('../js/extjs/ux/css/Portal.css') ?>

<!--Aplicacion-->
<?php 
	if(file_get_contents(Util::getRootPath('web/js/app/backend/admin.my.js', true, true)))
		 use_javascript('app/backend/admin.my.js');
	else
		 use_javascript('app/backend/admin.js');
?>
<?php use_javascript('app/_init.js') ?>
 <!-- Mandatory to PRELOAD UserApp for edit profile function. But it depend on ContacttypeApp --->
<?php use_javascript('app/backend/contacttype.js') ?>
<?php use_javascript('app/backend/user.js') ?>


<?php slot('title', sprintf($title)) ?>