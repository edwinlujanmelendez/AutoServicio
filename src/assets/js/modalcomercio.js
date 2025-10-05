AlignetVPOS2={
	urlBase:'https://vpayment.verifika.com/',
	context: 'VPOS2',
	designID: '1',
	canReady:false,
	log : function(data){

	},
	urlTracker:'https://calidad.alignetsac.com/Analytics/collector/event',
	registerEvent:function(eventName,ecommerceID,userECommerceID){
		if(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(AlignetVPOS2.urlTracker)){
			var en = eventName ? eventName : '', 
				oi = '', 
				ei = ecommerceID ? ecommerceID : '', 
				ct = AlignetVPOS2.currentTimeMillis(), 
				uei = userECommerceID ? userECommerceID : '',
				no = '';

			
			try{
				var xhttp=null;
				if (window.XMLHttpRequest) {
					xhttp = new XMLHttpRequest();
				 } else {
					 xhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				var parameters="?en="+en+"&oi="+oi+"&ei="+ei+"&ct="+ct+"&uei="+uei+"&no="+no;
				xhttp.open('GET', AlignetVPOS2.urlTracker+parameters, true);
				xhttp.send('');
			}catch (e) {
			}
		}
	},
	currentTimeMillis:function(){
		return (new Date()).getTime();
	},
	browerNames:{
		CHROME:'Chrome',
		SAFARI:'Safari',
		FIREFOX:'Firefox',
		OPERA:'Opera',
		IE:'IE'
	},
	getBrowserName:function(){
		var userAgent = navigator.userAgent,
			browserName;
		if(userAgent.indexOf("Chrome") > -1) {
			browserName = AlignetVPOS2.browerNames.CHROME;
  	    } else if (userAgent.indexOf("Safari") > -1) {
  	    	browserName = AlignetVPOS2.browerNames.SAFARI;
	  	} else if (userAgent.indexOf("Opera") > -1) {
	  		browserName = AlignetVPOS2.browerNames.OPERA;
	  	} else if (userAgent.indexOf("Firefox") > -1) {
	  		browserName = AlignetVPOS2.browerNames.FIREFOX;
	  	} else if (userAgent.indexOf("MSIE") > -1) {
	  		browserName = AlignetVPOS2.browerNames.IE;
		}
		return browserName;
	},
	isSafari:function(){
		var browserName=AlignetVPOS2.getBrowserName();
		if(browserName==AlignetVPOS2.browerNames.SAFARI){
			return true;
		}
		return false;
	},
	fullResizeFrame:function(frame){
		AlignetVPOS2.log('resizing frame');
		var w = window.innerWidth;
		var h = window.innerHeight;
		AlignetVPOS2.log('resizing to w: '+w+',h: '+h);
		setTimeout(function(){
			AlignetVPOS2.log('make resize');
		},2000)
		
	},
	resolveListeners:function(element,listeners){
		if(listeners.load){
			element.onload=listeners.load;
		}
		if(listeners.click){
			element.onclick=listeners.click;
		}
	},
	createElement:function(config){
		var me=this,
			tagName=config.tag,
			styles=config.styles,
			cls=config.cls,
			id=config.id,
			name=config.name,
			children=config.children,
			listeners=config.listeners;
		var element=document.createElement(tagName);
		if(id){
			element.id=id;
		}
		if(cls){
			element.className=cls;
		}
		if(name){
			element.name=name;
		}
		if(children){
			for(var i=0;i<children.length;i++){
				var childConfig=children[i],
					childEl=me.createElement(childConfig);
				if(childEl){
					element.appendChild(childEl);
				}
			}
		}
		if(listeners){
			me.resolveListeners(element,listeners);
		}
		return element;
	},
	postForm:function(){
		var me=this,
			forms = document.getElementsByClassName("alignet-form-vpos2");
		if(forms){
			for (var i = 0; i < forms.length; i++) { 
			    var form=forms[i];
			    var typeDesignField=form.typeDesign;
			    var designIDField=form.designID;
			    
			    if(!designIDField){
			    	designIDField=document.createElement('input');
			    	designIDField.name='designID';
			    	designIDField.type='hidden';
			    	form.appendChild(designIDField);
			    	
			    }
			    if(!typeDesignField){
			    	typeDesignField=document.createElement('input');
			    	typeDesignField.name='typeDesign';
			    	typeDesignField.type='hidden';
			    	form.appendChild(typeDesignField);
			    }
			    if(typeDesignField){
			    	typeDesignField.value='Modal';
			    	designIDField.value=me.designID;
				    form.target='alignet-vpos2-frame';
				    form.action=me.urlBase+me.context+'/faces/pages/startPayme.xhtml';
				    
				    var ecommerceID='',
				    	userECommerceID='',
				    	idCommerceField=form.idCommerce,
				    	shippingEmailField=form.shippingEmail;
				    if(idCommerceField){
				    	ecommerceID=idCommerceField.value;
				    }
				    if(shippingEmailField){
				    	userECommerceID=shippingEmailField.value;
				    }
				    AlignetVPOS2.registerEvent("ecommercePost-send", ecommerceID, userECommerceID);
				    
				    form.submit();
				    me.canReady=true;
				    break;
			    }
			}
			
		}
	},
	configure:function(configData){
		
	},
	openModal:function(host,designID,context){
		
		var me=this;
		me.canReady=false;
		me.log('init openModal');
		var body=document.getElementsByTagName("BODY")[0];
		if(host&&host.length>0){
			me.urlBase=host;	
		}
		if(context&&context.length>0){
			me.context=context;	
		}
		if(designID&&designID.length>0){
			me.designID=designID;	
		}
		
		
		var modalContainer=document.getElementById('alignet-modal');
		if(!modalContainer){
			modalContainer = me.createElement({
				tag:'div',
				id: 'alignet-modal',
				cls: 'alignet-modal'
			});
			body.appendChild(modalContainer);			
			var cssId = 'alignet-modal-css';
			if (!document.getElementById(cssId))
			{
			    var head  = document.getElementsByTagName('head')[0];
			    var link  = document.createElement('link');
			    link.id   = cssId;
			    link.rel  = 'stylesheet';
			    link.type = 'text/css';
			    link.href = me.urlBase+me.context+'/css/modalcomercio.css';
			    link.media = 'all';
			    head.appendChild(link);
			}
		}
		var loadingBackgroundEl=me.createElement({
			tag:'div',
			cls:'alignet-modal-container'
		})
		var loadingWraperEl=me.createElement({
			tag:'div',
			cls:'alignet-loading-wraper',
			children : [
	            {
	            	tag:'div',
	            	cls:'alignet-loading',
	            	children: [
        	           {
        	        	   tag:'div'
        	           }
	            	]
	            }
        	]
		})
		var iframeModalEl=me.createElement({
			tag: 'iframe',
			cls: 'alignet-modal-frame',
			name: 'alignet-vpos2-frame',
			listeners:{
				load:function(){
					if(me.canReady){
						modalContainer.className+=' ready';	
					}
					
				}
			}
		})
		if(AlignetVPOS2.isSafari()){
			var win=window.open(me.urlBase+me.context+'/faces/pages/safariEntry.xhtml','_blank ','height=100px,width=100px,top=9999px,left=9999px');
			//win.opener.focus();
			setTimeout(function(){
				win.close();
			},2000);
		}
		body.className +=' alignet-body-modal';
		modalContainer.appendChild(loadingBackgroundEl);
		modalContainer.appendChild(loadingWraperEl);
		modalContainer.appendChild(iframeModalEl);
		me.postForm();
		
	}
		
};
