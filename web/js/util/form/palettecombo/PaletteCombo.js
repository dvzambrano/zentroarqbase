
Ext.ux.PaletteCombo = Ext.extend(Ext.form.TriggerField, {

    triggerClass: 'x-form-tree-trigger',

    initComponent : function(){
        Ext.ux.PaletteCombo.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTriggerClick();
            }
        }, this);
        this.getPalette(this.colors);
    },

    onTriggerClick: function() {
        this.getPalette().show();
        this.getPalette().getEl().alignTo(this.wrap, 'tl-bl?');
    },

    getPalette: function(colors) {
        if (!this.palette) {
            this.colorPalette = new Ext.ColorPalette({
                listeners: {
                    hide: this.onPaletteHide,
                    show: this.onPaletteShow,
                    select: this.onPaletteSelect,
                    scope: this
                }
            });
            if(colors)
                this.colorPalette.colors = colors;
            
            this.palette = new Ext.Panel({
                renderTo: Ext.getBody(),
                floating: true,
                width: 150,
                height: 95,
                items: [this.colorPalette]
				
            });
            this.palette.show();
            this.palette.hide();
        }
        return this.palette;
    },

    onPaletteShow: function() {
        Ext.getDoc().on('mousewheel', this.collapseIf, this);
        Ext.getDoc().on('mousedown', this.collapseIf, this);
    },

    onPaletteHide: function() {
        Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
    },

    collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.getPalette().getEl())){
            this.collapse();
        }
    },

    collapse: function() {
        this.getPalette().hide();
    },

    // private
    validateBlur : function(){
        return !this.palette || !this.palette.isVisible();
    },

    setColors: function(mastercolors) {
        if (this.colorPalette) 
            this.colorPalette.colors = mastercolors;
    },

    setValue: function(v) {
        this.startValue = this.value = v;
        this.setRawValue(v);
    },

    getValue: function() {
        return this.value;
    },
	
    reset: function() {
        Ext.ux.PaletteCombo.superclass.reset.call(this, '');
        this.setRawValue(this.emptyText);
    //this.el.addClass(this.emptyClass);
    },

    onPaletteSelect: function(colorPalette, color) {
        this.setRawValue(color);
        this.value = color;
        this.fireEvent('select', this, color);
        this.collapse();
    }
});
Ext.reg('PaletteCombo', Ext.ux.PaletteCombo);