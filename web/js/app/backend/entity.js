/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage entity
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */

EntityApp = function() {
    return {
        init : function(EntityApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/entity/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: function(store, records) {           
                        alertNoRecords(records, bundle.getMsg('entity.tab.label').toLowerCase());                      
                    }
                }
            });
            
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/entity/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {           
                        alertNoRecords(records, bundle.getMsg('entity.tab.label').toLowerCase());
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
                id: 'gridPanelEntity',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('tag_orange'),
                title: config.app_showgridtitle ? bundle.getMsg("entity.grid.title") : '',
                autoExpandColumn: 'entitycolname',
                store: this.store,
                loadMask: true,
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['EntityApp'].gridPanel);
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
                        var text = App.getFiltersText(window['EntityApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['EntityApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['EntityApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['EntityApp'].infoTextItem.getEl()).update('');
                    }
                },
				
                columns: [new Ext.grid.RowNumberer(),{
                    header: bundle.getMsg('entity.field.name'), 
                    width: 160, 
                    sortable: true, 
                    dataIndex: 'name'
                },{
                    id:'entitycolname', 
                    header: bundle.getMsg('entity.field.comment'), 
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
                            window['EntityApp'].gridPanel.getSelectionModel().clearSelections();
                            window['EntityApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
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
                                
                            var finalFn = function(){
                                var record = window['EntityApp'].gridPanel.getSelectionModel().getSelected();
                                var i = 0; 
                                    
                                if (record){
                                    window['EntityApp'].formPanel.getForm().loadRecord(record);
                                    
                                    if (record.get('logo')&&record.get('logo')!='')
                                        try{
                                            Ext.getDom('logo').src = record.get('logo');
                                        }catch(e){ }
                                    
                                    if(record.get('images') && record.get('images')!='')
                                        App.addFiles(Ext.decode(record.get('images')), window['EntityApp'].imagesPanel);
                                    
                                    window['EntityApp'].contactPanel.getStore().removeAll();
                                    if(record.get('profile') && record.get('profile')!=''){
                                        var profile = Ext.decode(record.get('profile'));
                                        for (i = 0; profile && profile.contacts && i < profile.contacts.length; i++)
                                            window['EntityApp'].contactPanel.getStore().insert(window['EntityApp'].contactPanel.getStore().getCount(), new Ext.data.Record(profile.contacts[i]));
                                        window['EntityApp'].contactPanel.reconfigure(window['EntityApp'].contactPanel.getStore(), window['EntityApp'].contactPanel.getColumnModel());
                                    }
                                }
                                else
                                    window['EntityApp'].formPanel.getForm().reset();
                                    
                                window['EntityApp'].showWindow(button.getEl(), hideApply, callback);
                                App.mask.hide();
                            };
                            
                            finalFn();
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
                                            var records = window['EntityApp'].gridPanel.getSelectionModel().getSelections();
											
                                            var array = new Array();                                
                                            for (var i=0; i<records.length; i++)
                                                array.push(records[i].get('id'));
												
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/entity/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    var object = Ext.decode(response.responseText);
                                                    if(object.success){
                                                        window['EntityApp'].store.load({
                                                            params:{
                                                                start: window['EntityApp'].gridPanel.getBottomToolbar().cursor
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
                            window['EntityApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['EntityApp'].infoTextItem.getEl()).update('');
                            window['EntityApp'].gridPanel.getSelectionModel().clearSelections();
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
            
            this.imagesPanel = App.getFilesPanelFor('entity',  Date.patterns.OnlyImagesAllowed, 'images');
            
            this.contactPanel = window['ContacttypeApp'].getPanelFor('entity');
            
            this.expander = new Ext.ux.grid.RowExpander({
                enableCaching : false,
                tpl : new Ext.Template('\
                    <div style="width:100%;" class="x-grid3-row x-grid3-row-alt x-grid3-row-collapsed x-grid3-row-last">\
                       <table border="0" cellspacing="5" cellpadding="5" style="width:100%;" class="x-grid3-row-table">\
                          <tbody>{answer}</tbody>\
                       </table>\
                    </div>')
            });
            
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/entity/request/method/save',
                keys: [formKeyMaping],	
                border:false,
                items: [new Ext.TabPanel({
                    ref: 'tabPanel',
                    deferredRender: false,
                    height: 410,
                    defaults:{
                        autoHeight:false
                    }, 			
                    activeTab: 0,
                    border:false,
                    items:[{
                        ref: 'generalPanel',
                        title: bundle.getMsg('app.form.generaldata'),	
                        border:false,
                        bodyStyle: 'padding:5px',
                        items: [{
                            layout:'column',
                            border: false,
                            defaults:{
                                border:false
                            }, 	
                            items:[{
                                columnWidth:.8,
                                layout: 'form',
                                items: [{
                                    xtype:'textfield',
                                    name: 'name',
                                    fieldLabel: bundle.getMsg('entity.field.name')+'<span style="color:red;"><sup>*</sup></span>', 
                                    allowBlank: false,         
                                    maxLength: 130, 
                                    anchor:'-20'
                                }, {
                                    xtype:'textarea',
                                    name: 'comment',
                                    fieldLabel: bundle.getMsg('entity.field.comment'),    
                                    maxLength: 400, 
                                    height: 70,
                                    anchor:'-20'
                                }]
                            },{
                                border: false,
                                defaults:{
                                    border:false
                                },
                                columnWidth:.2,
                                layout: 'form',
                                items: [{
                                    items: [{
                                        xtype: 'box',
                                        autoEl: {
                                            tag: 'div',
                                            style: 'padding-bottom:20px',
                                            html: '<div style="width:100;text-align:center;">'+bundle.getMsg('entity.field.logo')+':</div><br/>\
                                                    <img id="logo" src="'+config.app_host+'/images/entity.png" width="100px" class="img-contact" style="cursor:pointer;border:1px solid 000" onclick="window[&#39;EntityApp&#39;].prepareshowPictureForm(&#39;logo&#39;, &#39;web/uploads/assets/logos&#39;, false, true, &#39;images/entity.png&#39;, true)" />'
                                        }
                                    }]
                                }]
                            }]
                        }]
                    }, this.contactPanel, this.imagesPanel]
                })]
            });
            
        },
        
        renderEntity : function(data, callback){
            data.generaldata = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+bundle.getMsg('piece.action.nodatatodisplay');
            if(data.comment && data.comment!='')
                data.generaldata = data.comment;
            if(callback){
                callback(data.generaldata);
            }
                
            return data;
        },
        
        prepareshowPictureForm : function(showInId, uploadTo, processFn, redefineName, resetImg, webcamDisabled){
            Ext.getCmp('picture').regex = Date.patterns.OnlyImagesAllowed;
            showPictureForm(showInId, uploadTo, processFn, redefineName, resetImg, webcamDisabled);
        },
        
        showWindow : function(animateTarget, hideApply, callback){
            var resetFn = function(){
                document.getElementById('logo').src = config.app_host+'/images/entity.png';
                window['EntityApp'].imagesPanel.items.items[0].getStore().removeAll();
                
                window['EntityApp'].contactPanel.getStore().removeAll();
            };
                            
            window['EntityApp'].window = App.showWindow(bundle.getMsg('entity.window.title'), 560, 260, window['EntityApp'].formPanel, 
                function(button){
                    if(!button){
                        button = new Object;
                        button.id = window['EntityApp'].window.submitBtn.id;
                    }
                
                    var records = window['EntityApp'].gridPanel.getSelectionModel().getSelections();
                    
                    var images = new Array();
                    for(var i = 0; i<window['EntityApp'].imagesPanel.items.items[0].getStore().getCount(); i++)
                        images.push(window['EntityApp'].imagesPanel.items.items[0].getStore().getAt(i).data);
                    
                    var indexes = new Array();
                    var values = new Array();
                    
                    var contacts = new Array();
                    window['EntityApp'].contactPanel.getStore().each(function(record){
                        contacts.push(record.data);
                    });                     
                    values.push(contacts);
                    indexes.push('contacts');
							
                    window['EntityApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            id: records[0] ? records[0].get('id'):'',
                            images: Ext.encode(images),
                            values: Ext.encode(values),
                            indexes: Ext.encode(indexes),
                            logo : document.getElementById('logo').src
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);
                            window['EntityApp'].store.load({
                                params:{
                                    start: window['EntityApp'].gridPanel.getBottomToolbar().cursor
                                }
                            });
                            
                            var object = Ext.util.JSON.decode(action.response.responseText);                            
                            for(var i = 0; config.app_entitys && i < config.app_entitys.length; i++)
                                if(config.app_entitys[i].id == object.data.id){
                                    config.app_entitys[i] = object.data;
                                    break;
                                }
                            
                            submitFormSuccessful('EntityApp', form, action, button, !records[0], resetFn, callback);
                        },
                        failure: loadFormFailed
                    });
                
                }, 
                function(){
                    resetFn();
                    window['EntityApp'].formPanel.getForm().reset();
                    window['EntityApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },
        
        applySecurity : function(groups, permissions){
            window['EntityApp'].gridPanel.addBtn.setVisible(permissions.indexOf('manageentity') != -1 || permissions.indexOf('manageentityadd') != -1);
            window['EntityApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('manageentity') != -1 || permissions.indexOf('manageentityedit') != -1);
            window['EntityApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('manageentity') != -1 || permissions.indexOf('manageentitydelete') != -1);
        }
    }
}();

