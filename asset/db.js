
const { response } = require('express');
const { Pool } = require('pg');
const request = require('request');
const config = require('./config');
const pool = new Pool(config.db);

const getListGroup = (request,response) =>{
  pool.query('Select * from groups',(error,results) => {
    if  (error){
      throw error
    }
    response.status(200).json(results.rows);
  });
}

const addGroup = (request,response) => {
  const {groupId} = request.body;
  pool.query = ('Insert into groups (group) values ($1)',[groupId], (error,results) => {
    if(error){
      throw error;
    }
    response.status(201).send(`Đã thêm group id vào csdl`)
  })
}

module.exports = {
  getListGroup,
  addGroup
}