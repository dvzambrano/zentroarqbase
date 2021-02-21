var config, bundle, permissions, params = Ext.urlDecode(window.location.search.substring(1));

Ext.onReady(function(){
    Ext.MessageBox.progress('Por favor espere...', 'Cargando el contexto del sistema', 'Inicializando...');
});

new Ext.data.Connection().request({
    method: 'POST',
    url: window.location.href.slice(window.location.href.indexOf("?") + 1).replace('#', '') + '/db/request/method/loadConfig',
    //failure: requestFailed,
    //success: requestSuccessful,
    callback : function(options, success, response) {
        config = Ext.decode(response.responseText);
        config.app_host = config.app_host.replace('/index.php', '/')
        if(config.success){
            var languaje = config.app_defaultlanguaje;
            
            if(config.app_ismultientidable == 2)
                config.app_entityid = config.app_multientityid;

            if(config.app_logueduserdata && config.app_logueduserdata.profile){
                config.app_logueduserdata.profile = Ext.decode(config.app_logueduserdata.profile);

                if(config.app_logueduserdata && config.app_logueduserdata.profile && config.app_logueduserdata.profile.theme)
                    params.theme = config.app_logueduserdata.profile.theme;

                if(config.app_logueduserdata && config.app_logueduserdata.profile && config.app_logueduserdata.profile.languaje)
                    languaje = config.app_logueduserdata.profile.languaje;
            }

            if (languaje && languaje!='') {
                Ext.Ajax.request({
                    url: String.format('js/extjs/locale/ext-lang-{0}.js', languaje.substring(0, languaje.indexOf('-'))),
                    success: function(response, opts) {
                        config.languajeJs = response.responseText;
                    },
                    scope: this 
                });
            }

            bundle = new Ext.i18n.Bundle({
                bundle:'languaje', 
                path: 'languajes', 
                lang: languaje
            });
            bundle.onReady(function(){
                var i = 0;
                var groups = new Array();
                for(i = 0; config.app_logueduserdata.groups && i<config.app_logueduserdata.groups.length; i++)
                    groups.push(config.app_logueduserdata.groups[i]['name']);

                permissions = new Array();
                for(i = 0; config.app_logueduserdata.permissions && i<config.app_logueduserdata.permissions.length; i++)
                    permissions.push(config.app_logueduserdata.permissions[i]['name']);

                followSteps([{
                    text: bundle.getMsg('app.layout.loading.langtheme')+'...',
                    fn: function(data, callback){
                        App.init(App);
                        App.setConfig(languaje, params.theme);
                        
                        // Mandatory to PRELOAD UserApp for edit profile function. But it depend on ContacttypeApp
                        ContacttypeApp.init(ContacttypeApp);
                        UserApp.init(UserApp);
                        callback();
                    }
                },{
                    text: bundle.getMsg('app.layout.loading.permits')+'...',
                    fn: function(data, callback){
                        App.applySecurity(groups, permissions);
                        callback();
                    }
                }]);

                // firing security task
                Ext.TaskMgr.start({
                    run: function(count){
                        Ext.defer(function(){
                            new Ext.data.Connection().request({
                                url: config.app_host+'/'+config.app_securitypivotmodule+'/request/method/_dc='+(new Date()).format('uHisymd'),
                                method: 'POST',
                                callback : function(options, success, response) {
                                    var obj = Ext.decode(response.responseText);
                                    if(!obj.success){
                                        var msg = bundle.getMsg('app.msg.error.reg.invalid')+' ';
                                        var extflag = false;
                                        if(obj.message){
                                            msg += bundle.getMsg('app.msg.error.reg.invalid.general') + ':<hr/><code>';
                                            for(var i = 0; i < obj.message.length; i++){
                                                if(obj.message[i].code == 'extension'){
                                                    extflag = true;
                                                    break;
                                                }
                                                msg+= String.format(bundle.getMsg('app.msg.error.reg.invalid.'+obj.message[i].code), obj.message[i].data)+'<br/>';
                                            }
                                            if(extflag)
                                                msg = bundle.getMsg('app.msg.error.reg.invalid.general') + ':<hr/><code>'
                                                +String.format(bundle.getMsg('app.msg.error.reg.invalid.extension'), "<a href='check.php' target='_blank'>", "</a>")+'<br/>';
                                            else
                                                msg += String.format(bundle.getMsg('app.msg.error.reg.invalid.mac'), obj.mac, '<b>', '</b>')+'<br/>';
                                        }
                                        
                                        document.body.innerHTML = '<div id="frame" class="outline">\
                                            <img src="graph.php?graph=qr&data='+config.app_name+'->'+obj.mac+'"/>\
                                            <br/><br/><h2>'+bundle.getMsg('app.msg.info.title')+':</h2><br/><p align="justify">'+msg+'</p><hr/><p><b><a href="'+config.app_host+'/install.php?step=3'+'">REGISTRAR SISTEMA</a></b></p><br/>\
                                            <div align="justify" style="font-size:10px;">'+bundle.getMsg('app.msg.error.reg.invalid.notice')+'</div>\
                                        </div>';
                                    }
                                }
                            });
                        }, 2000, this);
                    },
                    interval: 60000*20 // each 20 minutes
                });

            });
        }
    }
});
