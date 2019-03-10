const pg = require('pg'); 
const express = require('express')
const bodyParser = require('body-parser'); 
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs'); 

const app = express()
app.use(bodyParser.json())
app.use(cors())

const db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Poo123318!',
      database : 'enis'
    }
  });


  app.post('/signin', (req,res) => { 
      const {email, password} = req.body;   
      db.select('email', 'hash').from('users')
      .where('email', '=', email).then(data => {  
          const isValid = bcrypt.compareSync(password, data[0].hash)
          if(isValid) { 
             res.json(data[0])
             console.log(data[0])
          } else { 
            res.status(400).json('wrong username or password')
          }
          
      }).catch(err => res.status(400).json(err))
     
  })

  app.post('/register', (req,res) => { 
    const {name,email,password} = req.body;
    let passencrypted = bcrypt.hashSync(password)
    const date = new Date() 
    db('users').insert([{name: name, email: email, hash: passencrypted, joined: date}])
  .then(data => { 
      console.log(data)
      res.json(data)
  })
  })
  
 

  app.listen(3000, () => console.log('server running'))

 