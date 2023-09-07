import Utils from "./Utils.mjs";

class Datasource
{
  // return column definitions
  Get_Columns()
  {
  }

  // update data
  async Update_Data(filter_by, sort_by)
  {
  }

  // return length of data
  Get_Data_Length(filter_by, sort_by)
  {
  }

  // return a page's worth of data
  Get_Page_Data(filter_by, sort_by, limit, offset)
  {
  }

  // return a single row of data
  Get_Row_Data(row)
  {
    return row;
  }

  // return a cell's worth of data
  Get_Cell_Data(col_id, customer)
  {
  }
}

// must implement Get_Data_Length, Get_Page_Data
class Server_Paging extends Datasource
{
}
Datasource.Server_Paging = Server_Paging;

class Client_Paging extends Datasource
{
  Get_Data_Length(filter_by, sort_by)
  {
    let res = 0;
    if (!Utils.isEmpty(this.data))
    {
      res = this.data.length;
    }
    return res;
  }

  Get_Page_Data(filter_by, sort_by, limit, offset)
  {
    let res;
    if (!Utils.isEmpty(this.data))
    {
      res = this.data.slice(offset, offset+limit);
    }
    return res;
  }
}
Datasource.Client_Paging = Client_Paging;

class Memory
{
  Get_Data_Length(filter_by, sort_by)
  {
    let res = 0;
    if (!Utils.isEmpty(this.data))
    {
      res = this.data.length;
    }
    return res;
  }

  Get_Page_Data(filter_by, sort_by, limit, offset)
  {
    let res;
    if (!Utils.isEmpty(this.data))
    {
      res = this.data.slice(offset, offset+limit);
    }
    return res;
  }
}
Datasource.Memory = Memory;

export default Datasource;