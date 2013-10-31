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
			$.observable(this.issues).insert(this.form);
		}
		this.hideForm();
	};
	Issue.prototype.read = function (obj) {
		init.call(this, obj.name, obj.time, obj.uncertainty);
		for(var i = 0, l = obj.issues.length; i < l; i++){
			var iss = new Issue();
			iss.read(obj.issues[i]);
			this.issues.push(iss);
		}
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
	return Issue;
})();

var project = new Issue();
if(localStorage.getItem('project')){
	project.read(JSON.parse(localStorage.getItem('project')));
	project.recalc();
}

$(document).ready(function(){
	var listTmpl = $.templates('#listTmpl');
	var lineFormTmpl = $.templates('#lineFormTmpl');
	var totalTmpl = $.templates('#totalTmpl');

	listTmpl.link('#issues', project);
	totalTmpl.link('#total', project);
	
	$('#iss-add-line').click(function() {
		project.showForm();
	});
	$('#save').click(function () {
		localStorage.setItem('project', JSON.stringify(project));
	});
	$('#truncate').click(function () {
		if(confirm('Do you really want to truncate all saved data?')){
			localStorage.removeItem('project');
			project.truncate();
		}
	});
	
	$(document).on('click', '.iss-add', function () {
		$.view(this).data.showForm();
	});
	$(document).on('click', '.iss-add-new', function () {
		$.view(this).data.save();
		project.recalc();
	});
	$(document).on('click', '.iss-edit', function () {
		$.view(this).data.edit();
	});
	$(document).on('click', '.iss-esc', function () {
		$.view(this).data.hideForm();
	});
});
