const request = require('supertest');
const app = require("../app")
const testData = require("./jsonData/testData.json")
describe('User Route', function() {

  var token ;
 
    it('should post user', async()=> {
     const res =  await request(app).post('/user/register').set('Accept', 'application/json').send(testData.user) 
        
        expect(res.status).toBe(200)
        expect(res.body.name).toBe(testData.user.name)
        expect(res.body.surname).toBe(testData.user.surname)
        expect(res.body.userName).toBe(testData.user.userName)
        expect(res.body.password).toBeUndefined()
      
    });

    it('should login', async()=> {
      const res =  await request(app).post('/user/login').set('Accept', 'application/json').send(testData.login) 
         
          expect(res.status).toBe(200)
          expect(res.body.user.userName).toBe(testData.login.userName)
          expect(res.body.token).not.toBeNull()

          token = res.body.token
     });

     it('should return bad req', async()=> {
      const res =  await request(app).post('/user/login').set('Accept', 'application/json').send(testData.badReq) 
         
          expect(res.status).toBe(200)
          expect(res.body.message).toBe("Invalid Credentials")
          expect(res.body.statusCode).toBe(400)
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

     it('should change password', async()=> {
      const res =  await request(app).patch('/user/changePassword').set('Accept', 'application/json')
      .set('Authorization',token).send(testData.changePassword) 
         
          expect(res.status).toBe(200)
          expect(res.body.user).toBe(testData.update.userName)
          expect(res.body.message).toBe("Password has been changed")

     });

     it('should delete user', async()=> {
      const res =  await request(app).delete('/user').set('Accept', 'application/json')
      .set('Authorization',token)
         
          expect(res.status).toBe(200)
          expect(res.body.message).toBe("User has been deleted")

     });

  });

