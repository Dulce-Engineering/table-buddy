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
        {title: "Name", field_name: "full_name"}, 
        {title: "Contact", field_fn: (customer) => customer.phone + ", " + customer.email}, 
        {title: "Address", field_name: "address"}];
    }

    async Update_Data(filter_by, sort_by)
    {
      this.data = await Sales_Customers.Get_All(filter_by, sort_by);
    }
  }

  document.getElementById("table_id").datasource = new Customer_Ds();
</script>

<body>
  <table-buddy id="table_id"></table-buddy>
</body>

```

# Column Properties
* **id** - String, that uniquiely identifies a column.
* **title** - String, used as a column title. Rendering is dependent on the renderAs property.
* **title_fn** - Function, that returns a column title. Rendering is dependent on the renderAs property.
* **field_name** - String, that indicates the object property whose value will be rendered. Rendering is dependent on the renderAs property.
* **field_fn** - Function, that returns a value for rendering. Rendering is dependent on the renderAs property.
* **style** - String, applied to cell style property.
* **cell_class** - String, added to cell class list.
* **renderAs** - String, should be one of the following:
  * text - renders to innerText.
  * html - renders to innerHTML.
  * date - renders with Date.toLocaleDateString().
  * url - renders as Anchor tag.

# Dataset Classes
* **Datasource** - Base class can be used when no other class is suitable.
* **Datasource.Server_Paging** - Can be used when data is retrieved, page by page, from an external system. This is preferred when the complete dataset is very large. The following methods must be implemented:
  * Get_Data_Length()
  * Get_Page_Data()
* **Datasource.Client_Paging** - Can be used when data is retrieved completely in a single instance from an external system. This can be adequate for manageable dataset sizes.  The following methods must be implemented:
  * Update_Data()
* **Datasource.Memory** - Can be used when data is generated on the client or is fixed in nature.  The following methods must be implemented:
  * Update_Data()

**Note**: If the dataset consists of object IDs that require additional calls to access the relevant data, you may implement the Get_Row_Data() method to convert IDs into full objects.