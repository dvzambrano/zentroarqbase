/**
 * Codigo fuente generado por el SGArqBase: Plataforma de construcción de Sistemas.
 *
 * @package    SGArqBase
 * @subpackage person
 * @author     MSc. Donel Vázquez Zambrano
 * @version    1.0.0
 */

PersonApp = function() {
    return {
        init : function(PersonApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/user/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    entityid: config.app_entityid,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) {           
                        alertNoRecords(records, bundle.getMsg('person.tab.label').toLowerCase());
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
                id: 'gridPanelPerson',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('tag_orange'),
                title: config.app_showgridtitle ? bundle.getMsg("person.grid.title") : '',
                autoExpandColumn: 'personcolname',
                store: this.store,
                loadMask: true,
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['PersonApp'].gridPanel);
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
                        var text = App.getFiltersText(window['PersonApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['PersonApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['PersonApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['PersonApp'].infoTextItem.getEl()).update('');
                    }
                },
				
                columns: [new Ext.grid.RowNumberer(),{
                    header: bundle.getMsg('user.first.name'),
                    width: 150,
                    dataIndex: 'first_name'
                },{
                    header: bundle.getMsg('user.last.name'),
                    width: 250,
                    dataIndex: 'last_name'
                },{
                    id:'personcolname', 
                    header: bundle.getMsg('app.form.email'), 
                    width: 270, 
                    sortable: true, 
                    dataIndex: 'email_address'
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
                            window['PersonApp'].gridPanel.getSelectionModel().clearSelections();
                            window['PersonApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
                        }
                    }
                },{
                    ref: '../updateBtn',
                    text: bundle.getMsg('app.form.info'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('information'),
                    listeners: {
                        click: function(button, eventObject, hideApply, callback) {
                            var finalFn = function(){
                                var record = window['PersonApp'].gridPanel.getSelectionModel().getSelected();
                                if (record){
                                    window['PersonApp'].formPanel.getForm().loadRecord(record);
                                    
                                    if (record.get('Person').picture && record.get('Person').picture != ''){
                                        try{
                                            Ext.getDom('personpicture').src = record.get('Person').picture;
                                        }catch(e){

                                        }
                                    }
                                    
                                    window['PersonApp'].contactPanel.getStore().removeAll();
                                    if(record.get('Person') && record.get('Person') && record.get('Person').profile!=''){
                                        var profile = Ext.decode(record.get('Person').profile);
                                        for (var i = 0; profile && profile.contacts && i < profile.contacts.length; i++)
                                            window['PersonApp'].contactPanel.getStore().insert(window['PersonApp'].contactPanel.getStore().getCount(), new Ext.data.Record(profile.contacts[i]));
                                        window['PersonApp'].contactPanel.reconfigure(window['PersonApp'].contactPanel.getStore(), window['PersonApp'].contactPanel.getColumnModel());
                                    }
                                }
                                else
                                    window['PersonApp'].formPanel.getForm().reset();
                                window['PersonApp'].showWindow(button.getEl(), hideApply, callback);
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
                                            var records = window['PersonApp'].gridPanel.getSelectionModel().getSelections();
											
                                            var array = new Array();                                
                                            for (var i=0; i<records.length; i++)
                                                array.push(records[i].get('id'));
												
                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/user/request/method/delete',
                                                params: {
                                                    ids: Ext.encode(array)
                                                },
                                                failure: requestFailed,
                                                success: requestSuccessful,
                                                callback : function(options, success, response) {
                                                    var object = Ext.decode(response.responseText);
                                                    if(object.success){
                                                        window['PersonApp'].store.load({
                                                            params:{
                                                                start: window['PersonApp'].gridPanel.getBottomToolbar().cursor
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
                            window['PersonApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['PersonApp'].infoTextItem.getEl()).update('');
                            window['PersonApp'].gridPanel.getSelectionModel().clearSelections();
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
            
            this.contactPanel = window['ContacttypeApp'].getPanelFor('person');
			
            this.formPanel = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/user/request/method/save',
                frame:true,
                bodyStyle:'padding:5px 5px 0',
                keys: [formKeyMaping],
                items: [{
                    layout:'column',
                    items:[{
                        columnWidth:.8,
                        layout: 'form',
                        items: [{
                            layout:'column',
                            items:[{
                                columnWidth:.4,
                                layout: 'form',
                                items: [{
                                    xtype:'textfield',
                                    name: 'first_name',
                                    maskRe: Date.patterns.LettersOnly,
                                    regex: Date.patterns.LettersOnly,
                                    anchor:'-20',
                                    allowBlank:false,
                                    fieldLabel: bundle.getMsg('user.first.name')+'<span style="color:red;"><sup>*</sup></span>'
                                }]
                            },{
                                columnWidth:.6,
                                //                        columnWidth:.45,
                                layout: 'form',
                                items: [{
                                    xtype:'textfield',
                                    name: 'last_name',
                                    maskRe: Date.patterns.LettersOnly,
                                    regex: Date.patterns.LettersOnly,
                                    anchor:'-20',
                                    allowBlank:false,
                                    fieldLabel: bundle.getMsg('user.last.name')+'<span style="color:red;"><sup>*</sup></span>'
                                }]
                            }]
                        },{
                            ref: '../../emailField',
                            xtype:'textfield',
                            name: 'email_address',
                            fieldLabel: bundle.getMsg('app.form.email'),
                            regex: Date.patterns.Email,
                            anchor:'-20',
                            listeners: {
                                blur: function(field) {
                                    if(field.isValid()){
                                        var records = window['PersonApp'].gridPanel.getSelectionModel().getSelections();

                                        Ext.Ajax.request({
                                            url: config.app_host + '/user/request/method/validate',
                                            params : {
                                                id: records[0]?records[0].get('id'):'',
                                                email_address : field.getValue(),
                                                validate:'validate'
                                            },
                                            callback : function(options, success, response) {
                                                window['UserApp'].evaluateValidation(response, field);
                                            }
                                        }); 
                                    }
                                }
                            }
                        }]
                    },{
                        columnWidth:.20,
                        layout: 'form',
                        items: [{
                            items: [{
                                xtype: 'box',
                                autoEl: {
                                    tag: 'div',
                                    style: 'padding-bottom:20px',
                                    html: '<br/><img id="personpicture" src="'+config.app_host+'/images/avatar.png" width="80px" class="img-contact" style="cursor:pointer;border:1px solid 000" onclick="window[&#39;UserApp&#39;].prepareshowPictureForm(&#39;personpicture&#39;, &#39;web/uploads/avatars&#39;)" />'
                                }
                            }]
                        }]
                    }]
                }, new Ext.TabPanel({
                    activeTab: 0,
                    anchor:'-20',
                    height:190,
                    plain:true,
                    defaults:{
                        autoScroll: true
                    },			
                    items:[this.contactPanel]
                })]
            });
            
        },
        
        renderPerson : function(data, callback){
            data.generaldata = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+bundle.getMsg('piece.action.nodatatodisplay');
            if(data.comment && data.comment!='')
                data.generaldata = data.comment;
            if(callback){
                callback(data.generaldata);
            }
                
            return data;
        },
        
        showWindow : function(animateTarget, hideApply, callback){
            var resetFn = function(){
                window['PersonApp'].contactPanel.getStore().removeAll();
                document.getElementById('personpicture').src=config.app_host+'/images/avatar.png';
            };
            
            window['PersonApp'].window = App.showWindow(bundle.getMsg('person.window.title'), 570, 410, window['PersonApp'].formPanel, 
                function(button){
                    if(!button){
                        button = new Object;
                        button.id = window['PersonApp'].window.submitBtn.id;
                    }
                
                    var records = window['PersonApp'].gridPanel.getSelectionModel().getSelections();
                    
                    var indexes = new Array();
                    var values = new Array();
                    
                    var contacts = new Array();
                    window['PersonApp'].contactPanel.getStore().each(function(record){
                        contacts.push(record.data);
                    });                     
                    values.push(contacts)
                    indexes.push('contacts');
                    
							
                    window['PersonApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            app: 'frontend',
                            mail: window['PersonApp'].formPanel.emailField.getValue(),
                            entities: config.app_entityid,
                            id: records[0] ? records[0].get('id'):''
                        },
                        success: function(form, action) {
                            var object = Ext.util.JSON.decode(action.response.responseText);
                            
                            new Ext.data.Connection().request({
                                url: config.app_host + '/person/request/method/save',
                                method: 'POST',
                                params: {
                                    id: object.data.id,
                                    comment: '',
                                    picture : Ext.get('personpicture').getAttribute('src'),
                                    values: Ext.encode(values),
                                    indexes: Ext.encode(indexes)
                                },
                                callback : function(options, success, response) {
                                    //                                    var object = Ext.decode(response.responseText);
                                    
                                    checkSesionExpired(form, action);
                                    window['PersonApp'].store.load({
                                        params:{
                                            start: window['PersonApp'].gridPanel.getBottomToolbar().cursor
                                        }
                                    });
                                                 
                                    submitFormSuccessful('PersonApp', form, action, button, !records[0], resetFn, callback);
                                }
                            });
                        },
                        failure: loadFormFailed
                    });
                
                }, 
                function(){
                    resetFn();
                    window['PersonApp'].formPanel.getForm().reset();
                    window['PersonApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },
        
        applySecurity : function(groups, permissions){
            window['PersonApp'].gridPanel.addBtn.setVisible(permissions.indexOf('manageperson') != -1 || permissions.indexOf('managepersonadd') != -1);
            window['PersonApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('manageperson') != -1 || permissions.indexOf('managepersonedit') != -1);
            window['PersonApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('manageperson') != -1 || permissions.indexOf('managepersondelete') != -1);            
        }
    }
}();

