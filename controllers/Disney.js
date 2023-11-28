const {request, response} = require('express');
const Pelimodels = require('../models/Disney');
const pool=require('../db');

////////////////////////////////////////////////////////////////////////////////////////////////////
const listDisney = async (req = request, res = response) => {
    let conn; 

    try{
        conn = await pool.getConnection();

    const disneymovies = await conn.query (Pelimodels.getAll, (err)=>{
        if(err){
            throw err
        }
    });

    res.json(disneymovies);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
    
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const listDisneyByID = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)) {
        res.status(400).json({msg: 'Invalid ID'});
        return;
    }

    let conn; 
    try{
        conn = await pool.getConnection();

    const [Disney] = await conn.query (Pelimodels.getByID, [id], (err)=>{
        if(err){
            throw err
        }
    });

    if (!Disney) {
        res.status(404).json({msg: 'Peli not foud'});
        return;
    }
    
    
    res.json(Disney);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////


const addPeli =async(req = request, res= response)=>{
    let conn;
    const {
        movie_title,
        release_date,
        genre,
        mpaa_rating,
        total_gross,
        inflation_adjusted_gross,
    } = req.body;

    if (!movie_title|| !release_date|| !genre|| !mpaa_rating|| !total_gross|| !inflation_adjusted_gross){
res.status(400).json({msg:'Missing informarion'});
return;
        }

        const Disney= [movie_title, release_date, genre, mpaa_rating, total_gross, inflation_adjusted_gross]


    
    try {

        conn = await pool.getConnection();
        
        const [PelinameUser] = await conn.query(
            Pelimodels.getByPeliname,
            [movie_title],
            (err) => {if (err) throw err;}
        );
        if (PelinameUser){
            res.status(409).json({msg:`User with username ${movie_title} already exists`});
            return;
        }

                
        const userAdded = await conn.query(Pelimodels.addRow,[...Disney],(err)=>{

        })
        
        if (userAdded.affecteRows === 0) throw new Error ({msg:'Failed to add user'});
        res.json({msg:'User add succesfully'});
    }catch(error){
console.log(error);
res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}


//Update del profe Julio ///////////////////////////////////////////////////////////////////////////

const updatePeli=async(req, res)=>{
  const {
    movie_title,
        release_date,
        genre,
        mpaa_rating,
        total_gross,
        inflation_adjusted_gross,
  } = req.body;

const {id} = req.params;
let newPeliData=[
    movie_title,
    release_date,
    genre,
    mpaa_rating,
    total_gross,
    inflation_adjusted_gross,  
];
let conn;
try{
  conn = await pool.getConnection();
const [userExists]=await conn.query(
    Pelimodels.getByID,
  [id],
  (err) => {if (err) throw err;}
);
if (!userExists || userExists.total_gross === 0){
  res.status(404).json({msg:'User not found'});
  return;
}

const [usernamePeli] = await conn.query(
    Pelimodels.getByPeliname,
  [movie_title],
  (err) => {if (err) throw err;}
);
if (usernamePeli){
  res.status(409).json({msg:`User with username ${movie_title} already exists`});
  return;
}


const oldpeliData = [
  userExists.movie_title,
  userExists.release_date,
  userExists.genre,
  userExists.mpaa_rating,
  userExists.total_gross,
  userExists.inflation_adjusted_gross
];

newPeliData.forEach((userData, index)=> {
  if (!userData){
    newPeliData[index] = oldpeliData[index];
  }
})

const userUpdate = await conn.query(
    Pelimodels.updatePeli,
  [...newPeliData, id],
  (err) => {if (err) throw err;}
);
if(userUpdate.affecteRows === 0){
  throw new Error ('User not updated');
}
res.json({msg:'User updated successfully'})
}catch (error){
      console.log(error);
      res.status(500).json(error);
  } finally{
      if (conn) conn.end();
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
const deletePeli = async (req, res)=>{
    let conn;

    try{
        conn = await pool.getConnection();
        const {id} =req.params;
        const [userExists] =await conn.query(
            Pelimodels.getByID,
            [id],
            (err) => {if (err) throw err;}
        );
        if(!userExists || userExists.total_gross === 0){
            res.status(404).json({msg:'User not Found'});
            return;
        }

        const PeliDelete = await conn.query(
            Pelimodels.deleteRow,
            [id],
            (err) => {if(err)throw err;}
        );
        if (PeliDelete.affecteRows===0){
            throw new Error({msg:'failed to delete user'})
        };
        res.json({msg:'user deleted succesfully'});
    }catch(error){
        console.log(error);
        res.status(500).json(error);

    }finally{
       if(conn) conn.end(); 
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports={listDisney,listDisneyByID, addPeli, updatePeli, deletePeli};