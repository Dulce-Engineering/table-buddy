import Utils from "./Utils.mjs";

class Table_Buddy extends HTMLElement 
{
  constructor() 
  {
    super();

    this.ds = null;
    this.rows = null;
    this.order_by_code = null;
    this.filters = null;
    this.page_size = 10;
    this.page_start = 0;
    this.curr_page = 0;
    this.page_count = 0;
    this.item_count = 0;
    this.show_busy = false;

    this.Goto_Prev_Page = this.Goto_Prev_Page.bind(this);
    this.Goto_First_Page = this.Goto_First_Page.bind(this);
    this.Goto_Last_Page = this.Goto_Last_Page.bind(this);
    this.Goto_Next_Page = this.Goto_Next_Page.bind(this);

    this.attachShadow({mode: 'open'});
    this.updateEvent = new Event("update");
  }

  connectedCallback()
  {
    const rootElem = this.Render();
    this.shadowRoot.append(rootElem);
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
    this.ds = ds;

    const columns = this.ds.Get_Columns();
    this.Render_Header_Columns(columns);
    this.Render_Footer_Cells(this.footerRowElem);

    this.Update_Render();
  }

  // Rendering ====================================================================================

  Show_Busy()
  {
    if (this.show_busy)
    {
      const overlayElem = this.shadowRoot.getElementById("tableOverlay");
      overlayElem.style.display = "flex";
    }
  }

  Hide_Busy()
  {
    if (this.show_busy)
    {
      const overlayElem = this.shadowRoot.getElementById("tableOverlay");
      overlayElem.style.display = "none";
    }
  }

  async Update_Render(is_page_update)
  {
    if (this.ds)
    {
      this.Show_Busy();
      const columns = this.ds.Get_Columns();

      if (!is_page_update)
      {
        await this.ds.Update_Data(this.filters, this.order_by_code);
        this.item_count = await this.ds.Get_Data_Length(this.filters, this.order_by_code);
      }
      this.page_count = Math.ceil(this.item_count/this.page_size);
      this.rows = await this.ds.Get_Page_Data(this.filters, this.order_by_code, this.page_size, this.page_start);

      this.Update_Render_Header_Columns(columns);
      await this.Update_Render_Body_Rows(columns, this.rows);

      this.dispatchEvent(this.updateEvent);
      this.Hide_Busy();
    }
  }

  Update_Render_Header_Columns(columns)
  {
    for (let i = 0; i < columns.length; i++)
    {
      const column = columns[i];
      this.Update_Render_Header_Cell(column, i);
    }
  }

  Update_Render_Header_Cell(column, idx)
  {
  }

  Render()
  {
    let style = "";
    if (this.style_src)
    {
      style = "<link rel=\"stylesheet\" href=\"" + this.style_src + "\"></link>";
    }
    const html = `
      ${style}
      <style>
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
      </style>

      <div id="tableContainer">
        <div id="tableOverlay">
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
        </div>
        <table id="tableElem">
          <thead><tr id="headerRowElem"></tr></thead>
          <tbody id="bodyElem">
            <tr><td colspan="10">&nbsp;</td></tr>
            <tr><td colspan="10">&nbsp;</td></tr>
            <tr><td colspan="10">&nbsp;</td></tr>
            <tr><td colspan="10">&nbsp;</td></tr>
            <tr><td colspan="10">&nbsp;</td></tr>
            <tr><td colspan="10">&nbsp;</td></tr>
          </tbody>
          <tfoot><tr id="footerRowElem"></tr></tfoot>
        </table>
      </div>
      `;
    const tableElem = Utils.toDocument(html);

    this.headerRowElem = tableElem.getElementById("headerRowElem");
    this.bodyElem = tableElem.getElementById("bodyElem");
    this.footerRowElem = tableElem.getElementById("footerRowElem");

    return tableElem;
  }

  Render_Header_Columns(columns)
  {
    this.headerRowElem.replaceChildren();
    for (let i = 0; i < columns.length; i++)
    {
      const column = columns[i];
      const cellElem = this.Render_Header_Cell(column, i);
      this.headerRowElem.append(cellElem);
    }
  }

  Render_Header_Cell(column, idx)
  {
    const titleElem = document.createElement("th");
    titleElem.style.width = column.width;
    this.Render_As_Type(column.renderAs, titleElem, column.title);
    titleElem.id = "title_" + idx;

    return titleElem;
  }

  async Update_Render_Body_Rows(columns, rows)
  {
    rows = await rows;
    this.bodyElem.replaceChildren();
    if (rows)
    {
      for (const row of rows)
      {
        const rowData = await this.ds.Get_Row_Data(row);
        const rowElem = this.Render_Row(columns, rowData);
        this.bodyElem.append(rowElem);
      }
    }
  }

  Render_Row(columns, rowData)
  {
    const rowElem = document.createElement("tr");
    for (let colIdx = 0; colIdx < columns.length; colIdx++)
    {
      const cellData = this.ds.Get_Cell_Data(colIdx, rowData, rowElem);
      const cellElem = this.Render_Cell(columns[colIdx], cellData);
      rowElem.append(cellElem);
    }

    return rowElem;
  }

  Render_Cell(column, cellData)
  {
    const cellElem = document.createElement("td");
    this.Render_As_Type(column.renderAs, cellElem, cellData);

    return cellElem;
  }

  Render_Footer_Cells(parentElem)
  {
  }

  Render_As_Type(type, dstElem, data)
  {
    if (type == "text")
    {
      dstElem.innerText = data;
    }
    else if (type == "html")
    {
      dstElem.innerHTML = data;
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

  // Filter and Sort ==============================================================================

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

export default Table_Buddy;