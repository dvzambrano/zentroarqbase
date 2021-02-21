// general keys maping start ---------------------------------------------------
var formKeyMaping = {
    key: [Ext.EventObject.ENTER], 
    handler: function(key, component) {
        var enableKeyEvents = false;
        if(component.target.tagName != 'TEXTAREA'){
            var window = false;
            var node = component.target;
            do{
                var cmp = Ext.getCmp(node.id);
                if(cmp){
                    if(cmp.enableKeyEvents)
                        enableKeyEvents = true;
                    if(cmp.submitBtn && cmp.submitBtn.refName != ''){
                        window = cmp;
                        break;
                    }
                }
                node = node.parentNode;
            }
            while(node.parentNode);
        
            if(window && window.isVisible() && !enableKeyEvents)
                window.submitBtn.handler.call(window.submitBtn.scope); 
        }
    }
};
var keyAddFn = function(key, e){
    e.preventDefault();
    
    var panel = Ext.getCmp('centerPanel').getLayout().activeItem;
    if(panel && panel.addBtn && !panel.addBtn.disabled)
        panel.addBtn.fireEvent('click', panel.addBtn);
};
var keyUpdateFn = function(key, e){
    e.preventDefault();
    
    var panel = Ext.getCmp('centerPanel').getLayout().activeItem;
    if(panel && panel.updateBtn && !panel.updateBtn.disabled)
        panel.updateBtn.fireEvent('click', panel.updateBtn);
};
var keyDeleteFn = function(key, e){
    e.preventDefault();
    
    var panel = Ext.getCmp('centerPanel').getLayout().activeItem;
    if(panel && panel.removeBtn && !panel.removeBtn.disabled)
        panel.removeBtn.fireEvent('click', panel.removeBtn);
};
var keyCleanFn = function(key, e){
    e.preventDefault();
    
    var panel = Ext.getCmp('centerPanel').getLayout().activeItem;
    if(panel.filters)
        panel.filters.clearFilters();
};
var panelKeysMap = [{
    key: "an",
    ctrl:true,
    //    shift:true,
    fn: keyAddFn
},{
    key: "i",
    ctrl:true,
    fn: keyUpdateFn
},{
    key: [10,13], // enter
    fn: keyUpdateFn
},{
    key: "de",
    ctrl:true,
    fn: keyDeleteFn
},{
    key: [46], //  del
    fn: keyDeleteFn
},{
    key: "cl",
    ctrl:true,
    fn: keyCleanFn
}];
// general keys maping end -----------------------------------------------------
