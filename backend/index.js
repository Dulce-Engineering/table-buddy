const fs = require("fs");
const express = require("express");
const RPC_Buddy = require("rpc-buddy");
const Db_Sqlite = require("db-buddy/Db_Sqlite");
const Sales_Customers = require('./Sales_Customers');

const db = new Db_Sqlite({filename: ":memory:"});
Init(db);
async function Init(db)
{
  let sql = fs.readFileSync('backend/sql/create-tables.sql', 'utf8');
  await db.Exec(sql);

  sql = fs.readFileSync('backend/sql/load-data.sql', 'utf8');
  await db.Exec(sql);
}

const app = express();
app.use(express.json());
app.use(express.static('frontend'));

const rpc_buddy = new RPC_Buddy
(
  app, 
  '/rpc-server', 
  '/rpc-client',
  [Sales_Customers],
  [
    {name: "Sales_Customers.Count_All", inject: [db]},
    {name: "Sales_Customers.Get_All", inject: [db]},
    {name: "Sales_Customers.Get_All_Ids", inject: [db]},
    {name: "Sales_Customers.Get_All_Ids2", inject: [db]},
    {name: "Sales_Customers.Get_By_Id", inject: [db]},
  ],
  RPC_Buddy.Express
);

app.listen(80, Listen);
function Listen()
{
  console.log("Table Buddy listening at http://localhost");
}