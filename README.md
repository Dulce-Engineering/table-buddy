# Table Buddy
Finally, what the world needs! Another table component. This one is:
- Built with the fastest, most well-known, and best supported framework. Vanilla JS
- Built with the industry standard Web Components APIs
- Not dependant on any other libraries (though sample code makes use of SQLite, Filter Buddy, etc.)
- Designed for integration with back-end API data sources.
- Useable in the lesser web frameworks (React, Vue, etc)

## To Build & Run Samples
```
npm i
cd frontend
npm i
cd ..
npm start
```
Open your browser and navigate to http://localhost

## Sample Usage
To use Table Buddy one needs to:
1. Declare a Datasource class
2. Define the required columns
3. Indicate which API calls to make
4. Define how cells are rendered 

The following example shows the relevant bits for defining a simple datasource (Datasource.Memory)
to read customer data from a backend API (Sales_Customers.Get_All). Additional datasource types exist for more complex scenarios.

```
<script>
  class Customer_Ds extends Datasource.Memory
  {
    Get_Columns()
    {
      return [
        {title: "Name"}, 
        {title: "Contact"}, 
        {title: "Address"}];
    }

    async Update_Data(filter_by, sort_by)
    {
      this.data = await Sales_Customers.Get_All(filter_by, sort_by);
    }
    
    Get_Cell_Data(col_id, customer)
    {
      let res = "";

      switch(col_id)
      {
        case 0: res = customer.first_name + " " + customer.last_name; break;
        case 1: res = customer.phone + ", " + customer.email; break;
        case 2: res = customer.street + ", " + customer.city + ", " + customer.state; break;
      }

      return res;
    }
  }

  document.getElementById("table_id").datasource = new Customer_Ds();
</script>

<body>
  <table-buddy id="table_id"></table-buddy>
</body>

```

## To Do
- Row number column
- Row select column
- Support multi-row select
- Show/Hide columns
- Set column positions
- Order by column