Ext.onReady(function(){
    Ext.MessageBox.progress('Por favor espere...', 'Cargando el contexto del sistema', 'Inicializando...');
});
 
App = function() {
    return {
        init : function(App) {


            this.mask = new Ext.LoadMask(Ext.getBody(), {
                msg: bundle.getMsg('app.layout.loading')+'...'
            });
			
            this.clock = new Ext.Toolbar.TextItem('');

            this.northPabel = new Ext.Panel({
                region: 'north',
                minSize: 75,
                maxSize: 250,
                collapsible: false,
                border: false,
                html: '<div id="customheader"><h1>'+config.app_banner+'</h1></div>',
                bbar: [{
                    text: '',
                    iconCls: Ext.ux.Icon('date')
                }, this.clock, '->','-', bundle.getMsg('user.field.label')+':',{
                    text: Ext.util.Format.capitalize(config.app_logueduserdata.username),
                    iconCls: Ext.ux.Icon('user_suit'),
                    menu : {
                        items: [{
                            text: bundle.getMsg('user.profile'),
                            iconCls: Ext.ux.Icon('award_star_bronze_3'),
                            listeners: {
                                click: function() {
                                    App.mask.show();

                                    App.mask.hide();
                                }
                            }
                        },{
                            iconCls: Ext.ux.Icon('key'),
                            text: bundle.getMsg('user.password.window.title'),
                            listeners: {
                                click: function(button) {
                                    window['UserApp'].showChangePasswordWindow(button.getEl(), 240);
                                }
                            }
                        },'-',{
                            iconCls: Ext.ux.Icon('door_in'),
                            text: bundle.getMsg('app.layout.topbar.usermenu.closesesion'),
                            listeners: {
                                click: function() {
                                    window.location.href = 'logout.php';
                                }
                            }
                        }]
                    }
                }, '-', 
                bundle.getMsg('app.layout.topbar.languajeselector.label')+':', 
                new Ext.ux.LanguageCycleButton({
                    id: 'LanguageCycleButton',			 
                    languageItems:[{
                        id: 'es-Es', 
                        language: 'es-Es', 
                        charset: 'utf-8', 
                        text: bundle.getMsg('app.layout.topbar.languajeselector.item.spanish'), 
                        checked: true, 
                        iconCls: Ext.ux.Icon('flag_es')
                    },{
                        id: 'en-En', 
                        language: 'en-En', 
                        charset: 'ascii', 
                        text: bundle.getMsg('app.layout.topbar.languajeselector.item.english'), 
                        iconCls: Ext.ux.Icon('flag_gb')
                    }],
                    changeHandler: function(o, i){
                        if(i.id != config.app_logueduserdata.profile.languaje){
                            App.mask.msg = 'Guardando perfil';
                            App.mask.show();
                            new Ext.data.Connection().request({
                                url: config.app_host + '/db/request/method/saveprofile',
                                params: {
                                    languaje: i.id
                                },
                                method: 'POST',
                                callback : function(options, success, response) {
                                    Ext.Msg.getDialog().on('beforehide', function() {
                                        window.parent.location = window.parent.location;
                                    }, 
                                    this, {
                                        single:true
                                    }
                                    );
                                    App.mask.hide();
                                    Ext.Msg.show({
                                        title:bundle.getMsg('app.msg.info.title'),
                                        msg: bundle.getMsg('app.msg.info.savedsuccessful')+'<br/>'+bundle.getMsg('app.msg.warning.reloadpage'),
                                        buttons: Ext.Msg.OK,
                                        icon: Ext.MessageBox.WARNING
                                    });
                                }
                            }); 
                        }
                        if(Ext.state.Manager.getProvider()) {
                            Ext.state.Manager.set(this.languageVar, i.language);
                        }
                    }
                }),'-', bundle.getMsg('app.layout.topbar.themeselector.label')+':', 
                new Ext.ux.ThemeCycleButton({
                    id: 'ThemeCycleButton',
                    cssItems:[{
                        id: 'blue', 
                        file: 'xtheme-blue.css', 
                        text: bundle.getMsg('app.layout.topbar.themeselector.item.blue'), 
                        iconCls: Ext.ux.Icon('color_blue'), 
                        checked: true
                    },{
                        id: 'gray', 
                        file: 'xtheme-gray.css', 
                        text: bundle.getMsg('app.layout.topbar.themeselector.item.gray'), 
                        iconCls: Ext.ux.Icon('color_gray')
                    },{
                        id: 'slickness', 
                        file: 'xtheme-slickness.css', 
                        text: bundle.getMsg('app.layout.topbar.themeselector.item.black'), 
                        iconCls: Ext.ux.Icon('color_black')
                    }],
                    changeHandler: function(o, i){
                        if(!config.app_logueduserdata || !config.app_logueduserdata.profile || i.id != config.app_logueduserdata.profile.theme){
                            new Ext.data.Connection().request({
                                url: config.app_host + '/db/request/method/saveprofile',
                                params: {
                                    theme: i.id
                                },
                                method: 'POST',
                                callback : function(options, success, response) {

                                }
                            });
                        }

                        if(Ext.state.Manager.getProvider()) {
                            Ext.state.Manager.set(this.themeVar, i.file);
                        }
                        Ext.util.CSS.swapStyleSheet(this.themeVar, this.cssPath + i.file);
							
                        var frames = document.getElementsByTagName('iframe');
                        for (var j = 0; j < frames.length && frames[j].contentWindow.Ext; j++){
                            if (frames[j].contentWindow.document.baseURI.indexOf('calendar/')==-1)
                                frames[j].contentWindow.Ext.util.CSS.swapStyleSheet(this.themeVar, this.cssPath + i.file);
                            else
                                frames[j].contentWindow.Ext.util.CSS.swapStyleSheet(this.themeVar, '../'+this.cssPath + i.file);
                        }
                    }
                }),{
                    text: bundle.getMsg('app.layout.help'),
                    iconCls: Ext.ux.Icon('help'),
                    menu : {
                        items: [{
                            text: bundle.getMsg('app.layout.about'),
                            listeners: {
                                click: function() {

                                }
                            }
                        }]
                    }
                }],

                listeners: {
                    render: {
                        fn: function(){
                            Ext.TaskMgr.start({
                                run: function(count){
                                    Ext.fly(App.clock.getEl()).update(new Date().format(Date.patterns.FullDateTime));
                                },
                                interval: 1000
                            });
                        },
                        delay: 100
                    }
                }
            });


            this.westPanel = {
                region:'west',
                collapsible: true,
                collapseMode: 'mini',
                header: false,
                width: 220,
                minSize: 220,
                maxSize: 220,
                split: true,
                html:'menu',
				
                listeners:{
                    collapse: function(){
                        Ext.get('leftLogo').hide();
                    },					
                    expand: function(){
                        Ext.get('leftLogo').show();
                    }
                }
            };


            this.movePreview = function(m, pressed){
                if(!m){ // cycle if not a menu item click
                    var items = Ext.menu.MenuMgr.get('reading-menu').items.items;
                    var b = items[0], r = items[1], h = items[2];
                    if(b.checked){
                        r.setChecked(true);
                    }else if(r.checked){
                        h.setChecked(true);
                    }else if(h.checked){
                        b.setChecked(true);
                    }
                    return;
                }
                if(pressed){
                    var preview = App.preview;
                    var right = Ext.getCmp('right-preview');
                    var bot = Ext.getCmp('bottom-preview');
                    var btn = App.grid.getTopToolbar().items.get(2);
                    switch(m.text){
                        case 'Bottom':
                            right.hide();
                            bot.add(preview);
                            bot.show();
                            bot.ownerCt.doLayout();
                            //btn.setIconClass('preview-bottom');
                            break;
                        case 'Right':
                            bot.hide();
                            right.add(preview);
                            right.show();
                            right.ownerCt.doLayout();
                            //btn.setIconClass('preview-right');
                            break;
                        case 'Hide':
                            preview.ownerCt.hide();
                            preview.ownerCt.ownerCt.doLayout();
                            //btn.setIconClass('preview-hide');
                            break;
                    }
                }
            };



            this.grid = new Ext.SgArqBase.FeedGrid(this, {
                tbar:[{
                    split:true,
                    text:'Reading Pane',
                    tooltip: {
                        title:'Reading Pane',
                        text:'Show, move or hide the Reading Pane'
                    },
                    iconCls: 'preview-bottom',
                    handler: App.movePreview.createDelegate(this, []),
                    menu:{
                        id:'reading-menu',
                        cls:'reading-menu',
                        width:100,
                        items: [{
                            text:'Bottom',
                            checked:true,
                            group:'rp-group',
                            checkHandler:App.movePreview,
                            scope:this,
                            iconCls:'preview-bottom'
                        },{
                            text:'Right',
                            checked:false,
                            group:'rp-group',
                            checkHandler:App.movePreview,
                            scope:this,
                            iconCls:'preview-right'
                        },{
                            text:'Hide',
                            checked:false,
                            group:'rp-group',
                            checkHandler:App.movePreview,
                            scope:this,
                            iconCls:'preview-hide'
                        }]
                    }
                }]
            });

            this.preview = new Ext.Panel({
                id: 'preview',
                region: 'south',
                cls:'preview',
                autoScroll: true,
                //listeners: FeedViewer.LinkInterceptor,

                tbar: [{
                    id:'tab',
                    text: 'View in New Tab',
                    iconCls: 'new-tab',
                    disabled:true,
                    scope: this
                }],

                clear: function(){
                    this.body.update('');
                    var items = this.topToolbar.items;
                    items.get('tab').disable();
                }
            });

            this.centerPanel = {
                id: 'centerPanel',
                layout:'border',
                activeItem: 0,
                region: 'center',
                border: false,
                items:[App.grid, {
                    id:'bottom-preview',
                    layout:'fit',
                    items:App.preview,
                    height: 250,
                    split: true,
                    border:false,
                    region:'south'
                }, {
                    id:'right-preview',
                    layout:'fit',
                    border:false,
                    region:'east',
                    width:350,
                    split: true,
                    hidden:true
                }]
            };

            this.adminPanel = new Ext.Panel({
                layout:'border',
                border: false,
                items: [this.westPanel, this.centerPanel]
            });

            this.contentPanel = {
                id: 'contentPanel',
                region:'center',
                margins: '0 0 0 0',
                border: false,
                defaults: {
                    border: false
                },
                layout: 'card',
                activeItem: 0,
                items: [this.adminPanel]
            };
			
            new Ext.Viewport({
                layout:'border',
                defaults: {
                    split: true
                },
                items: [this.northPabel, this.contentPanel]
            });

            var xposition = 30;
            var yposition = screen.height - 200;
            new Ext.Panel({
                x: xposition,
                y: yposition,
                renderTo: Ext.getBody(),
                baseCls: 'transparentBg',
                floating: true,
                border: false,
                shadow: false,
                html: '<img id="leftLogo" hidden="hidden" src="'+base64logo+'" width=150 title="'+config.app_name+'"/>',
                width: 155,
                height: 50
            }).show(); 

			
        },
		
        setConfig : function(languaje, theme){

        },

        applySecurity : function(groups, permissions){

        },

        showWindow : function(title, width, height, items, acceptFn, cancelFn, animateTarget, printFn, menuConfig){

        }
    }
}();