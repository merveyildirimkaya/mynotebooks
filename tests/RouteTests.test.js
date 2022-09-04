const request = require('supertest');
const app = require("../app")
const testData = require("./jsonData/testData.json")
const db = require("../utils/db/dbConnection")
describe('User Route', function() {
 

  var token ;
  var user;
  var notebookId;
  var cardId;
  var wrongToken



   describe("User Route", function(){
    it('should post user', async()=> {
     const res =  await request(app).post('/user/register').set('Accept', 'application/json').send(testData.user) 
        
        expect(res.status).toBe(200)
        expect(res.body.name).toBe(testData.user.name)
        expect(res.body.surname).toBe(testData.user.surname)
        expect(res.body.userName).toBe(testData.user.userName)
        expect(res.body.password).toBeUndefined()
      
    });

    it('should post user', async()=> {
      const res =  await request(app).post('/user/register').set('Accept', 'application/json').send(testData.user) 

         expect(res.status).toBe(200)
         expect(res.body.statusCode).toBe(11000)
         expect(res.body.message).toBe("Credential is already in use")
       
     });
    
    it('should not post user', async()=> {
      const res =  await request(app).post('/user/register').set('Accept', 'application/json').send(testData.invalidUser) 

         expect(res.status).toBe(200)
         expect(res.body.message).toBe("BadRequestError: Bad Request")
       
     });
 

    it('should login', async()=> {
      const res =  await request(app).post('/user/login').set('Accept', 'application/json').send(testData.login) 
    
          expect(res.status).toBe(200)
          expect(res.body.user.userName).toBe(testData.login.userName)
          expect(res.body.token).not.toBeNull()

          user = res.body.user
          token = res.body.token
     });

     it('should return bad req', async()=> {
      const res =  await request(app).post('/user/login').set('Accept', 'application/json').send(testData.badReq) 
         
          expect(res.status).toBe(200)
          expect(res.body.message).toBe("BadRequestError: Invalid Credentials")
          expect(res.body.token).toBeUndefined()

     });

     it('should return not found', async()=> {
      const res =  await request(app).post('/user/login').set('Accept', 'application/json').send(testData.notFound) 
         ///HATAYA STATUS KOD VE MESAJ YOLLA
          expect(res.status).toBe(200)
          expect(res.body.message).not.toBeNull()
          expect(res.body.token).toBeUndefined()

     });

     it('should update profile', async()=> {
      const res =  await request(app).patch('/user').set('Accept', 'application/json')
      .set('Authorization',token).send(testData.update) 

          expect(res.status).toBe(200)
          expect(res.body.name).toBe(testData.update.name)
          expect(res.body.surname).toBe(testData.update.surname)
          expect(res.body.userName).toBe(testData.update.userName)
          expect(res.body.password).toBeUndefined()

     });

     it('should not update profile', async()=> {
      const res =  await request(app).patch('/user').set('Accept', 'application/json')
      .set('Authorization',token).send(testData.updateError) 
         
          expect(res.status).toBe(200)
          expect(res.body.message).not.toBeNull()

     });

     it('should change password', async()=> {
      const res =  await request(app).patch('/user/changePassword').set('Accept', 'application/json')
      .set('Authorization',token).send(testData.changePassword) 
         
          expect(res.status).toBe(200)
          expect(res.body.user).toBe(testData.update.userName)
          expect(res.body.message).toBe("Password has been changed")

     });

     it('should throw auth error', async()=> {
      const res =  await request(app).patch('/user/changePassword').set('Accept', 'application/json')
      .send(testData.changePassword) 
         
          expect(res.status).toBe(200)
          expect(res.body.message).toBe("UnauthorizedError: Please login to view this page.")
     });

     it('should change password', async()=> {
      const res =  await request(app).patch('/user/changePassword').set('Accept', 'application/json')
      .set('Authorization',"randomletters").send(testData.changePassword) 
         
          expect(res.status).toBe(200)
          expect(res.body.message).toBe("jwt malformed")

     });
 

    })
  
    describe('Notebook Route', function() {
    
      it('zero notebooks', async()=> {
  
        const res =  await request(app).get('/notebooks').set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("NotFoundError: Not Found")
    
       });

    it('create notebook', async()=> {
 
      const res =  await request(app).post('/notebooks').set('Accept', 'application/json')
      .set('Authorization',token).send(testData.notebook) 
         
          expect(res.status).toBe(200)
          expect(res.body.userId).toBe(user._id)
          expect(res.body._id).not.toBeNull()
          expect(res.body.language).toBe(testData.notebook.language)
  
          notebookId=res.body._id
  
     });

     it('dont create notebook', async()=> {
 
      const res =  await request(app).post('/notebooks').set('Accept', 'application/json')
      .set('Authorization',token).send(testData.notebookError) 
         
          expect(res.status).toBe(200)
          expect(res.body.message).not.toBeNull()
    
     });
  
     
    it('get notebooks', async()=> {
  
      const res =  await request(app).get('/notebooks').set('Accept', 'application/json')
      .set('Authorization',token)
         
          expect(res.status).toBe(200)
          expect(res.body).toHaveLength(1)
  
     });

    });

    


    describe('Card Route', function() {
    
      it('create card', async()=> {
    
        const res =  await request(app).post('/cards/'+ notebookId).set('Accept', 'application/json')
        .set('Authorization',token).send(testData.card) 
           
            expect(res.status).toBe(200)
            expect(res.body.notebookId).not.toBeNull()
            expect(res.body._id).not.toBeNull()
            expect(res.body.type).toBe(testData.card.type)
            expect(res.body.phrase).toBe(testData.card.phrase)
            expect(res.body.definition).toBe(testData.card.definition)
            expect(res.body.tabooOne).toBe(testData.card.tabooOne)
            expect(res.body.tabooTwo).toBe(testData.card.tabooTwo)
            expect(res.body.tabooThree).toBe(testData.card.tabooThree)
    
            cardId= res.body._id
    
       });
       it('dont create card', async()=> {
    
        const res =  await request(app).post('/cards/'+ testData.helperCard.notebookId).set('Accept', 'application/json')
        .set('Authorization',token).send(testData.card) 
           
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("UnauthorizedError: Access denied!")

    
       });
       it('should not get cards', async()=> {
    
        const res =  await request(app).get('/cards/getAll/'+ testData.helperCard.notebookId).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("UnauthorizedError: Access denied!")
    
       });

       it('get cards', async()=> {
    
        const res =  await request(app).get('/cards/getAll/'+ notebookId).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(200)
            expect(res.body).toHaveLength(1)
    
       });

                 
       it('dont get card by Id', async()=> {
    
        const res =  await request(app).get('/cards/'+ testData.helperCard._id).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("UnauthorizedError: Access denied!")
       });

       it('get card by Id', async()=> {
    
        const res =  await request(app).get('/cards/'+ cardId).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(200)
            expect(res.body.type).toBe(testData.card.type)
            expect(res.body.phrase).toBe(testData.card.phrase)
            expect(res.body.definition).toBe(testData.card.definition)
            expect(res.body.tabooOne).toBe(testData.card.tabooOne)
            expect(res.body.tabooTwo).toBe(testData.card.tabooTwo)
            expect(res.body.tabooThree).toBe(testData.card.tabooThree)
    
    
       });
    
       it('dont update card by Id', async()=> {
    
        const res =  await request(app).patch('/cards/'+ testData.helperCard._id).set('Accept', 'application/json')
        .set('Authorization',token).send(testData.cardUpdate)
           
           
        expect(res.status).toBe(200)
        expect(res.body.message).toBe("UnauthorizedError: Access denied!")
    
    
       });

       it('update card by Id', async()=> {
    
        const res =  await request(app).patch('/cards/'+ cardId).set('Accept', 'application/json')
        .set('Authorization',token).send(testData.cardUpdate)
           
            expect(res.status).toBe(200)
            expect(res.body.type).toBe(testData.cardUpdate.type)
            expect(res.body.phrase).toBe(testData.cardUpdate.phrase)
            expect(res.body.definition).toBe(testData.cardUpdate.definition)
            expect(res.body.tabooOne).toBe(testData.cardUpdate.tabooOne)
            expect(res.body.tabooTwo).toBe(testData.cardUpdate.tabooTwo)
            expect(res.body.tabooThree).toBe(testData.cardUpdate.tabooThree)
    
    
       });
    
      
    })

    describe("delete functions", function(){

      it('dont delete card by Id', async()=> {
    
        const res =  await request(app).delete('/cards/'+ testData.helperCard._id).set('Accept', 'application/json')
        .set('Authorization',token)
           
        expect(res.status).toBe(200)
        expect(res.body.message).toBe("UnauthorizedError: Access denied!")
    
       });  

      it('delete card by Id', async()=> {
    
        const res =  await request(app).delete('/cards/'+ cardId).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("card has been deleted")
    
       });

       it('should not delete notebook',async function(){

        const resp =  await request(app).post('/user/login').set('Accept', 'application/json').send(testData.helperUser) 
        wrongToken = resp.body.token
        
        const res = await request(app).delete('/notebooks/'+notebookId).set('Accept', 'application/json')
        .set('Authorization',wrongToken)

        expect(res.status).toBe(200)
        expect(res.body.message).toBe("UnauthorizedError: Access denied!")
       })
       
     
       it('delete notebook', async()=> {
  
        const res =  await request(app).delete('/notebooks/'+notebookId).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("notebook has been deleted")
    
       });

       it('should delete user', async()=> {
        const res =  await request(app).delete('/user').set('Accept', 'application/json')
        .set('Authorization',token)
       
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("User has been deleted")
  
       });
    })
    
  });

  
 
    
    
