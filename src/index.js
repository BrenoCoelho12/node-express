const { request, response } = require('express');
const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [];

function logRequest(request, response, next) {
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next();
}

function validateProjectId(request, response, next) {
    const {id} = request.params;

    if(!isUuid(id)){
        return response.status(400).json({ error: "Invalid Id Project."})
    }

    return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

/*EXEMPLO UTILIZANDO QUERY PARAMS*/ 
app.get('/projects', logRequest, (request, response) => {
    
    /*const {title, page} = request.query;

    console.log(title);
    console.log(page);*/
   
    return response.json(projects);
});

app.post('/projects', (request, response) => {
    const {title, owner} = request.body;

    const project = {id: uuid(), title, owner};

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', validateProjectId, (request, response) => {
    
    const {id} = request.params;
    const {title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id == id);
    
    if(projectIndex < 0){
        return response.status(400).json({ error: "Project not found."});
    }

    const project = {
        id, 
        title, 
        owner
    }

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', validateProjectId, (request, response) => {
    
    const {id} = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);
    
    if(projectIndex < 0){
        return response.status(400).json({ error: "Project not found."});
    }

    projects.splice(projectIndex, 1); //Informa qual posição quer remover e quantas posições quer remover a partir do índice;
    
    return response.status(204).send();
});

app.listen(3333, () => {
    console.log("✔ Back-end started!")
});