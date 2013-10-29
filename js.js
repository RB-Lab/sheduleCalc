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
	
	Issue.prototype.showForm = function () {
		$.observable(this).setProperty('form', new Issue());
	};
	Issue.prototype.addIssue = function () {
		$.observable(this.issues).insert(this.form);
		$.observable(this).setProperty('form', null);
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
	
	$('#iss-add-line').on('click', function() {
		project.showForm();
	});
	$(document).on('click', '.iss-add', function () {
		$.view(this).data.showForm();
	});
	$(document).on('click', '.iss-add-new', function () {
		$.view(this).data.addIssue();
		project.recalc();
	});
	$('#save').click(function () {
		localStorage.setItem('project', JSON.stringify(project));
	});
});
