/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package SGArqBase
 * @subpackage _base
 * @author MSc. Donel Vázquez Zambrano
 * @version 1.0.0
 */

_BaseApp = function() {
    return {
        init : function(_BaseApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/_base/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('_base.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/_base/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    beforeload: beforeloadStore,
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('_base.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
			
            'filters: []';

            this.infoTextItem = new Ext.Toolbar.TextItem('');
			
            this.gridPanel = '[this.gridPanel]';
			
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/_base/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',
                keys: [formKeyMaping],
                items: ['items: []']
            });

        },

        showWindow : function(animateTarget, hideApply, callback){
            window['_BaseApp'].window = App.showWindow(bundle.getMsg('_base.window.title'), 370, 230, window['_BaseApp'].formPanel, 
                function(button){
                    if(!button){
                        button = new Object;
                        button.id = window['_BaseApp'].window.submitBtn.id;
                    }

                    var records = window['_BaseApp'].gridPanel.getSelectionModel()+'selection: ?';
							
                    window['_BaseApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            entityid: config.app_entityid,
                            id: records[0] ? records[0].get('id') : ''
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);
                            window['_BaseApp'].store.load({
                                params:{
                                    start: window['_BaseApp'].gridPanel.getBottomToolbar().cursor
                                }
                            });
                            
                            submitFormSuccessful('_BaseApp', form, action, button, !records[0], function(){
                                
                            }, callback);
                        },
                        failure: loadFormFailed
                    });

                }, 
                function(){
                    window['_BaseApp'].formPanel.getForm().reset();
                    window['_BaseApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },

        applySecurity : function(groups, permissions){
            window['_BaseApp'].gridPanel.addBtn.setVisible(permissions.indexOf('manage_base') != -1 || permissions.indexOf('manage_baseadd') != -1);
            window['_BaseApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('manage_base') != -1 || permissions.indexOf('manage_baseedit') != -1);
            window['_BaseApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('manage_base') != -1 || permissions.indexOf('manage_basedelete') != -1);
        }
    }
}();

