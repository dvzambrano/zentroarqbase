
UserApp = function() {
    return {
        init : function(UserApp) {
			
            this.store = new Ext.data.GroupingStore({
                url: config.app_host + '/user/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0,
                    limit: config.app_elementsongrid
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                },
                groupField:'is_active'
            });
			
            this.comboStore = new Ext.data.Store({
                url: config.app_host + '/user/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('user.tab.label').toLowerCase());
                        for(var i = 0; i < records.length; i++){
                            records[i].set('picture', config.app_host+'/images/avatar.png');
                            if(!records[i].get('email_address') || records[i].get('email_address')=='') 
                                records[i].set('email_address', '&nbsp;&nbsp;&nbsp;');
                                
                            if(records[i].get('Person') && records[i].get('Person').picture && records[i].get('Person').picture !=''){
                                records[i].set('picture', records[i].get('Person').picture);
                            }
                        }
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
			
            this.personsComboStore = new Ext.data.Store({
                url: config.app_host + '/person/request/method/load',
                baseParams:{
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('user.tab.label').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.groupsMenu = new Ext.menu.Menu();
            this.groupsComboStore = new Ext.data.Store({
                url: config.app_host + '/user/request/method/load',
                baseParams:{
                    type: 'sfggroup',
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: function(store, records) { 
                        window['UserApp'].groupsMenu.removeAll();
                        
                        for (var i=0; i<records.length; i++)
                            window['UserApp'].groupsMenu.add({
                                text: records[i].get('description'),
                                listeners: {
                                    click: function(button) {
                                        var filters = window['UserApp'].gridPanel.filters.filters.items;
                                        filters[0].setValue(button.text);
                                        window['UserApp'].gridPanel.filters.getFilter('groups').setActive(true);
                                        window['UserApp'].gridPanel.filters.reload();   
                                    }
                                }
                            });
                            
                        window['UserApp'].groupsMenu.add('-');
                        window['UserApp'].groupsMenu.add({
                            text: bundle.getMsg('user.groups.all'),
                            listeners: {
                                click: function(button) {
                                    window['UserApp'].gridPanel.filters.clearFilters();
                                    Ext.fly(window['UserApp'].infoTextItem.getEl()).update('');
                                }
                            }
                        });
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });			
            this.selectedGroupsComboStore = new Ext.data.Store({
                url: config.app_host + '/user/request/method/load',
                baseParams:{
                    type: 'sfgusergroup',
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                    //alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
			
            this.permissionsComboStore = new Ext.data.Store({
                url: config.app_host + '/user/request/method/load',
                baseParams:{
                    type: 'sfgpermission',
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                    //alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });			
            this.selectedPermissionsComboStore = new Ext.data.Store({
                url: config.app_host + '/user/request/method/load',
                baseParams:{
                    type: 'sfguserpermission',
                    component: 'combo'
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                    //alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.entitiesComboStore = new Ext.data.Store({
                url: config.app_host + '/db/request/method/loadEntities',
                baseParams:{
                    component: 'combo'
                },
                method: 'POST',
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                    //alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
            this.selectedEntitiesComboStore = new Ext.data.Store({
                reader: new Ext.data.JsonReader()
            });
			
            this.stLDAPUsers = new Ext.data.Store({
                url: config.app_host + '/user/request/method/load',
                baseParams:{
                    component: 'grid',
                    start: 0
                },
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
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
                    dataIndex: 'groups'
                },{
                    type: 'string',
                    dataIndex: 'username'
                },{
                    type: 'string',
                    dataIndex: 'first_name'
                },{
                    type: 'string',
                    dataIndex: 'last_name'
                },{
                    type: 'string',
                    dataIndex: 'email_address'
                },{
                    type: 'date',
                    dataIndex: 'last_login',
                    beforeText: bundle.getMsg('app.languaje.find.beforethan'),
                    afterText: bundle.getMsg('app.languaje.find.afterthan'),
                    onText: bundle.getMsg('app.languaje.find.ondate'),
                    dateFormat: Date.patterns.NonISO8601Short
                },{
                    type: 'bool',
                    yesText: bundle.getMsg('app.form.yes'),
                    noText: bundle.getMsg('app.form.no'),
                    dataIndex: 'is_active'
                }]
            });

            this.infoTextItem = new Ext.Toolbar.TextItem('');
			
            this.gridPanel = new Ext.grid.GridPanel({
                id: 'gridPanelUser',
                region:'center',
                layout: 'fit', 
                iconCls: Ext.ux.Icon('user_gray'),
                title: config.app_showgridtitle ? bundle.getMsg("user.grid.title") : '',
                autoExpandColumn: 'usermaincolumn',
                store: this.store,
                loadMask: true,
                tools: [{
                    id:'print',
                    qtip: bundle.getMsg('app.languaje.report.printview'),
                    handler: function() {
                        App.printView(window['UserApp'].gridPanel);
                    }
                }],
                keys: [panelKeysMap],

                listeners: {
                    activate: function(gridpanel){
                        window['UserApp'].groupsComboStore.load();
                        gridpanel.getStore().load();
                    },
                    rowclick : function(grid, rowIndex, eventObject) {
                        var selectionModel = grid.getSelectionModel();
                        App.selectionChange(selectionModel);

                        var enabled = (App.isSuperAdmin() || App.isAdmin()) && selectionModel.getCount() == 1;
                        selectionModel.grid.changePasswordBtn.setDisabled(!enabled);
                    },
                    rowdblclick : function(grid, rowIndex, eventObject) {
                        if(grid.updateBtn && !grid.updateBtn.disabled && !grid.updateBtn.hidden)
                            grid.updateBtn.fireEvent('click', grid.updateBtn);
                    },
                    filterupdate: function(){
                        var text = App.getFiltersText(window['UserApp'].gridPanel);
                        if(text && text!=''){
                            Ext.fly(window['UserApp'].infoTextItem.getEl()).update(String.format(bundle.getMsg('app.form.filteringby'), text));
                            window['UserApp'].infoTextItem.getEl().highlight('#FFFF66', {
                                block:true
                            });
                        }
                        else
                            Ext.fly(window['UserApp'].infoTextItem.getEl()).update('');
                    }
                },
				
                columns: [{
                    header: bundle.getMsg('user.field.label'), 
                    width: 160, 
                    sortable: true, 
                    dataIndex: 'username'
                },{
                    header: bundle.getMsg('user.first.name'),
                    width: 150,
                    dataIndex: 'first_name'
                },{
                    header: bundle.getMsg('user.last.name'),
                    width: 250,
                    dataIndex: 'last_name'
                },{
                    id:'usermaincolumn', 
                    header: bundle.getMsg('app.form.email'), 
                    width: 270, 
                    sortable: true, 
                    dataIndex: 'email_address'
                },{
                    xtype: 'datecolumn', 
                    format: Date.patterns.NonISO8601Long1, 
                    header: bundle.getMsg('user.last.login'), 
                    width: 130, 
                    dataIndex: 'last_login'
                },{
                    xtype: 'booleancolumn', 
                    align: 'center', 
                    trueText: bundle.getMsg('app.form.yes'), 
                    falseText: bundle.getMsg('app.form.no'), 
                    header: bundle.getMsg('user.is.active'), 
                    width: 80, 
                    hidden: true, 
                    sortable: true, 
                    dataIndex: 'is_active'
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
                            window['UserApp'].gridPanel.getSelectionModel().clearSelections();
                            window['UserApp'].gridPanel.updateBtn.fireEvent('click', button, eventObject, hideApply, callback);
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
                                window['UserApp'].formPanel.passwordCollumn.setVisible(true);
                                var record = window['UserApp'].gridPanel.getSelectionModel().getSelected();
                                if (record){
                                    if (record.get('Person').picture && record.get('Person').picture != ''){
                                        try{
                                            Ext.getDom('userpicture').src = record.get('Person').picture;
                                        }catch(e){

                                        }
                                    }

                                    window['UserApp'].formPanel.passwordCollumn.setVisible(false);
                                    window['UserApp'].formPanel.getForm().loadRecord(record);
                                    var i, index;

                                    var groups = record.get('Groups');
                                    if(groups)
                                        for (i = 0; i < groups.length; i++){
                                            index = window['UserApp'].groupsComboStore.find('id', groups[i].id);
                                            if(index > -1){
                                                window['UserApp'].selectedGroupsComboStore.add(window['UserApp'].groupsComboStore.getAt(index));
                                                window['UserApp'].groupsComboStore.removeAt(index);
                                            }
                                        }

                                    var permissions = record.get('Permissions');
                                    if(permissions)
                                        for (i = 0; i < permissions.length; i++){
                                            index = window['UserApp'].permissionsComboStore.find('id', permissions[i].id);
                                            if(index > -1){
                                                window['UserApp'].selectedPermissionsComboStore.add(window['UserApp'].permissionsComboStore.getAt(index));
                                                window['UserApp'].permissionsComboStore.removeAt(index);
                                            }
                                        }
                                        
                                    if(config.multientityapp){
                                        var entities = record.get('Entities');
                                        if(entities)
                                            for (i = 0; i < entities.length; i++){
                                                index = window['UserApp'].entitiesComboStore.find('id', entities[i].id);
                                                if(index > -1){
                                                    window['UserApp'].selectedEntitiesComboStore.add(window['UserApp'].entitiesComboStore.getAt(index));
                                                    window['UserApp'].entitiesComboStore.removeAt(index);
                                                }
                                            }
                                    }
                                    if(record.get('is_active'))
                                        window['UserApp'].formPanel.activeRadioGroup.setValue(1);
                                    else
                                        window['UserApp'].formPanel.activeRadioGroup.setValue(2);
                                    
                                }
                                else
                                    window['UserApp'].formPanel.getForm().reset();
                                window['UserApp'].showWindow(button.getEl(), record ? 490 : 500, hideApply, callback);
                                App.mask.hide();
                            };

                            var stores = new Array();
                            stores.push(window['UserApp'].groupsComboStore);
                            stores.push(window['UserApp'].permissionsComboStore);
                            if(config.multientityapp)
                                stores.push(window['UserApp'].entitiesComboStore);
                            syncLoad(stores, finalFn);
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
											
                                            var records = window['UserApp'].gridPanel.getSelectionModel().getSelections();
											
                                            var array=new Array();
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
                                                        window['UserApp'].store.load({
                                                            params:{
                                                                start: window['UserApp'].gridPanel.getBottomToolbar().cursor
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
                },'-',{
                    ref: '../changePasswordBtn',
                    text: bundle.getMsg('user.password.window.title'),
                    disabled: true,
                    iconCls: Ext.ux.Icon('key'),
                    listeners: {
                        click: function(button) {
                            var record = window['UserApp'].gridPanel.getSelectionModel().getSelected();
                            if (record)
                                window['UserApp'].formPanelChangePassword.usernameField.setValue(record.get('username'));

                            var height = 240;
                            if (App.isSuperAdmin() || App.isAdmin()){
                                window['UserApp'].formPanelChangePassword.previowspasswordField.setVisible(false);
                                window['UserApp'].formPanelChangePassword.previowspasswordField.setDisabled(true);
                                height = 190;
                            }
                            else{
                                window['UserApp'].formPanelChangePassword.previowspasswordField.setVisible(true);
                                window['UserApp'].formPanelChangePassword.previowspasswordField.setDisabled(false);
                            }

                            window['UserApp'].showChangePasswordWindow(button.getEl(), height);
                        }
                    }
                },'->',{
                    ref: '../filtersBtn',
                    text: bundle.getMsg('app.form.applyfilters'),
                    iconCls: Ext.ux.Icon('table_gear'),
                    menu: this.groupsMenu
                },{
                    text: bundle.getMsg('user.import.fromldap'),
                    iconCls: Ext.ux.Icon('database_link'),
                    disabled: config.app_authmode != 'ldap' && config.app_authmode != 'mixed',
                    ref: '../importBtn',
                    listeners: {
                        click: function(button) {
                            App.mask.show();
                            new Ext.data.Connection().request({
                                method: 'POST',
                                url: config.app_host + '/user/request/method/getldapusers',
                                callback : function(options, success, response) {
                                    var results = Ext.decode(response.responseText);
                                    if(!results || !results.success){
                                        App.mask.hide();
                                        Ext.Msg.show({
                                            title:bundle.getMsg('app.msg.error.title'),
                                            msg: bundle.getMsg(results.message),
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.ERROR
                                        });
                                        return;
                                    }
                                    results = results.data;
                                    if (results.length > 0){
                                        for (var i=0; i<results.length; i++)
                                            window['UserApp'].stLDAPUsers.add(new Ext.data.Record({
                                                username: results[i].userName,
                                                firstname: results[i].firstName,
                                                lastname: results[i].lastName,
                                                email: results[i].email
                                            }));
                                        var sm = new Ext.grid.CheckboxSelectionModel();
                                        var grid = new Ext.grid.GridPanel({
                                            stripeRows: true,
                                            autoExpandColumn: 'usermaincolumn',
                                            store: window['UserApp'].stLDAPUsers,
                                            width: 580,
                                            height: 250,
                                            sm: sm,
                                            columns: [sm, {
                                                header: bundle.getMsg('user.field.label'), 
                                                width: 90, 
                                                sortable: true, 
                                                dataIndex: 'username'
                                            },{
                                                header: bundle.getMsg('user.first.name'), 
                                                width: 130, 
                                                sortable: true, 
                                                dataIndex: 'firstname'
                                            },{
                                                header: bundle.getMsg('user.last.name'), 
                                                width: 170, 
                                                sortable: true, 
                                                dataIndex: 'lastname'
                                            },{
                                                id:'usermaincolumn', 
                                                header: bundle.getMsg('app.form.email'), 
                                                sortable: true, 
                                                dataIndex: 'email'
                                            }]
                                        });

                                        function submitFn(button, eventObject, callback){
                                            var users = new Array();
                                            var records = grid.getSelectionModel().getSelections();
                                            if (records.length==0){
                                                Ext.Msg.show({
                                                    title:bundle.getMsg('app.msg.error.title'),
                                                    msg: 'Debe seleccionar al menos un usuario a importar desde el servidor LDAP',
                                                    buttons: Ext.Msg.OK,
                                                    icon: Ext.MessageBox.ERROR
                                                });
                                                return;
                                            }
                                            for (var i=0; i<records.length; i++)
                                                users.push(records[i].data);

                                            new Ext.data.Connection().request({
                                                url: config.app_host + '/user/request/method/importldapusers',
                                                params: {
                                                    users: Ext.encode(users)
                                                },
                                                callback : function(options, success, response) {
                                                    var object = Ext.util.JSON.decode(response.responseText);	
                                                    Ext.Msg.show({
                                                        title: bundle.getMsg('app.msg.info.title'),
                                                        msg: bundle.getMsg(object.message),
                                                        buttons: Ext.Msg.OK,
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                    window['UserApp'].store.load();
                                                    window['UserApp'].stLDAPUsers.removeAll();
                                                    window['UserApp'].window.hide();
                                                }
                                            });
                                        }

                                        function cancelFn(){
                                            window['UserApp'].stLDAPUsers.removeAll();
                                            window['UserApp'].window.hide();
                                        }

                                        window['UserApp'].window = App.showWindow(bundle.getMsg('user.ldap.window'), 620, 300, grid, 
                                            submitFn,
                                            cancelFn,
                                            button.getEl(),
                                            false,
                                            false,
                                            false,
                                            true);

                                        App.mask.hide();
                                    }
                                    else{
                                        App.mask.hide();
                                        Ext.Msg.show({
                                            title: bundle.getMsg('app.msg.error.title'),
                                            msg: bundle.getMsg('user.ldap.error.nouser'),
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.MessageBox.ERROR
                                        });
                                        return;
                                    }
                                }
                            });
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
                            window['UserApp'].gridPanel.filters.clearFilters();
                            Ext.fly(window['UserApp'].infoTextItem.getEl()).update('');
                            window['UserApp'].gridPanel.getSelectionModel().clearSelections();
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
                //if (record.get('editable')) 
                //return 'row-red';
                if (!record.get('deleteable')) 
                    return 'row-italic';
            };

            this.passwordTextField = new Ext.form.TextField({
                ref: '../../../../passwordField',
                fieldLabel: bundle.getMsg('app.form.password'),
                name: 'password',
                inputType: 'password',
                minLength: 5,
                anchor: '-20'
            });
            
            var activateMultiselectPanel = function(panel){
                window['UserApp'].formPanel.tabPanel.getTopToolbar().items.items[0].onTrigger1Click();
                window['UserApp'].formPanel.tabPanel.getTopToolbar().items.items[0].store = panel.items.items[0].multiselects[0].store;
            };

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
                        columnWidth:.20,
                        layout: 'form',
                        items: [{
                            items: [{
                                xtype: 'box',
                                autoEl: {
                                    tag: 'div',
                                    style: 'padding-bottom:20px',
                                    html: '<br/><img id="userpicture" src="'+config.app_host+'/images/avatar.png" width="100px" class="img-contact" style="cursor:pointer;border:1px solid 000" onclick="window[&#39;UserApp&#39;].prepareshowPictureForm(&#39;userpicture&#39;, &#39;web/uploads/avatars&#39;)" />'
                                }
                            }]
                        }]
                    },{
                        columnWidth:.8,
                        layout: 'form',
                        items: [{
                            layout:'column',
                            items:[{
                                columnWidth:.4,
                                layout: 'form',
                                items: [{
                                    xtype: 'textfield',
                                    name: 'first_name',
                                    maskRe: Date.patterns.LettersOnly,
                                    regex: Date.patterns.LettersOnly,
                                    anchor: '-20',
                                    allowBlank: false,
                                    fieldLabel: bundle.getMsg('user.first.name')+'<span style="color:red;"><sup>*</sup></span>'
                                }]
                            },{
                                columnWidth:.6,
                                layout: 'form',
                                items: [{
                                    xtype: 'textfield',
                                    name: 'last_name',
                                    maskRe: Date.patterns.LettersOnly,
                                    regex: Date.patterns.LettersOnly,
                                    anchor: '-20',
                                    allowBlank: false,
                                    fieldLabel: bundle.getMsg('user.last.name')+'<span style="color:red;"><sup>*</sup></span>'
                                }]
                            //                    },{
                            //                        columnWidth:.25,
                            //                        layout: 'form',
                            //                        items: [{
                            //                            xtype:'textfield',
                            //                            name: 'ipaddress',
                            //                            //maskRe: Date.patterns.IPRange,
                            //                            regex: Date.patterns.IPRange,
                            //                            anchor:'-20',
                            //                            allowBlank:false,
                            //                            fieldLabel: 'IP'+'<span style="color:red;"><sup>*</sup></span>'
                            //                        }]
                            }]
                        },{
                            layout: 'column',
                            items:[{
                                columnWidth:.4,
                                layout: 'form',
                                items: [{
                                    xtype: 'textfield',
                                    name: 'username',
                                    fieldLabel: bundle.getMsg('user.field.label')+'<span style="color:red;"><sup>*</sup></span>',
                                    anchor: '-20',
                                    minLength: 3,
                                    allowBlank:false,
                                    listeners: {
                                        blur: function(field) {
                                            if(field.isValid()){
                                                var records = window['UserApp'].gridPanel.getSelectionModel().getSelections();

                                                Ext.Ajax.request({
                                                    url: config.app_host + '/user/request/method/validate',
                                                    params : {
                                                        id: records[0]?records[0].get('id'):'',
                                                        username : field.getValue(),
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
                                columnWidth:.6,
                                layout: 'form',
                                items: [{
                                    xtype:'textfield',
                                    name: 'email_address',
                                    fieldLabel: bundle.getMsg('app.form.email'),
                                    regex: Date.patterns.Email,
                                    anchor:'-20',
                                    listeners: {
                                        blur: function(field) {
                                            if(field.isValid()){
                                                var records = window['UserApp'].gridPanel.getSelectionModel().getSelections();

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
                            }]
                        },{
                            ref: '../../passwordCollumn',
                            layout:'column',
                            items:[{
                                columnWidth:.5,
                                layout: 'form',
                                items: [this.passwordTextField]
                            },{
                                columnWidth:.5,
                                layout: 'form',
                                items: [{
                                    ref: '../../../../passwordconfirmField',
                                    xtype:'textfield',
                                    fieldLabel: bundle.getMsg('app.form.password.confirm'),
                                    name: 'passwordcfrm',
                                    vtype: 'password',
                                    inputType: 'password',
                                    minLength: 5,
                                    initialPassField: this.passwordTextField.id,
                                    anchor: '-20'
                                }]
                            }]
                        }]
                    }]
                },new Ext.TabPanel({
                    ref: 'tabPanel',
                    activeTab: 0,
                    anchor:'-20',
                    height:210,
                    plain:true,
                    defaults:{
                        autoScroll: true
                    },	
                    tbar:[new Ext.ux.form.SearchField({
                        width:280,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(field, e) {
                                field.onTrigger2Click();
                                return;
                            }
                        },
                        onTrigger1Click : function(){
                            if(this.hasSearch){
                                this.el.dom.value = '';
                                this.triggers[0].hide();
                                this.hasSearch = false;
                                
                                this.store.clearFilter();
                            }
                        },
                        onTrigger2Click : function(){
                            var v = this.getRawValue();
                            if(v.length < 1){
                                this.onTrigger1Click();
                                return;
                            }
                        
                            this.store.filter([{
                                property: window['UserApp'].formPanel.tabPanel.getActiveTab().items.items[0].multiselects[0].displayField,
                                value: v,
                                anyMatch: true,
                                caseSensitive: false
                            }]);
                            
                            this.hasSearch = true;
                            this.triggers[0].show();
                        }
                    })],
                    items:[{
                        title: bundle.getMsg('group.tab.label'),
                        iconCls: Ext.ux.Icon('group'),
                        bodyStyle:'padding:5px 5px 0',
                        items: [{
                            xtype: 'itemselector',
                            name: 'groups',
                            imagePath: './js/extjs/ux/images/',
                            multiselects: [{
                                width: 260,
                                height: 150,
                                store: this.groupsComboStore,
                                legend: bundle.getMsg('app.languaje.select.available'),
                                displayField: 'description',
                                valueField: 'id',
                                listeners:{
                                    render: window['UserApp'].renderGroupToolTip
                                }
                            },{
                                width: 260,
                                height: 150,
                                store: this.selectedGroupsComboStore,
                                legend: bundle.getMsg('app.languaje.select.selected'),
                                displayField: 'description',
                                valueField: 'id',
                                listeners:{
                                    render: window['UserApp'].renderGroupToolTip
                                }
                            }]
                        }],
                        listeners: {
                            activate: activateMultiselectPanel
                        }
                    },{
                        title: bundle.getMsg('permission.tab.label'),
                        iconCls: Ext.ux.Icon('key'),
                        bodyStyle:'padding:5px 5px 0',
                        items: [{
                            xtype: 'itemselector',
                            name: 'permissions',
                            imagePath: './js/extjs/ux/images/',
                            multiselects: [{
                                width: 260,
                                height: 150,
                                store: this.permissionsComboStore,
                                legend: bundle.getMsg('app.languaje.select.available'),
                                displayField: 'description',
                                valueField: 'id',
                                listeners:{
                                    render: window['UserApp'].renderPermissionToolTip
                                }
                            },{
                                width: 260,
                                height: 150,
                                store: this.selectedPermissionsComboStore,
                                legend: bundle.getMsg('app.languaje.select.selected'),
                                displayField: 'description',
                                valueField: 'id',
                                listeners:{
                                    render: window['UserApp'].renderPermissionToolTip
                                }
                            }]
                        }],
                        listeners: {
                            activate: activateMultiselectPanel
                        }
                    },{
                        title: bundle.getMsg('entity.tab.label'),
                        iconCls: Ext.ux.Icon('chart_organisation'),
                        disabled: !config.multientityapp,
                        bodyStyle:'padding:5px 5px 0',
                        items: [{
                            xtype: 'itemselector',
                            name: 'entities',
                            imagePath: './js/extjs/ux/images/',
                            multiselects: [{
                                width: 260,
                                height: 150,
                                store: this.entitiesComboStore,
                                legend: bundle.getMsg('app.languaje.select.available'),
                                displayField: 'name',
                                valueField: 'id',
                                listeners:{
                                    render: window['UserApp'].renderToolTip
                                }
                            },{
                                width: 260,
                                height: 150,
                                store: this.selectedEntitiesComboStore,
                                legend: bundle.getMsg('app.languaje.select.selected'),
                                displayField: 'name',
                                valueField: 'id',
                                listeners:{
                                    render: window['UserApp'].renderToolTip
                                }
                            }]
                        }],
                        listeners: {
                            activate: activateMultiselectPanel
                        }
                    }]
                }),{
                    ref: 'activeRadioGroup',
                    xtype: 'radiogroup',
                    fieldLabel: '',
                    labelSeparator: '',
                    width: 150,
                    items: [{
                        boxLabel: bundle.getMsg('user.is.inactive'), 
                        name: 'is_active', 
                        inputValue: 2
                    },{
                        boxLabel: bundle.getMsg('user.is.active'), 
                        name: 'is_active', 
                        inputValue: 1, 
                        checked: true
                    }]
                }]
            });
            
            var mainfield = new Ext.form.TextField({
                ref: 'newpasswordField',
                fieldLabel: bundle.getMsg('user.password.field.new')+'<span style="color:red;"><sup>*</sup></span>',
                name: 'password',
                inputType: 'password',
                anchor: '-20',
                allowBlank: false
            });
            this.formPanelChangePassword = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/user/request/method/changepassword',
                frame:true,
                bodyStyle:'padding:5px 5px 0',
                keys: [formKeyMaping],
                items: [{
                    ref: 'usernameField',
                    xtype:'hidden',
                    name: 'username',
                    fieldLabel: bundle.getMsg('user.field.label'),
                    anchor:'-20',
                    disabled:true
                },{
                    ref: 'previowspasswordField',
                    xtype:'textfield',
                    fieldLabel: bundle.getMsg('user.password.field.previows')+'<span style="color:red;"><sup>*</sup></span>',
                    name: 'passwordpreviows',
                    inputType: 'password',
                    anchor: '-20',
                    allowBlank: false
                }, mainfield,{
                    xtype:'textfield',
                    fieldLabel: bundle.getMsg('user.password.field.confirm')+'<span style="color:red;"><sup>*</sup></span>',
                    name: 'passwordcfrm',
                    vtype: 'password',
                    inputType: 'password',
                    initialPassField: mainfield.getId(),
                    anchor: '-20',
                    allowBlank: false
                }]
            });
            
            this.contactPanel = window['ContacttypeApp'].getPanelFor('user');

            this.formPanelEditProfile = new Ext.FormPanel({
                labelWidth: 75,
                labelAlign: 'top',
                url: config.app_host + '/user/request/method/save',
                frame: true,
                keys: [formKeyMaping],
                items: [new Ext.TabPanel({
                    activeTab: 0,
                    anchor: '-2',
                    height: 180,
                    plain: true,
                    defaults:{
                        autoScroll: true,
                        border: false
                    },			
                    items:[new Ext.Panel({
                        title: bundle.getMsg('app.form.generaldata'),
                        text: '<img src="'+config.app_host+'/images/icons/famfamfam/bullet_tick.png"/>',
                        bodyStyle:'padding:10px 10px 0',	
                        items:[{
                            layout:'column',
                            items:[{
                                columnWidth:.20,
                                layout: 'form',
                                items: [{
                                    items: [{
                                        xtype: 'box',
                                        autoEl: {
                                            tag: 'div',
                                            style: 'padding-bottom:20px',
                                            html: '<br/><img id="userprofilepicture" src="'+config.app_host+'/images/avatar.png" width="100px" class="img-contact" style="cursor:pointer;border:1px solid 000" onclick="window[&#39;UserApp&#39;].prepareshowPictureForm(&#39;userprofilepicture&#39;, &#39;web/uploads/avatars&#39;)" />'
                                        }
                                    }]
                                }]
                            },{
                                columnWidth:.8,
                                layout: 'form',
                                items: [{
                                    layout:'column',
                                    items:[{
                                        columnWidth:.4,
                                        layout: 'form',
                                        items: [{
                                            ref: '../../../../../../firstnameField',
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
                                        layout: 'form',
                                        items: [{
                                            ref: '../../../../../../lastnameField',
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
                                    layout:'column',
                                    items:[{
                                        columnWidth:1,
                                        layout: 'form',
                                        items: []
                                    }]
                                },{
                                    ref: '../../../../emailField',
                                    xtype:'textfield',
                                    name: 'email_address',
                                    fieldLabel: bundle.getMsg('app.form.email'),
                                    regex: Date.patterns.Email,
                                    anchor:'-20'
                                }]
                            }]
                        }]
                    }), this.contactPanel]
                })]
            });

        },

        evaluateValidation : function(response, field){
            var responseData = Ext.decode(response.responseText);
            var failureMessage = '';
            try{
                var obj = Ext.decode(responseData.message);
                if(obj.msg)
                    failureMessage = bundle.getMsg(obj.msg); 
                for(var i = 0; obj.params && i < obj.params.length; i++){
                    var msg = bundle.getMsg(obj.params[i]);
                    if(msg.indexOf('.undefined') > -1)
                        failureMessage = failureMessage.replace('{'+i+'}', obj.params[i]);
                    else
                        failureMessage = failureMessage.replace('{'+i+'}', msg);
                }
            }
            catch (e){}
            if(!responseData.success){
                Ext.Msg.show({
                    title: bundle.getMsg('app.msg.error.title'),
                    msg: failureMessage,
                    buttons: Ext.Msg.OK,
                    animEl: 'elId',
                    icon: Ext.MessageBox.ERROR
                });
                field.markInvalid();
            }
        },

        renderGroupToolTip : function(multiselect){
            new Ext.ToolTip({
                target: multiselect.el,
                renderTo: document.body,
                delegate: 'dl',
                anchor: 'top',
                anchorOffset: 85, // center the anchor on the tooltip
                trackMouse: true,
                width: 200,
                listeners: {
                    beforeshow: function(tip) {
                        var permissions = multiselect.view.getRecord(tip.triggerElement).get('Permissions');
                        var html = '';
                        for (var i = 0; permissions && i < permissions.length; i++)
                            html = html + permissions[i].description+'<br/>';

                        tip.body.dom.innerHTML = '<b>' + bundle.getMsg('permission.tab.label') + '</b><hr/>' + html;
                    }
                }
            });
        },
        renderPermissionToolTip : function(multiselect){
            new Ext.ToolTip({
                target: multiselect.el,
                renderTo: document.body,
                delegate: 'dl',
                anchor: 'top',
                anchorOffset: 85, // center the anchor on the tooltip
                trackMouse: true,
                width: 200,
                listeners: {
                    beforeshow: function(tip) {
                        tip.body.dom.innerHTML = '<b>' + multiselect.view.getRecord(tip.triggerElement).get('description') + '</b>';
                    }
                }
            });
        },
        renderToolTip : function(multiselect){
            new Ext.ToolTip({
                target: multiselect.el,
                renderTo: document.body,
                delegate: 'dl',
                anchor: 'top',
                anchorOffset: 85, // center the anchor on the tooltip
                trackMouse: true,
                width: 200,
                listeners: {
                    beforeshow: function(tip) {
                        tip.body.dom.innerHTML = '<b>' + multiselect.view.getRecord(tip.triggerElement).get('name') + '</b><hr/>' + multiselect.view.getRecord(tip.triggerElement).get('comment');
                    }
                }
            });
        },

        showChangePasswordWindow : function(animateTarget, height){
            window['UserApp'].window = App.showWindow(bundle.getMsg('user.password.window.title'), 370, height, window['UserApp'].formPanelChangePassword, 
                function (button){
                    if(!button){
                        button = new Object;
                        button.id = window['UserApp'].window.submitBtn.id;
                    }

                    var valid = window['UserApp'].formPanelChangePassword.getForm().isValid();
                    window['UserApp'].formPanelChangePassword.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            username: window['UserApp'].formPanelChangePassword.usernameField.getValue()
                        },
                        success: function(form, action) {
                            submitFormSuccessful('UserApp', form, action, button, true, function(){
                                
                                }, function(){
                                
                                });
                        },
                        failure: loadFormFailed
                    });
                    return valid;
                },
                function (){
                    window['UserApp'].formPanelChangePassword.getForm().reset();
                    window['UserApp'].formPanelChangePassword.previowspasswordField.setVisible(true);
                    window['UserApp'].formPanelChangePassword.previowspasswordField.setDisabled(false);
                    window['UserApp'].window.hide();
                },
                animateTarget,
                false,
                false,
                false,
                true);
        },

        showEditProfileWindow : function(animateTarget){
            window['UserApp'].window = App.showWindow(bundle.getMsg('user.profile.edit'), 600, 260, window['UserApp'].formPanelEditProfile, 
                function(){
                    var valid = window['UserApp'].formPanelEditProfile.getForm().isValid();
                    
                    var indexes = new Array();
                    var values = new Array();
                    
                    var contacts = new Array();
                    window['UserApp'].contactPanel.getStore().each(function(record){
                        contacts.push(record.data);
                    });                     
                    values.push(contacts);
                    indexes.push('contacts');
                    
                    window['UserApp'].formPanelEditProfile.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            app: 'frontend',
                            id: config.app_logueduserdata.id,
                            username: config.app_logueduserdata.username,
                            identification: config.app_logueduserdata.code,
                            picture : Ext.get('userprofilepicture').getAttribute('src'),
                            entities: config.app_entityid
                        },
                        success: function(form, action) {
                            var object = Ext.util.JSON.decode(action.response.responseText);
                            
                            new Ext.data.Connection().request({
                                url: config.app_host + '/person/request/method/save',
                                method: 'POST',
                                params: {
                                    id: object.data.id,
                                    comment: '',
                                    picture : Ext.get('userprofilepicture').getAttribute('src'),
                                    values: Ext.encode(values),
                                    indexes: Ext.encode(indexes)
                                },
                                callback: window['UserApp'].profileReset
                            });
                        },
                        failure: loadFormFailed
                    });
                    return valid;
                }, 
                function(){
                    window['UserApp'].formPanelEditProfile.getForm().reset();
                    window['UserApp'].window.hide();
                }, 
                animateTarget,
                false,
                false,
                false,
                true);
        },
        
        profileReset : function(){
            Ext.Msg.getDialog().on('beforehide', function() {
                window.parent.location = window.parent.location.href.replace('#', '');
            }, 
            this, {
                single:true
            }
            );
            Ext.Msg.show({
                title:bundle.getMsg('app.msg.info.title'),
                msg: bundle.getMsg('app.msg.info.editprofilesuccessful')+'<br/>'+bundle.getMsg('app.msg.warning.reloadpage.settings'),
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
        },
        
        prepareshowPictureForm : function(showInId, uploadTo){
            Ext.getCmp('picture').regex = Date.patterns.OnlyImagesAllowed;
            showPictureForm(showInId, uploadTo);
        },

        showWindow : function(animateTarget, height, hideApply, callback){
            if(!height || typeof height == 'object')
                height = 480;

            window['UserApp'].window = App.showWindow(bundle.getMsg('user.window.title'), 620, height, window['UserApp'].formPanel, 
                function (button){
                    if(!button){
                        button = new Object;
                        button.id = window['UserApp'].window.submitBtn.id;
                    }

                    var record = window['UserApp'].gridPanel.getSelectionModel().getSelected();
                    var valid = window['UserApp'].formPanel.getForm().isValid();

                    if (record){
                        window['UserApp'].formPanel.passwordField.reset();
                        window['UserApp'].formPanel.passwordconfirmField.reset();
                    }
							
                    window['UserApp'].formPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            id: record ? record.get('id') : '',
                            picture : Ext.get('userpicture').getAttribute('src')
                        },
                        success: function(form, action) {
                            checkSesionExpired(form, action);
                            window['UserApp'].store.load({
                                params:{
                                    start: window['UserApp'].gridPanel.getBottomToolbar().cursor
                                }
                            });
                            
                            submitFormSuccessful('UserApp', form, action, button, !record, function(){
                                document.getElementById('userpicture').src=config.app_host+'/images/avatar.png';
                                if(record && record.get('id') == config.app_logueduserdata.id)
                                    window['UserApp'].profileReset();
                            }, callback);
                        },
                        failure: loadFormFailed
                    });
                    return valid;
                },
                function (){
                    document.getElementById('userpicture').src=config.app_host+'/images/avatar.png';
                    window['UserApp'].formPanel.getForm().reset();
                    window['UserApp'].window.hide();
                },
                animateTarget,
                false,
                false,
                false,
                hideApply ? hideApply : false);
        },

        applySecurity : function(groups, permissions){
            window['UserApp'].gridPanel.addBtn.setVisible(permissions.indexOf('manageuser') != -1 || permissions.indexOf('manageuseradd') != -1);
            window['UserApp'].gridPanel.updateBtn.setVisible(permissions.indexOf('manageuser') != -1 || permissions.indexOf('manageuseredit') != -1);
            window['UserApp'].gridPanel.removeBtn.setVisible(permissions.indexOf('manageuser') != -1 || permissions.indexOf('manageuserdelete') != -1);
            window['UserApp'].gridPanel.changePasswordBtn.setVisible(permissions.indexOf('manageuser') != -1 || permissions.indexOf('manageuserchangepass') != -1);
            window['UserApp'].gridPanel.importBtn.setVisible(permissions.indexOf('manageuser') != -1 || permissions.indexOf('manageuserimportldap') != -1);
        }
    }
}();