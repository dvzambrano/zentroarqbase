
App = function() {
    return {
        init : function(App) {
            config.app_host = config.app_host.replace(window.location.search, '');
            
            this.mask = new Ext.LoadMask(Ext.getBody(), {
                msg: bundle.getMsg('app.layout.loading')+'...'
            });
            
            this.providerStore = new Ext.data.Store({
                url: config.app_host + '/db/request/method/loadproviders',
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('install.serveraccess.providers').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });
            this.providerStore.load();

            this.databaseStore = new Ext.data.Store({
                url: config.app_host + '/db/request/method/loaddatabases',
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records, bundle.getMsg('install.databaseselection.databases').toLowerCase());
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.requirementsStore = new Ext.data.Store({
                url: config.app_host + '/admin/request/method/systemrequirements',
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                        App.systemRequirementsPanel.body.highlight('#FFFF66', {
                            block:true
                        });
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.eventsStore = new Ext.data.Store({
                url: config.app_host + '/db/request/method/loaddatabases',
                reader: new Ext.data.JsonReader(),
                listeners: {
                    load: config.app_showmessageonstoreloadsuccessful ? loadStoreSuccessful : function(store, records) { 
                        alertNoRecords(records);
                    },
                    loadexception: config.app_showmessageonstoreloadfailed ? loadStoreFailed : Ext.emptyFn
                }
            });

            this.northPabel = new Ext.Panel({
                region: 'north',
                minSize: 30,
                maxSize: 30,
                height: 30,
                collapsible: false,
                border: false,
                html: '<div id="customheader"><h1>'+bundle.getMsg('install.header.title')+'</h1></div>'
            }); 


            this.systemRequirementsPanel = new Ext.Panel({
                id: 'systemRequirementsPanel',
                iconCls: Ext.ux.Icon('computer'),
                title: bundle.getMsg('install.requirement.step'),
                width: 350,
                minSize: 350,
                maxSize: 350,
                autoScroll: true,
                tools: [{
                    id:'refresh',
                    qtip: bundle.getMsg('app.languaje.refresh.label'),
                    handler: function(){
                        App.containerPanel.getBottomToolbar().nextBtn.setDisabled(false);
                        App.requirementsStore.load();
                    }
                }],
                items: [new Ext.DataView(Ext.apply({
                    store: App.requirementsStore,
                    prepareData: function(data){
                        // formating MAC
                        if(data.name === 'sfSecurity::getServerUniqueINFO'){
                            data.name = '<hr/><b>' + data.data + '</b>';
                            data.value = '&nbsp;&nbsp;';

                            data.size = 12;
                            data.icon = './images/icons/famfamfam/text_horizontalrule.png';

                            return data;
                        }


                        data.size = 11;
                        data.icon = './images/icons/famfamfam/tick.png';

                        // disabling start wizard button
                        if(!App.containerPanel.getBottomToolbar().nextBtn.disabled)
                            App.containerPanel.getBottomToolbar().nextBtn.setDisabled(data.required && !data.value);


                        // formating value
                        if(typeof data.value != 'string')
                            if(!data.value){
                                data.icon = './images/icons/famfamfam/cross.png';
                                if(data.required)
                                    data.value = '<span style="color:red;">' + bundle.getMsg('app.form.no') + '</span>';
                                else
                                    data.value = '<span style="color:orange;">' + bundle.getMsg('app.form.no') + '</span>';
                            }
                            else
                            if(data.data && typeof data.data == 'string')
                                data.value = '<span style="color:green;">' + data.data + '</span>';
                            else
                                data.value = '<span style="color:green;">' + bundle.getMsg('app.form.yes') + '</span>';


                        data.name = bundle.getMsg(data.name);

                        return data;
                    },
                    listeners: {
                        render: function(dv) {
                            App.requirementsStore.load();
                        }
                    }
 
                }, {
                    tpl: '<tpl for=".">' +
                    '<table width="100%">' +
                    '<tr style="font-size:{size}px;">' +
                    '<td width="1%">&nbsp;</td>' +
                    '<td width="9%"><img src="{icon}" width="15px" /></td>' +
                    '<td width="75%"><span>{name}</span></td>' +
                    '<td width="15%"><span><div align="center"><b>{value}</b></div></span></td>' +
                    '</tr>' +
                    '</table>' +
                    '</tpl>',
                    selectedClass: 'item-selected',
                    cls: 'item-view',
                    overClass: 'item-over',
                    itemSelector: 'div.item-source',
                    singleSelect: true,
                    multiSelect: false
                }))]

            });

            this.dbProviderFormPanel = new Ext.FormPanel({
                title: bundle.getMsg('install.serveraccess.step'),
                iconCls: Ext.ux.Icon('database_key'),
                labelWidth: 75,
                labelAlign: 'top', 
                region: 'north',
                height: 170,
                minSize: 170,
                maxSize: 170,
                url: config.app_host + '/db/request/method/configuredatabase',
                defaults: {
                    border: false
                },
                bodyStyle:'padding:5px 5px 0',
                keys: [{
                    key: [Ext.EventObject.ENTER], 
                    handler: function(key, component) {
                        App.containerPanel.getBottomToolbar().nextBtn.fireEvent('click', App.containerPanel.getBottomToolbar().nextBtn);
                    }
                }],
                items: [{
                    layout:'column',
                    defaults: {
                        border: false
                    },
                    items:[{
                        columnWidth:.4,
                        layout: 'form',
                        items: [new Ext.form.ComboBox({
                            ref: '../../providerCombo', 
                            fieldLabel: bundle.getMsg('install.serveraccess.provider')+'<span style="color:red;"><sup>*</sup></span>', 
                            anchor:'-20',
                            store: this.providerStore,
                            listeners: {
                                focus: function(combo) {
                                    if(!combo.readOnly && !combo.disabled)
                                        combo.getStore().load();
                                }
                            },
                            valueField: 'id',
                            displayField: 'name',
                            typeAhead: true,
                            forceSelecction: true,
                            mode: 'local',
                            triggerAction: 'all',
                            selectOnFocus:true,
                            allowBlank: false,
                            emptyText: bundle.getMsg('app.form.select')
                        })]
                    },{
                        columnWidth:.6,
                        layout: 'form',
                        items: [{
                            ref: '../../serverField', 
                            xtype:'textfield',
                            name: 'server',
                            value: 'localhost',
                            fieldLabel: bundle.getMsg('install.serveraccess.server')+'<span style="color:red;"><sup>*</sup></span>', 
                            allowBlank: false,
                            anchor:'-20'
                        }]
                    }]
                },{
                    layout:'column',
                    defaults: {
                        border: false
                    },
                    items:[{
                        columnWidth:.4,
                        layout: 'form',
                        items: [{
                            xtype:'textfield',
                            ref: '../../usernameField', 
                            name: 'username',
                            value: 'root',
                            fieldLabel: bundle.getMsg('user.field.label')+'<span style="color:red;"><sup>*</sup></span>',
                            allowBlank:false,
                            anchor:'-20'
                        }]
                    },{
                        columnWidth:.6,
                        layout: 'form',
                        items: [{
                            xtype:'textfield',
                            fieldLabel: bundle.getMsg('install.serveraccess.password'),
                            ref: '../../userpasswordField', 
                            name: 'password',
                            inputType: 'password',
                            anchor: '-20'
                        }]
                    }]
                }],
                action: function() {
                    App.dbProviderFormPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        params: {
                            provider: App.dbProviderFormPanel.providerCombo.getValue()
                        },
                        success: function(form, action) { 
                            var object = Ext.util.JSON.decode(action.response.responseText);
                            if(object.success){
                                var msg = bundle.getMsg(object.message);
                                Ext.Base.msg('', msg);

                                App.wizardStep(1);

                                App.eventsStore.insert(0, new Ext.data.Record({
                                    icon: true,
                                    msg: (new Date()).format('h:i:s A')+': '+msg,
                                    details: false
                                }));
                            }
                        },
                        failure: function(form, action) { 
                            if(action.response && action.response.responseText != ''){
                                var object = Ext.util.JSON.decode(action.response.responseText);
                                var msg = bundle.getMsg(object.message);
                                Ext.Base.msg('', msg);

                                App.eventsStore.insert(0, new Ext.data.Record({
                                    icon: false,
                                    msg: (new Date()).format('h:i:s A')+': '+msg,
                                    details: object.data && object.data != '' ? object.data : false
                                }));

                                App.wizardStep(4);
                            }
                        }
                    });
                }
            });

            this.dbSelectorFormPanel = new Ext.FormPanel({
                title: bundle.getMsg('install.databaseselection.step'),
                iconCls: Ext.ux.Icon('database_save'),
                region:'center',
                labelWidth: 1,
                height: 160,
                url: config.app_host + '/db/request/method/createdatabase',
                fileUpload: true,
                defaults: {
                    border: false
                },
                bodyStyle:'padding:5px 5px 0',	
                keys: [{
                    key: [Ext.EventObject.ENTER], 
                    handler: function(key, component) {
                        App.containerPanel.getBottomToolbar().nextBtn.fireEvent('click', App.containerPanel.getBottomToolbar().nextBtn);
                    }
                }],
                items: [{
                    xtype: 'compositefield',
                    anchor: '-20',
                    fieldLabel: '',
                    labelSeparator: '',
                    items: [{
                        xtype: 'radio',
                        boxLabel: bundle.getMsg('install.databaseselection.existingdatabase') + ':', 
                        name: 'variant',
                        inputValue: 0, 
                        checked: true,
                        width: 105,
                        listeners: {
                            check: function(radio, checked){
                                App.dbSelectorFormPanel.databasenameField.setDisabled(checked);
                                if(checked)
                                    App.dbSelectorFormPanel.databasenameField.reset();
                            }
                        }
                    },new Ext.form.ComboBox({
                        ref: '../databasesCombo', 
                        flex: 1,
                        store: this.databaseStore,
                        listeners: {
                            focus: function(combo) {
                                combo.getStore().load({
                                    params: {
                                        provider: App.dbProviderFormPanel.providerCombo.getValue(),
                                        server: App.dbProviderFormPanel.serverField.getValue(),
                                        username: App.dbProviderFormPanel.usernameField.getValue(),
                                        password: App.dbProviderFormPanel.userpasswordField.getValue()
                                    }
                                });
                            }
                        },
                        valueField: 'id',
                        displayField: 'name',
                        typeAhead: true,
                        forceSelecction: true,
                        mode: 'local',
                        triggerAction: 'all',
                        selectOnFocus:true,
                        allowBlank: false,
                        emptyText: bundle.getMsg('app.form.select')
                    })]
                },{
                    xtype: 'compositefield',
                    anchor: '-20',
                    fieldLabel: '',
                    labelSeparator: '',
                    items: [{
                        ref: '../newDatabaseRadio', 
                        xtype: 'radio',
                        boxLabel: bundle.getMsg('install.databaseselection.newdatabase') + ':', 
                        name: 'variant', 
                        inputValue: 1, 
                        width: 115,
                        listeners: {
                            check: function(radio, checked){
                                App.dbSelectorFormPanel.databasesCombo.setDisabled(checked);
                                if(checked)
                                    App.dbSelectorFormPanel.databasesCombo.reset();
                            }
                        }
                    },{
                        ref: '../databasenameField', 
                        xtype:'textfield',
                        disabled: true,
                        name: 'ndatabase',
                        flex: 1
                    }]
                },{
                    xtype: 'textfield',
                    fieldLabel: '',
                    labelSeparator: '',
                    anchor: '-20',
                    name: 'picture',
                    id:'picture',
                    regex: /^.*.(sql|SQL)$/,
                    inputType: 'file',
                    allowBlank: false
                }]
            });

            this.registrationFormPanel = new Ext.FormPanel({
                region:'center',
                margins: '5 0 0 0',
                id: 'registrationFormPanel',
                title: bundle.getMsg('install.regitration.step'), 
                iconCls: Ext.ux.Icon('key'),
                labelWidth: 75,
                labelAlign: 'top', 
                region: 'south',
                height: 215,
                minSize: 215,
                maxSize: 215,
                url: config.app_host + '/admin/request/method/registersystem',
                defaults: {
                    border: false
                },
                bodyStyle:'padding:5px 5px 0',	
                keys: [{
                    key: [Ext.EventObject.ENTER], 
                    handler: function(key, component) {
                        App.registrationFormPanel.getBottomToolbar().nextBtn.fireEvent('click', App.registrationFormPanel.getBottomToolbar().nextBtn);
                    }
                }],
                items: [{
                    xtype:'textfield',
                    name: 'inbehalf',
                    fieldLabel: bundle.getMsg('app.form.inbehalf'),
                    anchor:'-20'
                },{
                    xtype:'textfield',
                    name: 'regcode',
                    fieldLabel: bundle.getMsg('app.form.code'),
                    allowBlank: false,
                    anchor:'-20'
                }],
                listeners: {
                    activate: function(panel) {
                        new Ext.data.Connection().request({
                            method: 'POST',
                            url: config.app_host+'/db/request/method/loadConfig',
                            //failure: requestFailed,
                            //success: requestSuccessful,
                            callback : function(options, success, response) {
                                config = Ext.decode(response.responseText);
                                                        
                                if(config.app_ismultientidable == 2){
                                    window['InstallApp'] = App;
                                    showValueForm('InstallApp', new Ext.form.ClearableCombo({
                                        store: new Ext.data.Store({
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
                                        }),
                                        valueField: 'id', 
                                        displayField: 'name',
                                        typeAhead: true,
                                        forceSelection: true,
                                        mode: 'local',
                                        triggerAction: 'all',
                                        selectOnFocus:true,
                                        fieldLabel: bundle.getMsg('install.databaseselection.entitythatismultientidablepivot')+'<span style="color:red;"><sup>*</sup></span>', 
                                        emptyText: bundle.getMsg('app.form.select'),
                                        allowBlank: false,
                                        triggerConfig: {
                                            tag:'span', 
                                            cls:'x-form-twin-triggers', 
                                            style:'padding-right:2px',
                                            cn:[{
                                                tag: "img", 
                                                src: Ext.BLANK_IMAGE_URL, 
                                                cls: "x-form-trigger"
                                            }]
                                        },
                                        anchor:'-20',
                                        listeners: {
                                            focus: function(combo) {
                                                if(!combo.readOnly && !combo.disabled){
                                                    combo.getStore().load();
                                                }
                                            }
                                        }
                                    }), function(form){
                                        var value = form.items.items[0].getValue();
                                        App.mask = new Ext.LoadMask(Ext.getBody(), {
                                            msg: bundle.getMsg('app.layout.loading')+'...'
                                        });
                                                                
                                        new Ext.data.Connection().request({
                                            method: 'POST',
                                            url: config.app_host + '/db/request/method/saveConfig',
                                            params: {
                                                config: '[{"name":"app_multientityid","value":"'+value+'"}]'
                                            },
                                            //failure: requestFailed,
                                            //success: requestSuccessful,
                                            callback : function(options, success, response) {
                                                App.mask.hide();
                                            }
                                        });
                                    },  Ext.getBody());
                                }
                            }
                        });
                    }
                },
                action: function() {
                    App.registrationFormPanel.getForm().submit({
                        waitTitle : bundle.getMsg('app.msg.wait.title'), 
                        waitMsg: bundle.getMsg('app.msg.wait.text'), 
                        clientValidation: true,
                        success: function(form, action) { 
                            var object = Ext.util.JSON.decode(action.response.responseText); 
                            if(object.success){
                                var msg = bundle.getMsg(object.message);
                                Ext.Base.msg('', msg);

                                App.eventsStore.insert(0, new Ext.data.Record({
                                    icon: true,
                                    msg: (new Date()).format('h:i:s A')+': '+msg,
                                    details: false
                                }));

                                Ext.Msg.getDialog().on('beforehide', function() {
                                    window.parent.location = config.app_host;
                                }, this, {
                                    single:true
                                });
                                msg = bundle.getMsg('install.complete.successful.explain');
                                Ext.Msg.show({
                                    title:bundle.getMsg('install.complete.successful'),
                                    msg: msg,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }
                        },
                        failure: function(form, action) { 
                            var object = Ext.util.JSON.decode(action.response.responseText);
                                    
                            var data = object.data && object.data != ''? object.data : '';
                            var msg = bundle.getMsg(object.message);
                                    
                            if(data && msg.indexOf('{0}')>-1){
                                msg = String.format(bundle.getMsg(object.message), data);
                                data = '';
                            }
                            App.eventsStore.insert(0, new Ext.data.Record({
                                icon: false,
                                msg: (new Date()).format('h:i:s A')+': '+msg,
                                details: data != '' ? data : false
                            }));


                            App.wizardStep(4);
                        }
                    });
                }
            });

            this.consolePanel = new Ext.Panel({
                region: 'south',
                height: 250,
                minSize: 250,
                collapsible: true,
                collapsed: true,
                collapseMode: 'mini',
                header: false,
                maxSize: 250,
                cmargins: '5 0 0 0',
                iconCls: Ext.ux.Icon('text_signature'),
                title: bundle.getMsg('install.console.title'),
                autoScroll: true,

                layout:'fit',
                items: [new Ext.DataView(Ext.apply({
                    store: App.eventsStore,
                    prepareData: function(data){
                        data.size = 12;

                        if(data.details)
                            data.details = '<tr style="font-size:11px;"><td colspan="3"><div style="width:100%"><div style="float:left;width:10%"></div><div style="float:right;width:90%">'+data.details+'</div></div></td></tr>';
                        else
                            data.details = '';

                        if(data.icon)
                            if(data.details!='')
                                data.icon = '<span style="color:orange;">' + bundle.getMsg('install.console.donesuccessful') + '</span>';
                            else
                                data.icon = '<span style="color:green;">' + bundle.getMsg('install.console.donesuccessful') + '</span>';
                        else
                            data.icon = '<span style="color:red;">' + bundle.getMsg('install.console.doneunsuccessful') + '</span>';


                        return data;
                    },
                    listeners: {
                        render: function(dv) {
                            App.requirementsStore.load();
                        }
                    }
 
                }, {
                    tpl: '<tpl for=".">' +
                    '<table width="100%">' +
                    '<tr style="font-size:{size}px;">' +
                    '<td width="1%">&nbsp;</td>' +
                    '<td width="85%"><span>{msg}</span></td>' +
                    '<td width="14%" style="vertical-align:top"><span><div align="center"><b>{icon}</b></div></span></td>' +
                    '</tr>{details}' +
                    '</table>' +
                    '</tpl>',
                    selectedClass: 'item-selected',
                    cls: 'item-view',
                    overClass: 'item-over',
                    itemSelector: 'div.item-source',
                    singleSelect: true,
                    multiSelect: false
                }))],
                tbar: ['->', {
                    ref: 'cleanBtn', 
                    iconCls: Ext.ux.Icon('textfield_rename'),
                    text: bundle.getMsg('install.console.clean'),
                    listeners: {
                        click: function() {
                            App.eventsStore.removeAll();
                            
                            App.consolePanel.body.dom.innerHTML = '';
                        }
                    }
                }]
            });

            //            new Ext.Viewport({
            //                layout:'border',
            //                defaults: {
            //                    split: true
            //                },
            //                items: [this.northPabel, this.contentPanel,this.systemRequirementsPanel, this.consolePanel]
            //            });
            
            this.containerPanel = new Ext.Panel({
                layout:'card',
                activeItem: 0, // index or id
                items: [this.systemRequirementsPanel, this.dbProviderFormPanel, {
                    layout:'border',
                    defaults: {
                        split: true,
                        bodyStyle: 'padding:15px'
                    },
                    items: [this.dbSelectorFormPanel, this.consolePanel],
                    action: function() {
                        App.dbSelectorFormPanel.getForm().submit({
                            waitTitle : bundle.getMsg('app.msg.wait.title'), 
                            waitMsg: bundle.getMsg('app.msg.wait.text'), 
                            clientValidation: true,
                            params: {
                                database: App.dbSelectorFormPanel.newDatabaseRadio.getValue() ? App.dbSelectorFormPanel.databasenameField.getValue() : App.dbSelectorFormPanel.databasesCombo.getValue(),
                                provider: App.dbProviderFormPanel.providerCombo.getValue(),
                                server: App.dbProviderFormPanel.serverField.getValue(),
                                username: App.dbProviderFormPanel.usernameField.getValue(),
                                password: App.dbProviderFormPanel.userpasswordField.getValue()
                            },
                            success: function(form, action) { 
                                var object = Ext.util.JSON.decode(action.response.responseText); 
                                
                                App.consolePanel.expand();
                                
                                var mask = App.mask;
                                App.mask = new Ext.LoadMask(App.dbSelectorFormPanel.getEl(), {
                                    msg: bundle.getMsg('app.layout.loading')+'...'
                                });
                                
                                App.containerPanel.getBottomToolbar().disable();
                                
                                var request = new XMLHttpRequest();
                                request.addEventListener('readystatechange', function (e) {
                                    App.mask.show();
                                    
                                    App.consolePanel.body.dom.innerHTML = this.response;
                                    
                                    var d = App.consolePanel.body.dom;
                                    d.scrollTop = d.scrollHeight - d.offsetHeight + 20;
                                    
                                    if(request.readyState == 4){
                                        App.mask.hide();
                                        App.mask = mask;
                                        
                                        App.containerPanel.getBottomToolbar().enable();
                                        
                                        App.wizardStep(1);
                                    }
                                });

                                var url = config.app_host + '/db.php?'+
                                'provider='+App.dbProviderFormPanel.providerCombo.getValue()+'&'+
                                'server='+App.dbProviderFormPanel.serverField.getValue()+'&'+
                                'username='+App.dbProviderFormPanel.usernameField.getValue()+'&'+
                                'password='+App.dbProviderFormPanel.userpasswordField.getValue()+'&'+
                                'directory='+object.data.directory+'&'+
                                'file='+object.data.file+'&';
                                if(App.dbSelectorFormPanel.newDatabaseRadio.getValue())
                                    url+='database='+App.dbSelectorFormPanel.databasenameField.getValue();
                                else
                                    url+='database='+ App.dbSelectorFormPanel.databasesCombo.getValue();
                            
                                request.open('get', url);
                                request.send();
                        
                            },
                            failure: function(form, action) { 
                                var object = Ext.util.JSON.decode(action.response.responseText);
                                var msg = bundle.getMsg(object.message);

                                App.eventsStore.insert(0, new Ext.data.Record({
                                    icon: false,
                                    msg: (new Date()).format('h:i:s A')+': '+msg,
                                    details: object.data && object.data != '' ? object.data : false
                                }));


                                App.wizardStep(4);
                            }
                        });
                    }
                },
                this.registrationFormPanel],
                bbar: ['->', {
                    ref: 'previousBtn', 
                    iconCls: Ext.ux.Icon('control_start_blue'),
                    text: bundle.getMsg('app.form.previous'),
                    hidden: true,
                    listeners: {
                        click: function() {
                            App.wizardStep(-1);
                        }
                    }
                },{
                    ref: 'nextBtn', 
                    iconCls: Ext.ux.Icon('control_end_blue'),
                    text: bundle.getMsg('app.form.next'),
                    listeners: {
                        click: function() {
                            App.containerPanel.getBottomToolbar().ignoreBtn.setVisible(false);
                            if(App.containerPanel.getLayout().activeItem.action)
                                App.containerPanel.getLayout().activeItem.action();
                            else
                                App.wizardStep(1);
                        //                            if(App.containerPanel.getLayout().activeItem.id != 'registrationFormPanel')
                        //                                App.wizardStep(1, );
                        //                            else
                        //                            {
                        //                            //hacer el finalizar
                        //                            }
                        }
                    }
                },{
                    ref: 'ignoreBtn', 
                    iconCls: Ext.ux.Icon('control_end_blue'),
                    text: bundle.getMsg('install.console.next'),
                    hidden: true,
                    listeners: {
                        click: function() {
                            App.containerPanel.getBottomToolbar().ignoreBtn.setVisible(false);
                            App.wizardStep(1);
                        }
                    }
                }]
            });
                
            new Ext.Viewport({
                layout:'fit',
                border: false,
                items: [this.containerPanel],
                listeners: {
                    afterrender: function(viewport) {
                        var step = window.location.search.replace('?step=', '');
                        
                        // special step: export db
                        if(step != '' && !parseInt(step)){
                            App.containerPanel.setVisible(false);
                            
                            switch(step){
                                case 'export':
                                    exportDbFn();
                                    break;
                                default:
                                    break;
                            }
                            
                            return;
                        }
                
                        if(step == '')
                            step = 0;
                        else
                            step = parseInt(step);
                
                        App.navigationStep = 0;

                        App.navigationList = new Array();
                        App.navigationList.push(App.systemRequirementsPanel);
                        App.navigationList.push(App.dbProviderFormPanel);
                        App.navigationList.push(App.dbSelectorFormPanel);
                        App.navigationList.push(App.registrationFormPanel);
                        App.navigationList.push(App.consolePanel);

                        App.wizardStep(step);
                
                        if(step == 3)
                            App.containerPanel.getBottomToolbar().previousBtn.setVisible(false);
                    }
                }
            });

        },

        wizardStep: function(step) { 
            if(step != 4){
                App.navigationStep = App.navigationStep + step;
                step = App.navigationStep;
            }
           
            App.containerPanel.getLayout().setActiveItem(step); 
            App.containerPanel.getBottomToolbar().previousBtn.setVisible(App.containerPanel.getLayout().activeItem.id != 'systemRequirementsPanel');
            
            if(App.containerPanel.getLayout().activeItem.id == 'registrationFormPanel')
                App.containerPanel.getBottomToolbar().nextBtn.setText(bundle.getMsg('app.form.finish'));
            else
                App.containerPanel.getBottomToolbar().nextBtn.setText(bundle.getMsg('app.form.next'));
        },
        
        showWindow : function(title, width, height, items, acceptFn, cancelFn, animateTarget, manageable, printFn, menuConfig, hideApply, afterShow){
            return showWindow(title, width, height, items, acceptFn, cancelFn, animateTarget, manageable, printFn, menuConfig, hideApply, afterShow);
        }
    }
}();



var config, bundle;
var params = Ext.urlDecode(window.location.search.substring(1));


config = new Object;		
config.app_defaultlanguaje = 'es-Es';
config.app_host = window.parent.location.href.replace('#', '').replace('install.php', '');

var languaje = config.app_defaultlanguaje;
Ext.Ajax.request({
    url: String.format('js/extjs/locale/ext-lang-{0}.js', languaje.substring(0, languaje.indexOf('-'))),
    success: function(response) {
        eval(response.responseText);
    },
    scope: this 
});


bundle = new Ext.i18n.Bundle({
    bundle:'languaje', 
    path: 'languajes', 
    lang: languaje
});
bundle.onReady(function(){
    App.init(App);
});