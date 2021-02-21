/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package SGArqBase
 * @subpackage reminder
 * @author MSc. Donel Vázquez Zambrano
 * @version 1.0.0
 */

ReminderApp = function() {
    return {
        init : function(ReminderApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/reminder/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: function(store, records) { 
                        alertNoRecords(records);
                        if(config.app_showmessageonstoreloadsuccessful)
                            loadStoreSuccessful(store, records);
                        
                        for(var i = 0; i < records.length; i++){
                            var index = window['ReminderApp'].periodTypeComboStore.find('id', records[i].get('period'));
                            var record = window['ReminderApp'].periodTypeComboStore.getAt(index);
                            if(record)
                                records[i].set('valueperiod', records[i].get('value') + ' ' + record.get('name'));
                            else
                                records[i].set('valueperiod', records[i].get('value'));
                        }
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/reminder/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('reminder.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.periodTypeComboStore = new Ext.data.ArrayStore({
                fields: ['id','name'],
                data : [
                [1, 'Minuto(s)'], 
                [2, 'Hora(s)'],
                [3, 'Día(s)'],
                [4, 'Semana(s)'],
                [5, 'Mes(es)'],
                [6, 'Año(s)'],
                ]
            });
			
            this.filters = new Ext.ux.grid.GridFilters({
                encode: true,
                local: false,
                menuFilterText: bundle.getMsg('app.languaje.find.label'),
                filters: [{
                    type: 'string',
                    dataIndex: 'name'
                },{
                    type: 'string',
                    dataIndex: 'comment'
                },{
                    type: 'int',
                    dataIndex: 'value',
                    menuItemCfgs : {
                        emptyText: bundle.getMsg('app.form.value'),
                        selectOnFocus: true,
                        width: 125
                    }
                }]
            });

            this.infoTextItem = new Ext.Toolbar.TextItem('');
			
            this.gridPanel = new Ext.grid.GridPanel({
                id: 'gridPanelReminder',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('tag_orange'),
                title: config.app_showgridtitle ? bundle.getMsg("reminder.grid.title") : '',
                autoExpandColumn: 'reminedermaincolumn',
                store: this.store,
                loadMask: true,
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['ReminderApp'].gridPanel);
                    }
                },{
                    id:'help',
                    qtip: bundle.getMsg('app.layout.help'),
                    handler: function(button, eventObject) {
                        //window.open(config.app_host + '/uploads/tutorial/page.html');
                    }
                }],
                keys: [panelKeysMap],

                listeners: {
                    activate: function(gridpanel){
                        gridpanel.getStore().load();
                    },
                    rowclick : function(grid, rowIndex, eventObject) {
                        var selectionModel = grid.getSelectionModel();
                        App.selectionChange(selectionModel);
                    },
                    rowdblclick : function(grid, rowIndex, eventObject) {
                        if(grid.updateBtn && !grid.updateBtn.disabled && !grid.updateBtn.hidden)
                            grid.updateBtn.fireEvent('click', grid.updateBtn);
                    },
                    filterupdate: function(){
                        var text = App.getFiltersText(window['ReminderApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['ReminderApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['ReminderApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['ReminderApp'].infoTextItem.getEl()).update('');
                    }
                },
				
                columns: [new Ext.grid.RowNumberer(),{
                    id:'reminedermaincolumn', 
                    header: bundle.getMsg('app.form.name'), 
                    width: 100, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    header: bundle.getMsg('app.form.comment'), 
                    width: 360, 
                    sortable: true, 
                    dataIndex: 'comment'
                },{
                    header: bundle.getMsg('app.form.value'), 
                    width: 80, 
                    sortable: true, 
                    dataIndex: 'valueperiod'
                }],
				
                view: new Ext.grid.GroupingView({
                    markDirty: false,
                    forceFit:true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? bundle.getMsg("app.form.elements") : bundle.getMsg("app.form.element")]})'
                }),
				
                plugins: [this.filters],
				
                stripeRows: true,			
                tbar: [{
                    text: bundle.getMsg('app.form.add'),
                    iconCls: Ext.ux.Icon('add'),
                    ref: '../addBtn',
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            window['ReminderApp'].gridPanel.getSelectionModel().clearSelections();
                            window['ReminderApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
                        }
                    }
                },{
                    ref: '../updateBtn',
                    text: bundle.getMsg('app.form.info'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('information'),
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            App.mask.show();
                            var record = window['ReminderApp'].gridPanel.getSelectionModel().getSelected();
                            if (record){
                                window['ReminderApp'].formPanel.getForm().loadRecord(record);
                            }
                            else
                                window['ReminderApp'].formPanel.getForm().reset();
                            window['ReminderApp'].showWindow(button.getEl(), hideApply, callback);
                            App.mask.hide();
                        }
                    }
                },{
                    ref: '../removeBtn',
                    text: bundle.getMsg('app.form.delete'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('delete'),
                    listeners: {
                        click: function(button, eventObject, callback) {
                            Ext.defer(function(){
                                Ext.Msg.show({
                                    title: bundle.getMsg('app.msg.warning.title'),
                                    msg: bundle.getMsg('app.msg.warning.deleteselected.text'),
                                    buttons: Ext.Msg.YESNO,
                                    fn: function(btn, text){
                                        if (btn == 'yes'){			
                                            var records = window['ReminderApp'].gridPanel.getSelectionModel().getSelections();
											
                                            var array = new Array();
                                            for (var i=0; i<records.length; i++)
                                                array.push(records[i].get('id'));
												
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/reminder/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    var object = Ext.decode(response.responseText);
                                                    if(object.success){
                                                        window['ReminderApp'].store.load({
                                                            params:{
                                                                start: window['ReminderApp'].gridPanel.getBottomToolbar().cursor
                                                            }
                                                        });
                                                        if(callback){
                                                            if(callback.fn)
                                                                callback.fn(callback.params);
                                                            else
                                                                callback();
                                                        }
                                                    }
                                                    else
                                                        requestFailed(response, false);

                                                }
                                            });
                                        }
                                    },
                                    animEl: 'elId',
                                    icon: Ext.MessageBox.QUESTION
                                });
                            }, 100, this);
                        }
                    }
                }],
				
                bbar: new Ext.PagingToolbar({
                    pageSize: parseInt(config.app_elementsongrid),
                    store: this.store,
                    plugins: [new Ext.ux.ProgressBarPager(), this.filters],
                    items: [{
                        tooltip: bundle.getMsg('app.form.clearfilters'),
                        iconCls: Ext.ux.Icon('table_lightning'),
                        handler: function () {
                            window['ReminderApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['ReminderApp'].infoTextItem.getEl()).update('');
                            window['ReminderApp'].gridPanel.getSelectionModel().clearSelections();
                        } 
                    },'-', this.infoTextItem],
                    displayInfo: true,
                    displayMsg: bundle.getMsg('app.form.bbar.displaymsg'),
                    emptyMsg: String.format(bundle.getMsg('app.form.bbar.emptymsg'), bundle.getMsg('app.form.elements').toLowerCase())
                }),
				
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:false, 
                    listeners: {
                        selectionchange: App.selectionChange
                    }
                })
            });
			
            this.gridPanel.getView().getRowClass = function(record, index, rowParams, store) {
                if (!record.get('deleteable')) 
                    return 'row-italic';
            };
			
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/reminder/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',
                keys: [formKeyMaping],
                items: [{
                    layout:'column',
                    items:[{
                        columnWidth:.6,
                        layout: 'form',
                        items: [{
                            xtype:'textfield',
                            name: 'name',
                            fieldLabel: bundle.getMsg('app.form.name')+'<span style="color:red;"><sup>*</sup></span>',          
                            maxLength: 130, 
                            anchor:'-20',
                            allowBlank: false
                        }]
                    },{
                        columnWidth:.4,
                        layout: 'form',
                        items: [{
                            xtype: 'compositefield',
                            anchor:'-20',
                            fieldLabel: bundle.getMsg('reminder.field.period')+'<span style="color:red;"><sup>*</sup></span>', 
                            items: [{
                                xtype: 'spinnerfield',
                                name: 'value',
                                minValue: 0,
                                width: 50,
                                allowDecimals: false,
                                accelerate: true,
                                allowBlank: false
                            },new Ext.form.ComboBox({
                                ref: '../../../periodtypeCombo',
                                name: 'period',
                                store: this.periodTypeComboStore,
                                valueField: 'id',
                                displayField:'name',
                                typeAhead: true,
                                mode: 'local',
                                forceSelection: true,
                                triggerAction: 'all',
                                selectOnFocus:true,
                                allowBlank:false,
                                flex: 1
                            }),{
                                xtype: 'displayfield', 
                                value: bundle.getMsg('reminder.field.period.before')
                            }]
                        }]
                    }]
                },{
                    xtype:'textarea',
                    name: 'comment',
                    fieldLabel: bundle.getMsg('app.form.comment'),          
                    maxLength: 400, 
                    anchor:'-20'
                },]
            });

        },

        showWindow : function(animateTarget){
            window['ReminderApp'].window = App.showWindow(bundle.getMsg('reminder.window.title'), 540, 240, window['ReminderApp'].formPanel, 
                function(button, eventObject, callback){
                    if(!button){
                        button = new Object;
                        button.id = window['ReminderApp'].window.submitBtn.id;
                    }

                    var records = window['ReminderApp'].gridPanel.getSelectionModel().getSelections();
							
                    window['ReminderApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            id: records[0]?records[0].get('id'):'',
                            period_id: window['ReminderApp'].formPanel.periodtypeCombo.getValue()
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);
                            window['ReminderApp'].store.load({
                                params:{
                                    start: window['ReminderApp'].gridPanel.getBottomToolbar().cursor
                                }
                            });
                            
                            submitFormSuccessful('ReminderApp', form, action, button, !records[0], function(){
                                
                                }, callback);
                        },
                        failure: loadFormFailed
                    });

                }, 
                function(){
                    window['ReminderApp'].formPanel.getForm().reset();
                    window['ReminderApp'].window.hide();
                }, 
                animateTarget);
        },

        applySecurity : function(groups, permissions){
            window['ReminderApp'].gridPanel.addBtn.setVisible(permissions.indexOf('managereminder') != -1 || permissions.indexOf('managereminderadd') != -1);
            window['ReminderApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('managereminder') != -1 || permissions.indexOf('managereminderedit') != -1);
            window['ReminderApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('managereminder') != -1 || permissions.indexOf('managereminderdelete') != -1);
        }
    }
}();

