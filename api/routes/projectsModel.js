const db = require('../../config/dbConfig');

module.exports = {
	find,
	findById,
	findActionById,
	add,
	addActionToProject,
	getProjectActions
};

function find() {
	return db('projects');
}

function findById(id) {
	const project = db('projects')
		.select('projects.id', 'projects.name', 'projects.decription', 'projects.completed')
		.where({ 'projects.id': id })
		.first();
	return project;
}

function add(project) {
	return db('projects').insert(project, 'id').then(([ id ]) => {
		const project = findById(id);

		return project;
	});
}

function getProjectActions(projectId) {
	return db('actions')
		.select('actions.id', 'actions.description', 'actions.completed', 'actions.notes')
		.where('project_id', projectId);
}
function findActionById(id) {
	const action = db('actions').where({ 'actions.id': id });
	return action;
}

function addActionToProject(action) {
	return db('actions').insert(action, 'id').then(([ id ]) => {
		const action = findActionById(id);
		return action;
	});
}
