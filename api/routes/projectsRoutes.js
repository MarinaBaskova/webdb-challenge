const express = require('express');
const dbProjects = require('../routes/projectsModel');

const router = express.Router();

router.get('/', (req, res) => {
	dbProjects
		.find()
		.then((projects) => {
			res.status(200).json(projects);
		})
		.catch((err) => {
			res.status(500).json({
				error: 'The project information could not be retrieved'
			});
		});
});

router.get('/:id', (req, res) => {
	dbProjects
		.findById(req.params.id)
		.then((project) => {
			dbProjects
				.getProjectActions(project.id)
				.then((actions) => {
					project.actions = actions;
					res.status(200).json(project);
				})
				.catch((err) => {
					res
						.status(500)
						.json({ error: 'The list of actions for project information could not be retrieved' });
				});
		})
		.catch((err) => {
			res.status().json({ error: 'The project information could not be retrieved' });
		});
});

//post new Project
router.post('/', (req, res) => {
	const newProject = req.body;
	if (
		!newProject.hasOwnProperty('name') ||
		!newProject.hasOwnProperty('decription') ||
		!newProject.hasOwnProperty('completed')
	) {
		res.status(400).json({ error: 'Please provide name and description and completed status for the project.' });
	}
	dbProjects
		.add(newProject)
		.then((createdProject) => {
			res.status(201).json(createdProject);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'There was an error while saving the project to the database' });
		});
});

// add new action to project
router.post('/:id/actions', (req, res) => {
	const newAction = req.body;
	newAction.project_id = req.params.id;

	if (
		!newAction.hasOwnProperty('description') ||
		!newAction.hasOwnProperty('notes') ||
		!newAction.hasOwnProperty('completed')
	) {
		res.status(400).json({ error: 'Please provide notes and description and completed status for the action.' });
	}
	dbProjects
		.addActionToProject(newAction)
		.then((createdAction) => {
			res.status(201).json(createdAction);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'There was an error while saving the action to the database' });
		});
});
// get actions
router.get('/:id/actions', (req, res) => {
	dbProjects
		.getProjectActions(req.params.id)
		.then((actonsForProject) => {
			res.status(200).json(actonsForProject);
		})
		.catch((err) => {
			res.status(500).json({ error: 'The list of actions for project information could not be retrieved' });
		});
});

module.exports = router;
