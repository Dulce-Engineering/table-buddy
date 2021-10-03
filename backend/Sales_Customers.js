const Utils = require('./Utils');

class Sales_Customers
{
  static table = "sales_customers";

  static Get_Query(filter_by, sort_by)
  {
    let where = "", order_by = "", params = [];
    if (filter_by)
    {
      where = "where (first_name || ' ' || last_name || ' ' || email) like ?";
      params.push("%" + filter_by + "%");
    }
    if (sort_by)
    {
      switch (sort_by)
      {
        case "FIRSTNAME_ASC": order_by = "order by first_name asc"; break;
        case "FIRSTNAME_DSC": order_by = "order by first_name desc"; break;
        case "LASTNAME_ASC": order_by = "order by last_name asc"; break;
        case "LASTNAME_DSC": order_by = "order by last_name desc"; break;
      }
    }

    return {where, order_by, params};
  }

  static Count_All(db, filter_by)
  {
    const query = Sales_Customers.Get_Query(filter_by);
    query.sql = "select count(*) from sales_customers " + query.where;
    
    return db.Select_Value(query.sql, query.params);
  }

  static Get_All(db, filter_by, sort_by, limit, offset)
  {
    const query = Sales_Customers.Get_Query(filter_by, sort_by);
    query.sql = 
      "select * from sales_customers " + 
      query.where + " " + 
      query.order_by;
    if (limit)
    {
      query.sql += " limit ?";
      query.params.push(limit);
    }
    if (offset)
    {
      query.sql += " offset ?";
      query.params.push(offset);
    }

    return db.Select_Objs(Sales_Customers, query.sql, query.params);
  }

  static Get_All_Ids(db, filter_by, sort_by)
  {
    const query = Sales_Customers.Get_Query(filter_by, sort_by);
    query.sql = 
      "select customer_id from sales_customers " + 
      query.where + " " + 
      query.order_by;
    return db.Select_Values(query.sql, query.params);
  }

  static Get_All_Ids2(db, filter_by, sort_by)
  {
    let where = "", order_by = "", params = [];

    if (filter_by && filter_by.CONTAINS)
    {
      where = Utils.Append_Str(where, "(first_name || ' ' || last_name || ' ' || email) like ?", " and ");
      params.push("%" + filter_by.CONTAINS + "%");
    }
    if (filter_by && filter_by.FIRSTNAME)
    {
      where = Utils.Append_Str(where, "first_name like ?", " and ");
      params.push("%" + filter_by.FIRSTNAME + "%");
    }
    if (filter_by && filter_by.SURNAME)
    {
      where = Utils.Append_Str(where, "last_name like ?", " and ");
      params.push("%" + filter_by.SURNAME + "%");
    }
    if (filter_by && filter_by.ADDRESS)
    {
      where = Utils.Append_Str(where, "(street || ' ' || city || ' ' || state || ' ' || zip_code) like ?", " and ");
      params.push("%" + filter_by.ADDRESS + "%");
    }

    if (sort_by)
    {
      switch (sort_by)
      {
        case "FIRSTNAME_ASC": order_by = "first_name asc"; break;
        case "FIRSTNAME_DSC": order_by = "first_name desc"; break;
        case "LASTNAME_ASC": order_by = "last_name asc"; break;
        case "LASTNAME_DSC": order_by = "last_name desc"; break;
      }
    }

    const sql = 
      "select customer_id from sales_customers " + 
      (where!="" ? "where " + where + " ": "") + 
      (order_by!="" ? "order by " + order_by: "");
    return db.Select_Values(sql, params);
  }

  static Get_By_Id(db, id)
  {
    return db.Select_Obj(Sales_Customers, "select * from sales_customers where customer_id=?", [id]);
  }
}

module.exports = Sales_Customers;