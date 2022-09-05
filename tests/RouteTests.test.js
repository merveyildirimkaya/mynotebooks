const request = require('supertest');
const app = require("../app")
const testData = require("./jsonData/testData.json")

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

    it('should not post user if the userName is already in use', async()=> {
      const res =  await request(app).post('/user/register').set('Accept', 'application/json').send(testData.user) 

         expect(res.status).toBe(400)
         expect(res.body.message).toBe("Username is already in use")
       
     });
    
    it('should not post user if there is validation error ', async()=> {
      const res =  await request(app).post('/user/register').set('Accept', 'application/json').send(testData.invalidUser) 

         expect(res.status).toBe(400)
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

     it('should return bad req if password is wrong while logging in', async()=> {
      const res =  await request(app).post('/user/login').set('Accept', 'application/json').send(testData.badReq) 
         
          expect(res.status).toBe(400)
          expect(res.body.message).toBe("BadRequestError: Invalid Credentials")
          expect(res.body.token).toBeUndefined()

     });

     it('should return not found if user has not registered yet', async()=> {
      const res =  await request(app).post('/user/login').set('Accept', 'application/json').send(testData.notFound) 
          expect(res.status).toBe(400)
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

     it('should not update profile if the username is already in use by another user', async()=> {
      const res =  await request(app).patch('/user').set('Accept', 'application/json')
      .set('Authorization',token).send(testData.updateError) 
         
          expect(res.status).toBe(400)
          expect(res.body.message).toBe("Username is already in use")

     });

     it('should change password', async()=> {
      const res =  await request(app).patch('/user/changePassword').set('Accept', 'application/json')
      .set('Authorization',token).send(testData.changePassword) 
         
          expect(res.status).toBe(200)
          expect(res.body.user).toBe(testData.update.userName)
          expect(res.body.message).toBe("Password has been changed")

     });

     it('should throw auth error if user has not provided any jwt token', async()=> {
      const res =  await request(app).patch('/user/changePassword').set('Accept', 'application/json')
      .send(testData.changePassword) 
         
          expect(res.status).toBe(400)
          expect(res.body.message).toBe("UnauthorizedError: Please first login!")
     });

     it('should not change password if token is not valid', async()=> {
      const res =  await request(app).patch('/user/changePassword').set('Accept', 'application/json')
      .set('Authorization',"randomletters").send(testData.changePassword) 
         
          expect(res.status).toBe(400)
          expect(res.body.message).toBe("jwt malformed")

     });
 

    })
  
    describe('Notebook Route', function() {
    
      it('zero notebooks', async()=> {
  
        const res =  await request(app).get('/notebooks').set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(400)
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

     it('should not create notebook if there is a validation error', async()=> {
 
      const res =  await request(app).post('/notebooks').set('Accept', 'application/json')
      .set('Authorization',token).send(testData.notebookError) 
         
          expect(res.status).toBe(400)
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

       it('sould not create card if it already exists', async()=> {
    
        const res =  await request(app).post('/cards/'+ notebookId).set('Accept', 'application/json')
        .set('Authorization',token).send(testData.card) 
           
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("BadRequestError: Already Exists!")
       });

       it('should not create card if the notebook belongs to any another user', async()=> {
    
        const res =  await request(app).post('/cards/'+ testData.helperCard.notebookId).set('Accept', 'application/json')
        .set('Authorization',token).send(testData.card) 
           
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("ForbiddenError: Access denied!")

    
       });
       it('should not get cards of any other user', async()=> {
    
        const res =  await request(app).get('/cards/getAll/'+ testData.helperCard.notebookId).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("ForbiddenError: Access denied!")
    
       });

       it('get cards', async()=> {
    
        const res =  await request(app).get('/cards/getAll/'+ notebookId).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(200)
            expect(res.body).toHaveLength(1)
    
       });

                 
       it('dont get card of any other user', async()=> {
    
        const res =  await request(app).get('/cards/'+ testData.helperCard._id).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(400)
            expect(res.body.message).toBe("ForbiddenError: Access denied!")
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
    
       it('dont update card of any other user', async()=> {
    
        const res =  await request(app).patch('/cards/'+ testData.helperCard._id).set('Accept', 'application/json')
        .set('Authorization',token).send(testData.cardUpdate)
           
           
        expect(res.status).toBe(400)
        expect(res.body.message).toBe("ForbiddenError: Access denied!")
    
    
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

      it('should not delete any card of any other user', async()=> {
    
        const res =  await request(app).delete('/cards/'+ testData.helperCard._id).set('Accept', 'application/json')
        .set('Authorization',token)
           
        expect(res.status).toBe(400)
        expect(res.body.message).toBe("ForbiddenError: Access denied!")
    
       });  

      it('delete card by Id', async()=> {
    
        const res =  await request(app).delete('/cards/'+ cardId).set('Accept', 'application/json')
        .set('Authorization',token)
           
            expect(res.status).toBe(200)
            expect(res.body.message).toBe("card has been deleted")
    
       });

       it('should not delete notebook of any other user',async function(){

        const resp =  await request(app).post('/user/login').set('Accept', 'application/json').send(testData.helperUser) 
        wrongToken = resp.body.token
        
        const res = await request(app).delete('/notebooks/'+notebookId).set('Accept', 'application/json')
        .set('Authorization',wrongToken)

        expect(res.status).toBe(400)
        expect(res.body.message).toBe("ForbiddenError: Access denied!")
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

  
 
    
    
