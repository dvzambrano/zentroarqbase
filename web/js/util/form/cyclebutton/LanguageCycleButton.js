Ext.ux.LanguageCycleButton = Ext.extend(Ext.CycleButton, {
    languageVar: 'lang',	
    initComponent: function() {
        Ext.apply(this, {
            showText: true,
            prependText: '&nbsp;',
            items: this.languageItems
        });
        if(Ext.state.Manager){ 
            var selectedLanguage = Ext.state.Manager.get(this.languageVar); 
            if(selectedLanguage){ 
                for(var i=0; i<this.items.length;i++){
                    if (this.items[i].language == selectedLanguage){
                        this.items[i].checked = true;
                        break;
                    }
                }
            } 
        } 
        Ext.ux.LanguageCycleButton.superclass.initComponent.apply(this, arguments);
    }    
});

Ext.reg('themecyclebutton', Ext.ux.LanguageCycleButton);