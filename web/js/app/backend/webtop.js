Ext.onReady(function(){
    Ext.MessageBox.progress('Por favor espere...', 'Cargando el contexto del sistema', 'Inicializando...');
});
 
App = function() {
    return {
        init : function(App) {

            this.mask = new Ext.LoadMask(Ext.getBody(), {
                msg: bundle.getMsg('app.layout.loading')+'...'
            });

            this.Module = Ext.extend(Ext.app.Module, {});

            this.WebTop = new Ext.app.App({
                // config for the start menu
                getStartConfig : function(){
                    return {
                        title: config.app_logueduserdata.first_name+' '+config.app_logueduserdata.last_name,
                        iconCls: Ext.ux.Icon('user_suit'), 
                        height: 350,
                        toolItems: [{
                            text: bundle.getMsg('app.layout.topbar.usermenu.effects'),
                            iconCls: Ext.ux.Icon('wtop-effects'),
                            scope:this,
                            handler: function(){
                                window.location.href = 'logout.php';
                            }
                        },'-',{
                            text: bundle.getMsg('app.layout.topbar.usermenu.closesesion'),
                            iconCls: Ext.ux.Icon('wtop-logout.php'),
                            scope:this,
                            handler: function(){
                                window.location.href = 'logout.php';
                            }
                        }]
                    };
                },

                getModules : function(callback, reference){
                    App.mask = new Ext.LoadMask(Ext.getBody(), {
                        msg: 'Conformando opciones de usuario...'
                    });
                    App.mask.show();

                    new Ext.data.Connection().request({
                        url: 'module/request/method/load',
                        params: {
                            component:'grid',
                            userid: config.app_logueduserdata.id
                        },
                        method: 'POST',
                        callback : function(options, success, response) {
                            App.mask.hide();
                            App.mask = new Ext.LoadMask(Ext.getBody(), {
                                msg: bundle.getMsg('app.layout.loading')+'...'
                            });


                            var html = '';

                            var obj = Ext.decode(response.responseText); 
                            var modules = new Array();

                            for(var i = obj.data.length-1; i >= 0; i--){ 
                                modules.push(new App.Module({
                                    id: 'mdl-'+obj.data[i].id,
                                    init : function(){
                                        this.launcher = {
                                            text: obj.data[i].name,
                                            cls: obj.data[i].nick,
                                            tooltip: {
                                                text:obj.data[i].comment, 
                                                title:obj.data[i].dependencies
                                            },
                                            iconCls: Ext.ux.Icon(obj.data[i].customicon),
                                            handler: function(btn){
                                                this.createWindow(btn.initialConfig.scope.id, btn.initialConfig.cls, btn.initialConfig.text, btn.initialConfig.tooltip.text, btn.initialConfig.iconCls.replace('icon-',''), btn.initialConfig.tooltip.title);
                                            } ,
                                            scope: this
                                        }
                                    },
                                    createWindow : function(id, nick, name, comment, customicon, dependencies){
                                        var desktop = this.app.getDesktop();

                                        var node = new Object;
                                        node.text = name;
                                        node.nick = nick;
                                        node.comment = comment;
                                        node.customicon = customicon;
                                        node.attributes = new Object;
                                        node.attributes.dependencies = dependencies;

                                        var win = desktop.getWindow(id);
                                        if(!win){
                                            win = desktop.createWindow({
                                                id: 'mdl-'+id,
                                                title: comment,
                                                width:740,
                                                height:480,
                                                iconCls: Ext.ux.Icon(customicon),
                                                shim:false,
                                                animCollapse:false,
                                                constrainHeader:true,
                                                layout:'fit'
                                            });
                                        }

                                        var fn = function(){
                                            win.show();
                                        };
                                        activateContainer(node, win, fn);
                                    }
                                }));
                                var moduleid = obj.data[i].customicon.replace('wtop-', '');
                                if(moduleid!=''){
                                    moduleid +='-shortcut';
                                    html += '<div style="margin:5px; float:left;"><dl id="x-shortcuts">\
                                            <dt id="'+moduleid+'" onclick="javascript:App.shortcutClick(&#39;'+'mdl-'+obj.data[i].id+'&#39;);">\
                                            <a href="#"><img src="'+config.app_host+'/images/webtop/s.gif" />\
                                                <div>'+obj.data[i].name+'</div></a>\
                                            </dt>\
                                        </dl></div>';
                                }

                            }

                            if (callback && reference){
                                reference.modules = modules;
                                callback(reference);
                            }

                            Ext.get('x-desktop').dom.innerHTML += html;
                            App.WebTop.desktop.taskbar.startBtn.setText('SGArqBase');
                        }
                    });

                }
            });
        },
		
        shortcutClick : function(id){
            var module = App.WebTop.getModule(id);
            if (module) 
                module.createWindow(module.id, module.launcher.cls, module.launcher.text, module.launcher.tooltip.text, module.launcher.iconCls.replace('icon-',''), module.launcher.tooltip.title);
        },
		
        setConfig : function(languaje, theme){
            //if (languaje)
            //Ext.getCmp('LanguageCycleButton').setActiveItem(languaje, true);
            if (theme){

                var btn = new Ext.ux.ThemeCycleButton({
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
                });
                btn.setActiveItem(theme, true);
            }
        },

        applySecurity : function(groups, permissions){

        },

        showWindow : function(title, width, height, items, acceptFn, cancelFn, animateTarget, printFn, menuConfig){
            showWindow(title, width, height, items, acceptFn, cancelFn, animateTarget, printFn, menuConfig);
        }
    }
}();