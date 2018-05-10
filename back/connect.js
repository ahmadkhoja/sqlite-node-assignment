const port = 8888
const express = require('express')
const bodyParser = require('body-parser')
const server = express()
const sqlite3 = require('sqlite3').verbose();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.listen(port,(err)=>{
  if(err){
      console.log('cannot connect to the server')
  }else{
      console.log(`listining to port ${port}`)
  }
})
// open database in memory
let db = new sqlite3.Database('./db/mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the database named mydatbase');
});

server.get('/', ( req, res ) => {
  db.all('SELECT * FROM movies', [], (err, rows) => {
    if (err) {
      throw err;
    }
      res.send({movies:rows})
  });
})

server.post('/create_movie', (req, res) => {
  console.log('you posted to /create_movie');
  const { name, genre } = req.body
  if(!name){
    res.send('name is required')
    return 
  }
  if(!genre){
    res.send('genre is required')
    return
  }
  if(!name || !genre){
    return res.send({error:'blah'})
  }
  db.run('INSERT INTO movies (name, genre) VALUES (?, ?)', [ name, genre ], function(err) {
    if (err) {
      return res.send(err.message);
    }
    // get the last insert id
    res.redirect('/')
  });
  // insert(name,genre)
  // res.send(req.body)
});
server.get('/edit/:id', ( req, res ) => {
  const id = req.params.id
  db.get('SELECT * FROM movies WHERE id = ?', id, ( err, movie ) => {
    if(err){
      return res.send(err.message)
    }
    if(!movie){
      return res.send('movie not found')
    }
    const form = `
    <form action="/update/`+id+`">
      <input value="`+movie.Name+`" type="text" name="name"  placeholder="name"/>
      <input value="`+movie.Genre+`" type="text" name="genre" placeholder="genre"/>
      <input type="submit" value="ok"/>
    </form>`
    res.send(form)
    // res.redirect('//localhost:3000/')
    // res.send({movie})
  })
})
server.get('/update/:id', ( req, res ) => {
  const id = req.params.id
  const name = req.query.name
  const genre = req.query.genre
  db.run('UPDATE movies SET name = ?, genre = ? WHERE id = ?', [ name, genre, id ], function(err) {
    if (err) {
      return res.send(err.message);
    }
    res.redirect('/edit/'+id)
  });
})

// localhost:3000/delete/<id>
server.get('/delete/:id', ( req, res ) => {
  const id = req.params.id
  db.run(`DELETE FROM movies WHERE id = ?`, id, function(err) {
    if (err) {
      return res.send(err.message);
    }
    if(this.changes === 0){
      return res.send("I didn't delete anything")
    }
    res.redirect('//localhost:3000/')
  });
})

// list()
// console.log(process.argv)
//Do it from command line
// const args = process.argv.slice(2)
// const command = args[0]
// const name = args[1]
// const genre = args[2]

// if(command === '-a' || command === '-add'){
//   if(!name){
//     console.error('you have to provide a name')
//   }
//   if(!genre){
//     console.error('you have to provide a genre')
//   }
//   else if(command === 'list'){
//     list()
//   }
  
//   insert(name,genre)
//   // console.log(args)
//   console.log(' name: ', name,' genre: ', genre)
  
// }

// insert('ifeuwb','efihb')


  // server.get('/delete/:id',(req,res) => {
  //   const id = req.params.id
  //   db.run(`DELETE FROM movies WHERE id=?`, id, function(err) {
  //     if (err) {
  //       return res.send(err.message);
  //     }
  //     if(this.changes === 0 ){
  //       return res.send("I didn't delete anything");        
  //     }
  //     res.redirect('/')
  //   });
  // })

  //add (not finished yet)
  // server.get('/add/:id',(req,res) => {
  //   const name = req.query.name
  //   const genre = req.query.genre
  // sql = `insert into movies ('id','name','genre') values ('30','`+name+`','`+genre+`')`;
  // db.all(sql, [], (err, rows) => {
  //     if (err) {
  //       throw err;
  //     }
  //     rows.forEach((row) => {
  //       console.log(row);
  //     });
  // res.redirect('/')
    // });
  // })

  // server.get('/form', (req,res) => {
  //   const form = `
  //     <form action="/add">
  //     <input type="text" name="name"  placeholder="name"/>
  //     <input type="text" name="genre" placeholder="genre" />
  //     <input type="submit" />
  //     </form>
  //   `;
  // })

  //delete not finished yet
  // db.all('SELECT * FROM movies ', [], (err, rows) => {
  //   if (err) {
  //     throw err;
  //   }
  // rows.forEach((row) => {
  //   console.log(row.name,'/t',row.genre)+`<a href="/delete/"+`+row.id+`+'>'+</a>' `;
  // });
  // });
