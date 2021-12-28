require('dotenv').config();
const { response } = require('express');
const { Pool } = require('pg');
const request = require('request');
const config = require('./config');
const pool = new Pool(config);

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
  pool.query = ('INSERT INTO groups (groupId) VALUES ($1) ON CONFLICT (groupId) DO UPDATE SET groupId = excluded.groupId, id = excluded.id',[groupId], (error,results) => {
    if(error){
      throw error;
      console.log(error);
    }
    response.status(201).send(`Đã thêm group id vào csdl`);
    console.log("Đã thêm group id vào csdl");

  })
}

module.exports = {
  getListGroup,
  addGroup
}