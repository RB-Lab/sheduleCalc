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
		localStorage.setItem('project', JSON.stringify(project.serialize()));
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
	$(document).on('click', '.iss-rm', function () {
		$.view(this).data.remove();
		project.recalc();
	});
	$(document).on('click', '.iss-esc', function () {
		$.view(this).data.hideForm();
	});
});
