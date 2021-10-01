class Sales_Customers
{
  static table = "sales_customers";

  static Count_All(db)
  {
    return db.Select_Value("select count(*) from sales_customers");
  }

  static Get_All(db, limit, offset)
  {
    return db.Select_Objs
      (Sales_Customers, "select * from sales_customers limit ? offset ?", [limit, offset]);
  }

  static Get_All_Ids(db)
  {
    return db.Select_Values("select customer_id from sales_customers");
  }

  static Get_By_Id(db, id)
  {
    return db.Select_Obj(Sales_Customers, "select * from sales_customers where customer_id=?", [id]);
  }
}

module.exports = Sales_Customers;