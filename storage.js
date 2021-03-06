;(function(window){
	var geekLS,
		userDataStorage;
	
	//Common Function
	var Until = {
		isString : function(val){
			return Object.prototype.toString.call(val) == '[object String]';
		},
		isFunction : function(val){
			return Object.prototype.toString.call(val) == '[object Function]'; 
		},
		isNumber : function(val){
			return Object.prototype.toString.call(val) == '[object Number]' 
		},
		isNumString : function(val){
			if(this.isString(val)){
				return /^[0-9]+$/.test(val);
			}
		}

	};
	userDataStorage = {
		length : 0,
		init : function() {
			var Virtual_doc,
				Virtual_agent,
				hostKey,
				key_prefix = 'geekls_',
				self = this;
			hostKey = document.domain;
			self.key_prefix = key_prefix;
			self.userDataName = key_prefix + hostKey;
			try{
				Virtual_agent = new ActiveXObject('htmlfile');
				Virtual_agent.open();
				Virtual_agent.write('<s'+'cript>document.w=window;</s'+'cript><iframe src="/favicon"></iframe>');
				Virtual_agent.close();

				Virtual_doc = Virtual_agent.w.frames[0].document;
				head_ele = Virtual_doc.createElement('head');
				Virtual_doc.appendChild(head_ele);
			}catch(e){
				head_ele = document.getElementsByTagName('head')[0];
			}
			try{
				//初始化userData
				head_ele.addBehavior('#default#userData');
				head_ele.load(self.userDataName);
				head_ele.save(self.userDataName);
				self.userDataEle = head_ele;
				self.attribute = head_ele.XMLDocument.documentElement.attributes;
				self.length = self.attribute.length;
			}catch(e){

			}
			
		},
		setItem : function(name, value, fn) {
			var self = this;
			if(1 in arguments && Until.isString(value)) {
				 self.userDataEle.setAttribute(self.key_prefix + name, value);
				 self.userDataEle.save(self.userDataName);
			}
			if(2 in arguments && Until.isFunction(fn)){
				fn(value);
			}
		},
		getItem : function(name, fn) {
			var self = this, result = '';
			if(0 in arguments && Until.isString(name)) {
				result = self.userDataEle.getAttribute(self.key_prefix + name);
			}
			if(1 in arguments && Until.isFunction(fn)) {
				setTimeout(function(){
					fn(result);
				},0);
				return result; 
			}
		},
		removeItem : function(name, fn) {
			var self = this;
			if(0 in arguments && Until.isString(name)) {
				self.userDataEle.removeAttribute(self.key_prefix + name);	
				self.userDataEle.save(self.userDataName);
			}
			if(1 in arguments && Until.isFunction(fn)) {
				fn();
			}
		},
		clear : function(fn) {
			var self = this;
			for(var key in self.attribute) {
				self.removeItem(key);
			}
			if(1 in arguments && Until.isFunction(fn)){
				fn();
			}
		}
	};
	geekLS = {
		init : function() {
			var self = this;
			if('localStorage' in window) {
				this.localStorage = window.localStorage;
			} 
		},
		getItem : function(name, fn){
			var self = this;
			var result = '';
			try{
				if(0 in arguments){
					result = self.localStorage.getItem(name);
				}
				if(1 in arguments && Until.isFunction(fn)){
					fn(result);
				}
			}catch(e){
				console.log(e)
			}
			return result;
		},
		setItem : function(name, value, fn){
			var self = this;
			try{
				if(1 in arguments && Until.isString(value)){
					self.localStorage.setItem(name, value);
				}
				
				if(2 in arguments && Until.isFunction(fn)) {
					fn(value);
				}
			}catch(e){
				console.log(e)
			}
		},
		removeItem : function(name, fn){
			var self = this;
			try{
				self.localStorage.removeItem(name);
				if(1 in arguments && Until.isFunction(fn)){
					fn();
				}
			}catch(e){
				console.log(e)
			}
		},
		clear : function(fn){
			var self = this;
			for (var key in self.localStorage) {
				self.removeItem(key);
			};
			if(0 in arguments && Until.isFunction(fn)){
				fn();
			}
		},
	}


	//特性检测

	try{
		window.localStorage.setItem('localStorage', 'Test');
		window.localStorage.removeItem('localStorage');
		geekLS.init();
	}catch(e){
		if(document.documentElement && document.documentElement.addBehavior){
			geekLS = userDataStorage;
			geekLS.init();
		}
	}
	if(typeof define === 'function' && seajs){
		define(function(require, exports, module){
			module.exports = geekLS;
		});
	} else {
		window.geekLS = geekLS;
	}

})(window);