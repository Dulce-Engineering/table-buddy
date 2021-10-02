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
  Get_Row_Data(row_id)
  {
  }

  // return a cell's worth of data
  Get_Cell_Data(col_id, customer)
  {
  }
}

class Server_Paging extends Datasource
{
  Get_Row_Data(row_data)
  {
    return row_data;
  }
}
Datasource.Server_Paging = Server_Paging;

class Client_Paging extends Datasource
{
  Get_Data_Length(filter_by, sort_by)
  {
    return this.data.length;
  }

  Get_Page_Data(filter_by, sort_by, limit, offset)
  {
    return this.data.slice(offset, offset+limit);
  }
}
Datasource.Client_Paging = Client_Paging;

class Memory
{
  Get_Data_Length(filter_by, sort_by)
  {
    return this.data.length;
  }

  Get_Page_Data(filter_by, sort_by, limit, offset)
  {
    return this.data.slice(offset, offset+limit);
  }

  Get_Row_Data(row_data)
  {
    return row_data;
  }
}
Datasource.Memory = Memory;

export default Datasource;