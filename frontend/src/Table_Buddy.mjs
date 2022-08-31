import Utils from "./Utils.mjs";

class Table_Buddy extends HTMLElement 
{
  static tname = "table-buddy";
  
  constructor() 
  {
    super();

    this.ds = null;
    this.rows = null;
    this.order_by_code = null;
    this.filters = [];
    this.page_size = 0;
    this.page_start = 0;
    this.curr_page = 0;
    this.page_count = 0;
    this.item_count = 0;
    this.show_busy = false;
    this.columns = null;

    this.Set_Page_Size = this.Set_Page_Size.bind(this);
    this.Goto_Page = this.Goto_Page.bind(this);
    this.Goto_Prev_Page = this.Goto_Prev_Page.bind(this);
    this.Goto_First_Page = this.Goto_First_Page.bind(this);
    this.Goto_Last_Page = this.Goto_Last_Page.bind(this);
    this.Goto_Next_Page = this.Goto_Next_Page.bind(this);
    this.Row_Click = this.Row_Click.bind(this);

    this.attachShadow({mode: 'open'});
    this.updateEvent = new Event("update");
  }

  connectedCallback()
  {
    this.Render();
  }

  disconnectedCallback()
  {
    //console.log("Table_Buddy.disconnectedCallback()");
  }

  adoptedCallback()
  {

  }

  static observedAttributes = ["style-src"];
  attributeChangedCallback(attrName, oldValue, newValue)
  {
    if (attrName == "style-src")
    {
      this.style_src = newValue;
    }
  }
  
  set datasource(ds)
  {
    this.Set_Datasource(ds);
  }
  
  async Set_Datasource(ds)
  {
    this.ds = ds;
    const columns = this.Get_Columns();
    this.Render_Header_Row(columns);
    this.Render_Footer_Cells(this.footerRowElem);

    await this.Update_Render();
  }

  Get_Cell_Data(column, rowData, colIdx, rowElem, row_idx, cell_elem)
  {
    let cell_child_elems;

    if (column.field_name)
    {
      cell_child_elems = rowData[column.field_name];
    }
    if (column.field_fn)
    {
      cell_child_elems = column.field_fn(rowData, row_idx, cell_elem);
    }
    else if (this.ds.Get_Cell_Data)
    {
      cell_child_elems = this.ds.Get_Cell_Data(colIdx, rowData, rowElem);
    }

    return cell_child_elems;
  }

  Get_Header_Cell_Data(column, colIdx, rowElem)
  {
    let cellData;

    if (column.title)
    {
      cellData = column.title;
    }
    else if (column.title_fn)
    {
      cellData = column.title_fn();
    }

    return cellData;
  }

  Row_Click(event)
  {
    const clickrow_event = new CustomEvent('clickrow', { detail: event.target.parentElement.row_data });
    this.dispatchEvent(clickrow_event);
  }

  Get_Columns()
  {
    if (!this.columns && this.ds)
    {
      this.columns = [];
      let user_columns = this.ds.Get_Columns();
      for (const user_column of user_columns)
      {
        let column = user_column;
        if (!column.constructor.name.startsWith("Column_"))
        {
          column = new Column_Field();
          Object.assign(column, user_column);
        }

        column.ds = this.ds;
        column.table_buddy = this;
        this.columns.push(column);
      }
    }

    return this.columns;
  }

  // Rendering ====================================================================================

  Show_Busy()
  {
    /*if (this.show_busy)
    {
      const overlayElem = this.shadowRoot.getElementById("tableOverlay");
      overlayElem.style.display = "flex";
    }*/
  }

  Hide_Busy()
  {
    /*if (this.show_busy)
    {
      const overlayElem = this.shadowRoot.getElementById("tableOverlay");
      overlayElem.style.display = "none";
    }*/
  }

  Render_Msg(msg)
  {
    let columns_length = 1;

    const columns = this.Get_Columns();
    if (columns) columns_length = columns.length;

    const td = document.createElement("td");
    td.colSpan = columns_length;
    td.innerText = msg;

    const tr = document.createElement("tr");
    tr.append(td);

    this.bodyElem.replaceChildren(tr);
  }

  async Update_Render(is_page_update)
  {
    this.Show_Busy();
    await this.Update_Data(is_page_update);

    const columns = this.Get_Columns();
    //this.Update_Render_Header_Row(columns);
    this.Render_Header_Row(columns);
    await this.Update_Render_Body_Rows(columns, this.rows);

    this.dispatchEvent(this.updateEvent);
    this.Hide_Busy();
  }

  Update_Render_Header_Row(columns)
  {
    if (columns)
    {
      for (let i = 0; i < columns.length; i++)
      {
        const column = columns[i];
        this.Update_Render_Header_Cell(column, i);
      }
    }
    else
    {
      this.headerRowElem.replaceChildren();
    }
  }

  Update_Render_Header_Cell(column, idx)
  {
  }

  Render()
  {
    let style = `
      <style>
        :host
        {
          display: inline-block;
        }
        #tableElem
        {
          width: 100%;
        }
        #tableContainer
        {
          position: relative;
        }
        #tableOverlay
        {
          position: absolute;
          width: 100%;
          height: 100%;
          color: #000;
          background-color: #dddc;
          border-radius: 4px;
          display: none;
          justify-content: center;
          align-items: center;
          z-index: 1;
        }
        #tableOverlayGear 
        {
          animation: rotate 2s linear infinite;
          transform-origin: center center;
        }
        @keyframes rotate { 100% { transform:rotate(360deg); } }
        .disabled-row {
          opacity: .8;
          background: #cccccc;
          pointer-events: none;
        }
      </style>`;
    if (this.style_src)
    {
      style = "<link rel=\"stylesheet\" href=\"" + this.style_src + "\"></link>";
    }
    const html = `
      ${style}

      <div id="tableContainer">
        <!--div id="tableOverlay">
          <svg width="50px" height="50px" viewBox="0 0 600 600">
          <path id="tableOverlayGear"
            stroke="black" fill="#444" width="20%" height="20%"
            d="M491.103,215.312c-8.841-24.651-22.222-47.73-39.651-67.984l41.965-73.324L368.537,2.532l-41.965,73.324    
            c-26.307-4.777-52.972-4.618-78.703,0.245L205.384,3.135L81.035,75.571l42.485,72.966c-8.394,9.89-16.105,20.572-22.807,32.28    
            c-6.683,11.677-11.989,23.736-16.282,36.013L0,217.154l0.529,143.909l84.45-0.318c8.822,24.68,22.194,47.711,39.636,67.979    
            l-41.965,73.32l124.878,71.473l41.965-73.324c26.292,4.768,52.954,4.648,78.672-0.264l42.501,72.979l124.349-72.434l-42.487-72.93    
            c8.394-9.932,16.138-20.633,22.821-32.311c6.701-11.707,11.989-23.779,16.298-36.043l84.4-0.303l-0.529-143.909L491.103,215.312z     
            M413.733,359.967c-39.734,69.426-128.229,93.496-197.655,53.762s-93.495-128.23-53.761-197.655    
            c39.734-69.425,128.229-93.495,197.654-53.761C429.397,202.047,453.468,290.542,413.733,359.967z"/>
          </svg>
        </div-->
        <table id="tableElem">
          <thead><tr id="headerRowElem"></tr></thead>
          <tbody id="bodyElem">
          </tbody>
          <tfoot><tr id="footerRowElem"></tr></tfoot>
        </table>
      </div>
      `;
    const tableElem = Utils.toDocument(html);
    this.shadowRoot.append(tableElem);

    this.headerRowElem = this.shadowRoot.querySelector("#headerRowElem");
    this.bodyElem = this.shadowRoot.querySelector("#bodyElem");
    this.footerRowElem = this.shadowRoot.querySelector("#footerRowElem");
    this.Render_Msg("Please Wait...");

    return tableElem;
  }

  Render_Header_Row(columns)
  {
    this.headerRowElem.replaceChildren();
    for (let i = 0; i < columns.length; i++)
    {
      const column = columns[i];
      const cellData = this.Get_Header_Cell_Data(column, i, this.headerRowElem);
      let cellElem;
      if (column.Render_Header_Cell)
      {
        cellElem = column.Render_Header_Cell(i, cellData);
      }
      else
      {
        cellElem = this.Render_Header_Cell(column, i, cellData);
      }
      this.headerRowElem.append(cellElem);
    }
  }

  Render_Header_Cell(column, idx, cellData)
  {
    const titleElem = document.createElement("th");
    titleElem.style.width = column.width;
    if (column.style)
    {
      titleElem.style = column.style;
    }
    Table_Buddy.Render_As_Type(null, titleElem, cellData);
    titleElem.id = "title_" + idx;

    return titleElem;
  }

  async Update_Render_Body_Rows(columns, rows)
  {
    rows = await rows;
    if (rows)
    {
      this.bodyElem.replaceChildren();
      for (let row_idx = 0; row_idx < rows.length; row_idx++)
      {
        const row = rows[row_idx];
        const rowData = await this.ds.Get_Row_Data(row);
        const rowElem = this.Render_Row(columns, rowData, row_idx);
        this.bodyElem.append(rowElem);
      }
    }
    else
    {
      this.Render_Msg("No data to display.");
    }
  }

  Render_Row(columns, row_data, row_idx)
  {
    const rowElem = document.createElement("tr");
    rowElem.addEventListener("click", this.Row_Click);
    rowElem.row_data = row_data;
    for (let colIdx = 0; colIdx < columns.length; colIdx++)
    {
      const cell_elem = this.Render_Cell(columns, row_data, colIdx, rowElem, row_idx);
      rowElem.append(cell_elem);
    }

    return rowElem;
  }

  Render_Cell(columns, row_data, colIdx, rowElem, row_idx)
  {
    const column = columns[colIdx];
    const cell_elem = document.createElement("td");
    if (column.style)
    {
      cell_elem.style = column.style;
    }

    const cell_child_elems = this.Get_Cell_Data(column, row_data, colIdx, rowElem, row_idx, cell_elem);
    Table_Buddy.Render_As_Type(column, cell_elem, cell_child_elems);

    return cell_elem;
  }

  Render_Footer_Cells(parentElem)
  {
  }

  static async Render_As_Type(column, dstElem, data)
  {
    if (data)
    {
      if (data.constructor.name == "Promise")
      {
        data = await data;
      }

      const render_as = column?.renderAs || column?.render_as;
      if (render_as == "text")
      {
        dstElem.innerText = data;
      }
      else if (render_as == "html")
      {
        dstElem.innerHTML = data;
      }
      else if (render_as == "date")
      {
        const date = new Date(data);
        dstElem.append(date.toLocaleDateString());
      }
      else if (render_as == "url")
      {
        const elem = document.createElement("a");
        elem.href = data;
        elem.innerText = column.title;
        elem.target = "_blank";
        dstElem.append(elem);
      }
      else if (Array.isArray(data))
      {
        for (const elem of data)
        {
          dstElem.append(elem);
        }
      }
      else
      {
        dstElem.append(data);
      }
    }
  }

  // Update, Filter and Sort Data =================================================================

  async Update_Data(is_page_update)
  {
    if (this.ds)
    {
      if (!is_page_update)
      {
        await this.ds.Update_Data(this.filters, this.order_by_code);
        this.item_count = await this.ds.Get_Data_Length(this.filters, this.order_by_code);
      }
      if (!this.page_size)
      {
        this.page_size = this.item_count;
      }
      this.page_count = Math.ceil(this.item_count/this.page_size);
      this.rows = await this.ds.Get_Page_Data(this.filters, this.order_by_code, this.page_size, this.page_start);
    }
    else
    {
      this.item_count = 0;
      this.page_count = 1;
      this.rows = null;
    }
  }

  set order_by(order_by_code)
  {
    this.order_by_code = order_by_code;
    this.curr_page = 0;
    this.Update_Render(false);
  }

  set where(filters)
  {
    this.filters = filters;
    this.curr_page = 0;
    this.Update_Paging(false);
  }

  // Paging =======================================================================================

  Update_Paging(is_page_update)
  {
    this.page_start = this.curr_page * this.page_size;
    this.Update_Render(is_page_update);
  }

  Set_Page_Size(page_size)
  {
    page_size = parseInt(page_size);
    if (page_size > 0)
    {
      this.curr_page = 0;
      this.page_size = page_size;
      this.Update_Paging(true);
    }
  }

  Goto_Page(page_no)
  {
    page_no = parseInt(page_no);
    if (page_no >= 0 && page_no < this.page_count)
    {
      this.curr_page = page_no;
      this.Update_Paging(true);
    }
  }

  Goto_Prev_Page()
  {
    if (this.curr_page > 0)
    {
      this.curr_page--;
      this.Update_Paging(true);
    }
  }

  Goto_First_Page()
  {
    this.curr_page = 0;
    this.Update_Paging(true);
  }
  
  Goto_Last_Page()
  {
    this.curr_page = this.page_count - 1;
    this.Update_Paging(true);
  }
  
  Goto_Next_Page()
  {
    if (this.curr_page < this.page_count - 1)
    {
      this.curr_page++;
      this.Update_Paging(true);
    }
  }
}

class Column_Field
{
  constructor()
  {
    this.width = null; // eg "100px"
    this.style = null; // eg "css-class-red"
    this.title = null; // eg "Customer Name"
    this.field_fn = null;
    this.title_fn = null;
    this.renderAs = null; // text, html, date, url
  }
}
Table_Buddy.Column_Field = Column_Field;

class Column_Select
{
  constructor(id_field_name, style)
  {
    this.id_field_name = id_field_name;
    this.selected_ids = [];
    this.width = null;
    this.style = style;
    this.title_fn = this.Render_Header_Select;
    this.field_fn = this.Render_Select;

    this.On_Click_Select_All = this.On_Click_Select_All.bind(this);
    this.On_Click_Select_Row = this.On_Click_Select_Row.bind(this);
  }

  Render_Header_Select()
  {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "select_all";
    checkbox.addEventListener("click", this.On_Click_Select_All);
    return checkbox;
  }

  Render_Select(row_data, row_idx)
  {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "select_" + row_idx;
    checkbox.addEventListener("click", this.On_Click_Select_Row);

    const id = row_data[this.id_field_name];
    if (this.selected_ids.includes(id))
    {
      checkbox.checked = true;
    }
    checkbox.data_id = id;

    return checkbox;
  }

  On_Click_Select_All(event)
  {
    if (event.target.checked)
      this.Select_All();
    else
      this.Unselect_All();
    this.table_buddy.Update_Render();
  }

  On_Click_Select_Row(event)
  {
    if (event.target.checked)
      this.selected_ids.push(event.target.data_id);
    else
      this.selected_ids = this.selected_ids.filter(id => id != event.target.data_id);
  }

  Select_All()
  {
    this.selected_ids = [...this.ds.data];
  }

  Unselect_All()
  {
    this.selected_ids = [];
  }
}
Table_Buddy.Column_Select = Column_Select;

class Column_No
{
  constructor(style)
  {
    this.width = null;
    this.style = style;
    this.title = "#";
    this.field_fn = this.Render_No;
  }

  Render_No(row_data, row_idx)
  {
    return  this.table_buddy.page_size * this.table_buddy.curr_page + row_idx + 1;
  }
}
Table_Buddy.Column_No = Column_No;

export default Table_Buddy;