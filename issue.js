var Issue = (function () {
	function Issue () {
		init.call(this);
	};
	
	function init (name, time, u) {
		this.name = name || '';
		this.time = time || null;
		this.uncertainty = u || null;
		this.issues = [];
		this.form = null;
	}
	
	function addIssue (issue, hidden) {
		issue.parent = this;
		if(hidden){
			this.issues.push(issue);
		}else{
			$.observable(this.issues).insert(issue);
		}
	}
	
	var editFlag = false;
	
	Issue.prototype.showForm = function () {
		$.observable(this).setProperty('form', new Issue());
	};
	
	Issue.prototype.hideForm = function () {
		editFlag = false;
		$.observable(this).setProperty('form', null);
	};
	
	Issue.prototype.edit = function () {
		editFlag = true;
		var i = {
			name: this.name,
			time: this.time,
			uncertainty: this.uncertainty
		};
		$.observable(this).setProperty('form', i);
	};
	
	Issue.prototype.save = function () {
		if(editFlag){
			$.observable(this).setProperty('name',this.form.name);
			$.observable(this).setProperty('time',this.form.time);
			$.observable(this).setProperty('uncertainty',this.form.uncertainty);
		}else{
			addIssue.call(this, this.form);
		}
		this.hideForm();
	};
	
	Issue.prototype.read = function (obj) {
		init.call(this, obj.name, obj.time, obj.uncertainty);
		for(var i = 0, l = obj.issues.length; i < l; i++){
			var iss = new Issue();
			iss.read(obj.issues[i]);
			addIssue.call(this, iss, true);
		}
	};
	
	// we need this method to remove circular links (this.parent) from data structure to encode it int JSON
	Issue.prototype.serialize = function () {
		var me = {
			name: this.name,
			time: this.time,
			uncertainty: this.uncertainty,
			issues: []
		};
		for(var i = 0, l = this.issues.length; i < l; i++){
			me.issues.push(this.issues[i].serialize());
		}
		return me;
	};
	
	Issue.prototype.recalc = function () {
		if(this.issues.length == 0) return;
		var totalTime = 0;
		var totalUncert = 0;
		for(var i = 0, l = this.issues.length; i < l; i++){
			this.issues[i].recalc();
			totalTime += this.issues[i].time*1;
			totalUncert += this.issues[i].time * this.issues[i].uncertainty;
		}
		$.observable(this).setProperty('time', totalTime);
		$.observable(this).setProperty('uncertainty', totalUncert/totalTime);
	};
	
	Issue.prototype.truncate = function () {
		$.observable(this).setProperty('issues', []);
		$.observable(this).setProperty('time', 0);
		$.observable(this).setProperty('uncertainty', 0);
	};
	
	Issue.prototype.remove = function () {
		for(var i = 0, l = this.parent.issues.length; i < l; i++){
			if (this.parent.issues[i] == this) {
				$.observable(this.parent.issues).remove(i);
			};
		}
	};
	
	return Issue;
})();