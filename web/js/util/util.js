// setting up the form messages
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

// setting up the icon family location
Ext.ux.Icon = function(icon, customPath){
    var path = 'images/icons/famfamfam/';
    if(window.location.href.indexOf('guard')>-1)
        path = '../../'+path;
    if (customPath) path = path.replace('famfamfam', customPath);
    if(!Ext.util.CSS.getRule('.icon-'+icon)){
        Ext.util.CSS.createStyleSheet('.icon-'+icon+' { background-image: url('+path+icon+'.png) !important; }');			
    /*
		puede agregarse un parametro 'extension' y usarlo asi:
		Ext.util.CSS.createStyleSheet('.icon-'+icon+' { background-image: url('path+icon+'.'+extension+') !important; }');
         */
    }
    return 'icon-'+icon;
};

// setting up variables	
Date.patterns = {
    ISO8601Long:"Y-m-d H:i:s",
    ISO8601Short:"Y-m-d",
    NonISO8601Long:"d/m/Y H:i:s",
    NonISO8601Long1:"d/m/Y g:i A",
    NonISO8601Short:"d/m/Y",
    ShortDate: "n/j/Y",
    LongDate: "l, F d, Y",
    FullDateTime: "l, d \\d\\e F \\d\\e Y g:i A",
    MonthDay: "F d",
    ShortTime: "g:i A",
    LongTime: "g:i:s A",
    SortableDateTime: "Y-m-d\\TH:i:s",
    UniversalSortableDateTime: "Y-m-d H:i:sO",
    YearMonth: "F, Y",
    DateInterval: /^([1234567890dmy]*)+$/,
    LettersOnly: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\- ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
    NumbersOnly: /^([1234567890]*)+$/,
    FilesAllowed: /^.*.(doc|DOC|docx|DOCX|xls|XLS|xlsx|XLSX|pdf|PDF)$/,
    OnlyImagesAllowed: /^.*.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/,
    Email: /^([\w\-\'\-]+)(\.[\w-\'\-]+)*@([\w\-]+\.){1,5}([A-Za-z]){2,4}$/,
    ComaSeparatedEmail: /^((\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)*([; ])*)*$/
};

// setting up utils functions
function formatDate(value){
    return value ? value.dateFormat(Date.patterns.NonISO8601Short) : '';
};
function formatBool(value){
    return value ? bundle.getMsg('app.form.yes') : bundle.getMsg('app.form.no');
};
function formatNull(value){
    return value ? value : ' ';
};

function randomNumber(min, max){
    return Math.floor(Math.random()*(max-(min-1))) + min;
};

function resetTree(tree, node, parent){
    var mask = new Ext.LoadMask(tree.container, {
        msg: bundle.getMsg('app.layout.loading')+'...'
    });
    mask.show();
            
    var initiallyExpanded = false;
    if(node){
        initiallyExpanded = node.expanded;
        if(node.ui && node.id != tree.getRootNode().id){
            var el = Ext.fly(node.ui.elNode);
            if(el)
                el.ghost('l', {
                    scope: node, 
                    duration: .1
                });
        }
    }

    tree.expandPath(parent && parent.data ? parent.data.path : tree.getRootNode().getPath(), 'id', function(){
        var parentnode = parent && parent.id ? tree.getNodeById(parent.id) : tree.getRootNode();
        if(parentnode){
            parentnode.removeAll();

            tree.getLoader().load(parentnode, function(){
                if(parentnode){
                    var contFn = function(){
                        parentnode.expand();

                        if(node){
                            var newnode = tree.getNodeById(node.id);
                            if(newnode){
                                if(initiallyExpanded)
                                    newnode.expand();
                                tree.getSelectionModel().select(newnode);
                            }
                        }
                        
                        mask.hide();
                    };

                    if(parentnode.id != tree.getRootNode().id){
                        parentnode.ensureVisible(contFn);
                        mask.hide();                        
                    }
                    else
                        contFn();
                }
                else
                    mask.hide();
            });
        }
        else
            mask.hide();
    });
};

function dateDifference(start, end, format) {
    var diff = end.getElapsed(start);

    var result = 0;
    switch (format) {
        case 'D':
            result = diff/(1000*60*24);
            break;
        case 'H':
            result = diff/(1000*60*60);
            break;
        case 'M':
            result = diff/(1000*60);
            break;
        default:
            result = diff/1000;
            break;
    }

    return result;
};

function syncExecute(array, finalFn) {
    App.syncarray = array;

    var executeStep = function(){
        var alldone = true;
        for (var i = 0; i < App.syncarray.length; i++){
            if(!App.syncarray[i].statusip){
                Ext.defer(App.syncarray[i].fn, 1, this, App.syncarray[i].params);
                App.syncarray[i].statusip = true;
            }

            if(!App.syncarray[i].status){
                alldone = false;
                break;
            }
        }

        if(alldone){
            finalFn();
            App.syncarray = new Array();
        }
        else
            return Ext.defer(executeStep, 500, this, ['']);

        return alldone;
    };

    for (var i = 0; i < App.syncarray.length; i++)
        App.syncarray[i].status = false;

    executeStep();
};

function syncLoad(array, finalFn) {
    App.syncarray = new Array();
    for (var i = 0; i < array.length; i++) 
		if(array[i]){
			array[i].loadStatus = false;

			if(array[i].baseParams)
				array[i].baseParams.identifier = i;
			else
				array[i].baseParams = {
					identifier: i
				};

			App.syncarray.push(array[i]);

			App.syncarray[i].load({
				params: array[i].baseParams,
				callback: function(records, options, success){
					App.syncarray[options.params.identifier].loadStatus = true;
					var allloaded = true;
					for (var i = 0; i < App.syncarray.length; i++)
						if(!App.syncarray[i].loadStatus){
							allloaded = false;
							break;
						}
					if(allloaded){
						App.syncarray = new Array();
						finalFn();
					}
				}
			});
		}
};

function followSteps(steps, total) {
    if(!total)
        total = steps.length;

    var start = (steps.length-total)*-1;
    if(steps[0]) {
        var thisStepFn = function(callback, rollback){
            steps[0].fn(steps[0].data, callback, rollback);
        };

        var nextStepFn = function(){
            Ext.MessageBox.updateProgress(start/total, steps && steps.length > 0 ? steps[0].text : '');
            steps.splice(0,1);
            followSteps(steps, total);
        };

        thisStepFn(nextStepFn, thisStepFn);
    }
    else {
        Ext.MessageBox.updateText(bundle.getMsg('app.layout.loading.finished'));
        Ext.MessageBox.hide();
        App.mask.hide();
    }
};

function mapDOM(element, json) {
    var treeObject = {};

    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
            parser = new DOMParser();
            docNode = parser.parseFromString(element,"text/html");
        }
        element = docNode.firstChild;
    }

    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object["type"] = element.nodeName;
        var nodeList = element.childNodes;
        if (nodeList != null) {
            if (nodeList.length) {
                object["content"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        object["content"].push(nodeList[i].nodeValue);
                    } else {
                        object["content"].push({});
                        treeHTML(nodeList[i], object["content"][object["content"].length -1]);
                    }
                }
            }
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                }
            }
        }
    }
    treeHTML(element, treeObject);

    return (json) ? JSON.stringify(treeObject) : treeObject;
};