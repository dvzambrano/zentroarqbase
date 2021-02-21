
<?php slot('title', sprintf($title)) ?>

<?php use_helper('I18N') ?>

<h1><?php //echo __('Signin', null, 'sf_guard')  ?></h1>

<?php echo get_partial('sfGuardAuth/signin_form', array('form' => $form)) ?>


<?php use_javascript('util/form/combo/ClearableCombo.js') ?> 
<?php use_javascript('util/form/treecombo/TreeCombo.js') ?> 

<?php // use_stylesheet('../js/extjs/resources/css/xtheme-slickness.css') ?>
<?php use_javascript('app/backend/signin.js') ?>