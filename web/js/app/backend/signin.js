
App = function() {
    return {
        init : function(App) {
			
            this.formPanel = new Ext.FormPanel({
                labelWidth: 120,
                labelAlign: 'top',
                region:'center',
                url: config.app_host + '/login.php',
                border:false,
                split:false,
                bodyStyle:'padding:5px 5px 0',
                keys: [formKeyMaping],	
                items: [{
                    ref: 'usernameField',
                    xtype:'textfield',
                    fieldLabel: bundle.getMsg('app.form.usernameoremail')+'<span style="color:red;"><sup>*</sup></span>',
                    allowBlank:false,
                    anchor:'-20'
                },{
                    ref: 'passwordField',
                    xtype:'textfield',
                    fieldLabel: bundle.getMsg('app.form.password'),
                    inputType: 'password',
                    anchor: '-20'
                }, {
                    ref: 'rememberCheckBox',
                    xtype:'checkbox',
                    fieldLabel: '',
                    labelSeparator: '',
                    boxLabel: bundle.getMsg('app.form.rememberpassword')
                }]
            });
			
            if (Ext.get('signin_username').dom.value)
                App.formPanel.usernameField.setValue(Ext.get('signin_username').dom.value);
            App.formPanel.passwordField.setValue(Ext.get('signin_password').dom.value);
            App.formPanel.rememberCheckBox.setValue(Ext.get('signin_remember').dom.value);
			
            this.window = new Ext.Window({
                title: bundle.getMsg('app.msg.welcome.title') +' '+config.app_name,
                iconCls: Ext.ux.Icon('zentro', 'myicons'),
                layout:'border',
                resizable: false,
                closable: false,
                draggable: false,
                border: false,
                split: false,
                width: 395,
                height: 225,
                closeAction:'hide',
                plain: true,
                items: [{
                    region:'west',
                    width: 125,
                    minSize: 100,
                    maxSize: 250,
                    border: false,
                    html: '<br/><img src="images/login.png" title="'+config.app_name+'" width="120"/>'
                },this.formPanel],
                buttons: [{
                    ref: '../submitBtn',
                    text: bundle.getMsg('app.form.access'),
                    iconCls: Ext.ux.Icon('key'),
                    handler: function(){
                        var mask = new Ext.LoadMask(App.window.getEl(), {
                            msg: bundle.getMsg('app.layout.autenticating')+'...'
                        });
                        mask.show();

                        App.formPanel.passwordField.allowBlank = false;
                        App.formPanel.passwordField.minLength = 1;
                        if (App.formPanel.getForm().isValid()){

                            new Ext.data.Connection().request({
                                url: config.app_host + '/user/request/method/checkcredentials',
                                params: {
                                    username: App.formPanel.usernameField.getValue(),
                                    password: App.formPanel.passwordField.getValue(),
                                    entityid: App.entity && App.entity.id && App.entity.id != '' ? App.entity.id : ''
                                },
                                callback : function(options, success, response) {
                                    mask.hide();
                                    var result = Ext.decode(response.responseText);
                                    if(result && result.success){
                                        Ext.Base.msg(bundle.getMsg('app.msg.info.autenticatedsuccessful'), '');
                                        mask = new Ext.LoadMask(App.window.getEl(), {
                                            msg: bundle.getMsg('app.layout.redirecting')+'...'
                                        });
                                        mask.show();

                                        Ext.get('signin_username').dom.value = App.formPanel.usernameField.getValue();
                                        Ext.get('signin_password').dom.value = App.formPanel.passwordField.getValue();
                                        Ext.get('signin_remember').dom.value = App.formPanel.rememberCheckBox.getValue();
                                        var form = new Ext.form.BasicForm('signinForm', {
                                            standardSubmit : true
                                        });
                                        form.submit();
                                    }
                                    else{
                                        var msg = bundle.getMsg(result.message);
                                        if(result.details && result.details.length > 0){
                                            var dt = Date.parseDate(result.details[0], "Y-m-d H:i:s");
                                            msg = String.format(bundle.getMsg(result.message), dt.format(Date.patterns.FullDateTime));
                                        }

                                        Ext.Msg.show({
                                            title: bundle.getMsg('app.msg.warning.title'),
                                            msg: msg,
                                            buttons: Ext.Msg.OK,
                                            animEl: 'elId',
                                            icon: Ext.MessageBox.WARNING
                                        });
                                    }
                                }
                            });


                        }
                        else
                            mask.hide(); 
                    }
                }]
            });
			
            this.window.show();

            var html = '<div style="text-align:center;">\
                            <a href="http://validator.w3.org"><img src="images/xhtml10.png"/></a>&nbsp;\
                            <a href="http://www.php.net"><img src="images/php5-power-micro.png"/></a>&nbsp;\
                            <a href="http://jigsaw.w3.org/css-validator"><img src="images/css2.png"/></a>\
                    <div>';

            var xposition = screen.width - 350;
            var yposition = screen.height - 200;
            new Ext.Panel({
                x: xposition,
                y: yposition,
                renderTo: Ext.getBody(),
                baseCls: 'transparentBg',
                floating: true,
                border: false,
                shadow: false,
                html: html,
                width: 330,
                height: 50
            }).show();
			
            if (document.location.href.indexOf('login')!=-1){
                Ext.Msg.show({
                    title: bundle.getMsg('app.msg.warning.title'),
                    msg: bundle.getMsg('app.msg.info.wronglogincredentials'),
                    buttons: Ext.Msg.OK,
                    animEl: 'elId',
                    icon: Ext.MessageBox.WARNING
                });
            }
        }
    }
}();

var url = '';
if (document.location.href.indexOf('login')==-1){
    url = window.location.href.slice(window.location.href.indexOf("?") + 1).replace('#', '') + '/db/request/method/loadConfig';
}
else{
    url = '../../db/request/method/loadConfig';
}

var config, bundle;
var params = Ext.urlDecode(window.location.search.substring(1));

new Ext.data.Connection().request({
    method: 'POST',
    url: url,
    //failure: requestFailed,
    //success: requestSuccessful,
    callback : function(options, success, response) {
        config = Ext.decode(response.responseText);
		
        var languaje = config.app_defaultlanguaje;		
        if(params.lang)
            languaje = params.lang;
			
        if (languaje) {
            Ext.Ajax.request({
                url: String.format(config.app_host + '/js/extjs/locale/ext-lang-{0}.js', languaje.substring(0, languaje.indexOf('-'))),
                success: function(response) {
                    eval(response.responseText);
                },
                scope: this 
            });
        }

        bundle = new Ext.i18n.Bundle({
            bundle:'languaje', 
            path:'languajes', 
            lang: languaje
        });
        bundle.onReady(function(){
            if(config.success)
                App.init(App);
            else
                requestFailed(response, false);

        });
    }
});
