var preset = '{"name":"","time":17,"uncertainty":27.647058823529413,"issues":[{"name":"issue-1","time":7,"uncertainty":31.428571428571427,"issues":[{"name":"issue-1.1","time":5,"uncertainty":32,"issues":[{"name":"issue-1.1.1","time":2,"uncertainty":50,"issues":[{"name":"issue-1.1.1.1","time":"2","uncertainty":"50","issues":[]}]},{"name":"issue-1.2","time":3,"uncertainty":20,"issues":[{"name":"issue-1.2.1","time":"3","uncertainty":"20","issues":[]}]}]},{"name":"issue-1.2","time":"2","uncertainty":"30","issues":[]}]},{"name":"issue-2","time":"10","uncertainty":"25","issues":[]}]}';

preset = JSON.parse(preset);

describe('Reading saved data', function () {
	it('Should to read data from preset', function () {
		var prj  = new Issue();
		
		expect(prj).to.be.an('object');
		expect(prj).to.have.property('read');
		expect(prj.read).to.be.a('function');
		
		expect(prj.issues).to.be.an(Array);
		expect(prj.issues.length).to.eql(0);
		
		// https://github.com/LearnBoost/expect.js/issues/75
		// expect(prj.read).withArgs(preset).to.not.throwException();
		
		prj.read(preset);
		
		expect(prj.issues.length).to.eql(2);
		expect(prj.issues[0].issues).to.be.an(Array);
		expect(prj.issues[0].issues.length).to.eql(2);
		expect(prj.issues[0].issues[0].issues).to.be.an(Array);
		expect(prj.issues[0].issues[0].issues.length).to.eql(2);
		
		expect(prj.issues[0].issues[0].issues[1].name).to.eql('issue-1.2');
		expect(prj.issues[0].issues[0].issues[1].time).to.eql(3);
		expect(prj.issues[0].issues[0].issues[1].uncertainty).to.eql(20);
		expect(prj.issues[0].issues[0].issues[1].form).to.eql(null);
	});
});

describe('Serilaizing data', function () {
	it('Should serialize data in form suitable for saving', function () {
		var prj  = new Issue();
		
		prj.read(preset);
		
		expect(prj).to.have.property('serialize');
		expect(prj.serialize).to.be.a('function');
		
		expect(JSON.stringify(prj.serialize())).to.eql(JSON.stringify(preset));
		
	});
});