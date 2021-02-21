Ext.ux.ThemeCycleButton = Ext.extend(Ext.CycleButton, {		
    themeVar:'style',
    cssPath:'js/extjs/resources/css/',	
    initComponent: function() {
        Ext.apply(this, {
            showText: true,
            prependText: '&nbsp;',
            items: this.cssItems
        });
        if(Ext.state.Manager){ 
            var selectedTheme = Ext.state.Manager.get(this.themeVar); 
            if(selectedTheme){ 
                for(var i=0; i<this.items.length;i++){
                    if (this.items[i].file == selectedTheme){
                        this.items[i].checked = true;
                        this.changeHandler.defer(2000, this, [this, this.items[i]]);
                        break;
                    }
                }
            } 
        }
        Ext.ux.ThemeCycleButton.superclass.initComponent.apply(this, arguments);
    }
	        
});

Ext.reg('themecyclebutton', Ext.ux.ThemeCycleButton);