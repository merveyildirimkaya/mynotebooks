const request = require('supertest');
const app = require("../app")
const notebook = require("./jsonData/notebookTestData.json")

describe('Notebook Route', function() {
   
  var token 
  var notebookId

  it('create notebook', async()=> {
    const user =  await request(app).post('/user/login').set('Accept', 'application/json').send(notebook.loginUser) 
    token = user.body.token
    

    const res =  await request(app).post('/notebooks').set('Accept', 'application/json')
    .set('Authorization',token).send(notebook.notebook) 
       
        expect(res.status).toBe(200)
        expect(res.body.user).toBe(user.body.user._id)
        expect(res.body._id).not.toBeNull()
        expect(res.body.notebook).toBe(notebook.notebook.language)

        notebookId=res.body._id

   });

   
  it('get notebooks', async()=> {

    const res =  await request(app).get('/notebooks').set('Accept', 'application/json')
    .set('Authorization',token)
       
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(1)

   });

    
  it('delete notebook', async()=> {

    const res =  await request(app).delete('/notebooks/'+notebookId).set('Accept', 'application/json')
    .set('Authorization',token)
       
        expect(res.status).toBe(200)
        expect(res.body.message).toBe("notebook has been deleted")

   });
  
  });

