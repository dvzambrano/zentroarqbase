/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage contacttype
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */

ContacttypeApp = function() {
    return {
        init : function(ContacttypeApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/contacttype/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {           
                        alertNoRecords(records, bundle.getMsg('contacttype.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
            
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/contacttype/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {           
                        alertNoRecords(records, bundle.getMsg('contacttype.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
			
            this.filters = new Ext.ux.grid.GridFilters({
                encode: true,
                local: false,
                menuFilterText: bundle.getMsg('app.languaje.find.label'),
                filters: [{
                    type: 'string',
                    dataIndex: 'code'
                },{
                    type: 'string',
                    dataIndex: 'name'
                },{
                    type: 'string',
                    dataIndex: 'comment'
                }]
            });
            
            this.infoTextItem = new Ext.Toolbar.TextItem('');
			
            this.gridPanel = new Ext.grid.GridPanel({
                id: 'gridPanelContacttype',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('tag_orange'),
                title: config.app_showgridtitle ? bundle.getMsg("contacttype.grid.title") : '',
                autoExpandColumn: 'contacttypecolname',
                store: this.store,
                loadMask: true,
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['ContacttypeApp'].gridPanel);
                    }
                },{
                    id:'help',
                    qtip: bundle.getMsg('app.layout.help'),
                    handler: function(button, eventObject) {
                        //window.open(config.app_host+'/uploads/tutorial/page.html');
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
                        var text = App.getFiltersText(window['ContacttypeApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['ContacttypeApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['ContacttypeApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['ContacttypeApp'].infoTextItem.getEl()).update('');
                    }
                },
				
                columns: [new Ext.grid.RowNumberer(),{
                    header: bundle.getMsg('contacttype.field.name'), 
                    width: 160, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    id:'contacttypecolname', 
                    header: bundle.getMsg('contacttype.field.comment'), 
                    width: 360, 
                    sortable: true, 
                    dataIndex: 'comment'
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
                            window['ContacttypeApp'].gridPanel.getSelectionModel().clearSelections();
                            window['ContacttypeApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
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
                            var record = window['ContacttypeApp'].gridPanel.getSelectionModel().getSelected();
                            if (record){
                                window['ContacttypeApp'].formPanel.getForm().loadRecord(record);
                            }
                            else
                                window['ContacttypeApp'].formPanel.getForm().reset();
                            window['ContacttypeApp'].showWindow(button.getEl(), hideApply, callback);
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
                                            var records = window['ContacttypeApp'].gridPanel.getSelectionModel().getSelections();
											
                                            var array = new Array();                                
                                            for (var i=0; i<records.length; i++)
                                                array.push(records[i].get('id'));
												
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/contacttype/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    var object = Ext.decode(response.responseText);
                                                    if(object.success){
                                                        window['ContacttypeApp'].store.load({
                                                            params:{
                                                                start: window['ContacttypeApp'].gridPanel.getBottomToolbar().cursor
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
                            window['ContacttypeApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['ContacttypeApp'].infoTextItem.getEl()).update('');
                            window['ContacttypeApp'].gridPanel.getSelectionModel().clearSelections();
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
                url: config.app_host + '/contacttype/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',						        
                keys: [formKeyMaping],
                items: [{
                    xtype:'textfield',
                    name: 'name',
                    fieldLabel: bundle.getMsg('contacttype.field.name')+'<span style="color:red;"><sup>*</sup></span>', 
                    allowBlank: false,         
                    maxLength: 130, 
                    anchor:'-20'
                },{
                    xtype:'textarea',
                    name: 'comment',
                    fieldLabel: bundle.getMsg('contacttype.field.comment'),          
                    maxLength: 400, 
                    anchor:'-20'
                }]
            });
            
        },
        
        renderContacttype : function(data, callback){
            data.generaldata = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+bundle.getMsg('piece.action.nodatatodisplay');
            if(data.comment && data.comment!='')
                data.generaldata = data.comment;
            if(callback){
                callback(data.generaldata);
            }
                
            return data;
        },
        
        getPanelFor : function(entity){
            var app = Ext.util.Format.capitalize(entity.toLowerCase())+'App';
            var id = Ext.id();
            return new Ext.grid.GridPanel({
                id: id,
                ref: 'contactPanel',
                stripeRows: true,
                autoExpandColumn: entity+'contactmaincolumn',
                title: bundle.getMsg(entity+'.tab.contact'),	
                iconCls: Ext.ux.Icon('telephone'),
                store: new Ext.data.Store({
                    url: config.app_host + '/contacttype/request/method/load',
                    baseParams:{
                        component: 'combo'
                    },
                    reader: new Ext.data.JsonReader()
                }),
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: true, 
                    listeners: {
                        selectionchange: function(selectionModel) {
                            selectionModel.grid.removeBtn.setDisabled(selectionModel.getCount() < 1);
                        }
                    }
                }),	
                view: new Ext.grid.GridView({
                    markDirty: false,
                    forceFit: true
                }),
                columns: [new Ext.grid.RowNumberer(),{
                    header: bundle.getMsg('contacttype.field.label'),
                    width: 80, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    id: entity+'contactmaincolumn', 
                    header: bundle.getMsg('app.form.value'),
                    width: 140, 
                    sortable: true, 
                    dataIndex: 'value'
                }],
                tbar: [new Ext.form.ClearableCombo({
                    ref: 'contacttypeCombo',
                    fieldLabel: bundle.getMsg('contacttype.field.label')+'<span style="color:red;"><sup>*</sup></span>',
                    width: 150, 
                    store: window['ContacttypeApp'].comboStore,
                    valueField: 'id', 
                    displayField: 'name',
                    tpl: '<tpl for="."><div ext:qtip="{name}:{comment}" class="x-combo-list-item">{name}</div></tpl>',
                    typeAhead: true,
                    forceSelection: true,
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus:true,
                    emptyText: bundle.getMsg('app.form.select'),
                    triggerConfig: {
                        tag:'span', 
                        cls:'x-form-twin-triggers', 
                        style:'padding-right:2px',
                        cn:[{
                            tag: "img", 
                            src: Ext.BLANK_IMAGE_URL, 
                            cls: "x-form-trigger"
                        },{
                            tag: "img", 
                            src: Ext.BLANK_IMAGE_URL, 
                            cls: "x-form-trigger x-form-plus-trigger"
                        }]
                    },
                    listeners: {
                        focus: function(combo) {
                            if(!combo.readOnly && !combo.disabled)
                                combo.getStore().load();
                        },
                        change : function(combo, newvalue) {
                            var record = combo.store.getAt(combo.store.find('id', newvalue, 0, true, true));
													
                            if(record && record.data  && record.data.comment != '')
                                Ext.getCmp(id).getTopToolbar().valueField.regex = new RegExp(record.data.comment);
                            else
                                Ext.getCmp(id).getTopToolbar().valueField.regex = null;
                        }
                    },
                    onTrigger2Click: function(){ 
                        var obj = new Object;
                        obj.params = [Ext.getCmp(id).getTopToolbar().contacttypeCombo];
                        obj.fn = function(params){
                            var cmp = params[0];
                            var obj = params[1];
                            var mask = new Ext.LoadMask(window['ContacttypeApp'].window.getEl(), {
                                msg: bundle.getMsg('app.layout.loading')+'...'
                            });
                            mask.show();
                            cmp.store.load({
                                callback: function(records, options, success){
                                    var record = cmp.getStore().getAt(cmp.getStore().find('id',obj.data.id, 0, true, true));								 
                                    if(record)
                                        cmp.setValue(obj.data.id);
                                    mask.hide();
                                }
                            });
                        };
                        window['ContacttypeApp'].showWindow(Ext.getCmp(id).getTopToolbar().contacttypeCombo.getEl(), true, obj);
                    }
                }),{
                    xtype: 'displayfield', 
                    value: '<span style="color:red;"><sup>*</sup></span>&nbsp;&nbsp;'
                },{
                    xtype:'textfield',
                    ref: 'valueField',
                    width: 300
                }, '->',{
                    tooltip: bundle.getMsg('app.form.addrow'),
                    iconCls: Ext.ux.Icon('table_row_insert'),
                    listeners: {
                        click: function() {
                            if(Ext.getCmp(id).getTopToolbar().valueField.isValid()){
                                window[app].contactRecord = Ext.getCmp(id).getTopToolbar().contacttypeCombo.getStore().getAt(Ext.getCmp(id).getTopToolbar().contacttypeCombo.getStore().find('name',Ext.getCmp(id).getTopToolbar().contacttypeCombo.getRawValue(), 0, true, true));
                                window[app].contactRecord.set('value', Ext.getCmp(id).getTopToolbar().valueField.getValue());
                                
                                Ext.getCmp(id).getStore().insert(Ext.getCmp(id).getStore().getCount(), window[app].contactRecord);
                                                 
                                Ext.getCmp(id).reconfigure(Ext.getCmp(id).getStore(), Ext.getCmp(id).getColumnModel());
                                                 
                                Ext.getCmp(id).getTopToolbar().valueField.reset();
                                Ext.getCmp(id).getTopToolbar().contacttypeCombo.reset();
                            }
                        }
                    }
                },{
                    ref: '../removeBtn',
                    tooltip: bundle.getMsg('app.form.deleterow'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('table_row_delete'),
                    listeners: {
                        click: function(button, eventObject) {
                            var records = Ext.getCmp(id).getSelectionModel().getSelections();
                            Ext.getCmp(id).getStore().remove(records);
                        }
                    }
                }],
                listeners: {
                    activate: function(panel) {
                        if(permissions.indexOf('managecontacttype') == -1 && permissions.indexOf('managecontacttypeadd') == -1)
                            Ext.getCmp(id).getTopToolbar().contacttypeCombo.getTrigger(1).hide();
                    }
                }
            });
        },
        
        showWindow : function(animateTarget, hideApply, callback){
            window['ContacttypeApp'].window = App.showWindow(bundle.getMsg('contacttype.window.title'), 370, 230, window['ContacttypeApp'].formPanel, 
                function(button){
                    if(!button){
                        button = new Object;
                        button.id = window['ContacttypeApp'].window.submitBtn.id;
                    }
                
                    var records = window['ContacttypeApp'].gridPanel.getSelectionModel().getSelections();
							
                    window['ContacttypeApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            id: records[0] ? records[0].get('id'):''
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);
                            window['ContacttypeApp'].store.load({
                                params:{
                                    start: window['ContacttypeApp'].gridPanel.getBottomToolbar().cursor
                                }
                            });
                            
                            submitFormSuccessful('ContacttypeApp', form, action, button, !records[0], function(){
                                
                                }, callback);
                        },
                        failure: loadFormFailed
                    });
                
                }, 
                function(){
                    window['ContacttypeApp'].formPanel.getForm().reset();
                    window['ContacttypeApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },
        
        applySecurity : function(groups, permissions){
            window['ContacttypeApp'].gridPanel.addBtn.setVisible(permissions.indexOf('managecontacttype') != -1 || permissions.indexOf('managecontacttypeadd') != -1);
            window['ContacttypeApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('managecontacttype') != -1 || permissions.indexOf('managecontacttypeedit') != -1);
            window['ContacttypeApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('managecontacttype') != -1 || permissions.indexOf('managecontacttypedelete') != -1);            
        }
    }
}();

