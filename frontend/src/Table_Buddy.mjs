import Utils from "../../Utils.mjs";

class Table_Buddy extends HTMLElement 
{
  constructor() 
  {
    super();
    //console.log("Table_Buddy.constructor()");

    this.rows = null;

    this.attachShadow({mode: 'open'});
    const rootElem = this.render();
    this.shadowRoot.append(rootElem);

    this.updateEvent = new Event("update");
  }

  getColumns()
  {
    const columns = 
    [
      {title: "Id"},
      {title: "Name"},
      {title: "Occupation"}
    ];

    return columns;
  }

  getRows()
  {
    const rows =
    [
      {id: 100, name: "Fred Flintstone", occupation: "Builder"},
      {id: 101, name: "Wilma Flintstone", occupation: "Housewife"},
      {id: 102, name: "Bambam Flintstone", occupation: "Student"}
    ];

    return rows;
  }

  getRowData(row)
  {
    return row;
  }

  getCellData(colIdx, rowData)
  {
    let res;

    switch(colIdx)
    {
      case 0: res = rowData.id; break;
      case 1: res = rowData.name; break;
      case 2: res = rowData.occupation; break;
    }

    return res;
  }

  connectedCallback()
  {
    //console.log("Table_Buddy.connectedCallback()");
    const columns = this.getColumns();

    this.renderHeaderColumns(columns);
    this.renderFooterCells(this.footerRowElem);

    this.updateRender();
  }

  disconnectedCallback()
  {
    //console.log("Table_Buddy.disconnectedCallback()");
  }

  adoptedCallback()
  {

  }

  attributeChangedCallback(attrName, oldValue, newValue)
  {

  }

  showFetching()
  {

  }

  showFetchingCompleted()
  {

  }
  
  filterRows(rows)
  {
    return rows;
  }

  removeChildren(elem)
  {
    while (elem.firstChild) 
    {
      elem.removeChild(elem.lastChild);
    }
  }

  showBusy()
  {
    const overlayElem = this.shadowRoot.getElementById("tableOverlay");
    overlayElem.style.display = "flex";
  }

  hideBusy()
  {
    const overlayElem = this.shadowRoot.getElementById("tableOverlay");
    overlayElem.style.display = "none";
  }

  // Rendering ====================================================================================

  async updateRender(skipGetRows)
  {
    const columns = this.getColumns();

    this.showFetching();
    if (!skipGetRows)
    {
      this.rows = await this.getRows();
    }
    const filteredRows = this.filterRows(this.rows);
    this.showFetchingCompleted();

    this.updateRenderHeaderColumns(columns);
    this.updateRenderBodyRows(columns, filteredRows);

    this.dispatchEvent(this.updateEvent);
  }

  updateRenderHeaderColumns(columns)
  {
    for (let i = 0; i < columns.length; i++)
    {
      const column = columns[i];
      this.updateRenderHeaderCell(column, i);
    }
  }

  updateRenderHeaderCell(column, idx)
  {
  }

  render()
  {
    const html = 
    `<style>
      table
      {
        background: #fff;
        margin: 1em 0;
        border-radius: 4px;
        border-top: 1px solid rgba(34,36,38,.15);
        border-left: 1px solid rgba(34,36,38,.15);
        border-right: 1px solid rgba(34,36,38,.15);
        text-align: left;
        color: rgba(0,0,0,.87);
        border-collapse: separate;
        border-spacing: 0;
        font-size: 14px;
        font-family: Lato,helvetica neue,Arial,Helvetica,sans-serif;
        font-style: normal;
        font-weight: 400;
        width: 100%;
      }
      th
      {
        border-bottom: 1px solid rgba(34,36,38,.1);
        text-transform: none;
        font-weight: 700;
        padding: .92857143em .78571429em;
        background: rgba(0,0,0,.05);
        color: rgba(0,0,0,.95);
        cursor: pointer;
      }
      tr.rowError::after
      {
        background: #ffcece;
        content: var(--row-error);
        position: absolute;
        color: #535353;
        right: 0;
        padding: 5px 10px;
        box-shadow: grey 2px 2px 5px;
        opacity: 1;
        transition: opacity .5s ease;
      }
      tr.rowError:hover::after
      {
        opacity: 0;
      }
      tr.rowError .rowIcon {
        color: red;
      }
      td
      {
        padding: .78571429em .78571429em;
        text-overflow: ellipsis;
        border-bottom: 1px solid rgba(34,36,38,.15);
        xmax-width: 300px;
        xwhite-space: nowrap;
        overflow: hidden;
      }
      .sortIcon
      {
        font-size: 24px;
      }
      .sortIconSmall
      {
        font-size: 20px;
        margin-right: 5px;
      }
      .filterIconSmall
      {
        font-size: 14px;
        xmargin-right: 5px;
        xmargin-top: -2px;
      }
      td a
      {
        text-decoration: none;
        color: #000;
        font-weight: bold;
      }
      td a:hover
      {
        text-decoration: underline;
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
      .disabled-row::after {
        content: "\\26ED";
        color: black;
        position: absolute;
        left: 50%;
        zoom: 3;
        text-align: center;
        margin-top: 7px;
        animation: rotate 2s linear infinite;
      }
      td input[type='checkbox'], th input[type='checkbox'] {
        width: 16px;
        height: 16px;
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
    </div>`;
    const tableElem = Utils.toDocument(html);

    this.headerRowElem = tableElem.getElementById("headerRowElem");
    this.bodyElem = tableElem.getElementById("bodyElem");
    this.footerRowElem = tableElem.getElementById("footerRowElem");

    return tableElem;
  }

  renderHeaderColumns(columns)
  {
    this.removeChildren(this.headerRowElem);
    for (let i = 0; i < columns.length; i++)
    {
      const column = columns[i];
      const cellElem = this.renderHeaderCell(column, i);
      this.headerRowElem.append(cellElem);
    }
  }

  renderHeaderCell(column, idx)
  {
    const titleElem = document.createElement("th");
    titleElem.style.width = column.width;
    this.renderAsType(column.renderAs, titleElem, column.title);
    titleElem.id = "title_" + idx;

    return titleElem;
  }

  async updateRenderBodyRows(columns, rows)
  {
    rows = await rows;
    this.removeChildren(this.bodyElem);
    if (rows)
    {
      for (const row of rows)
      {
        const rowData = await this.getRowData(row);
        const rowElem = this.renderRow(columns, rowData);
        this.bodyElem.append(rowElem);
      }
    }
  }

  renderRow(columns, rowData)
  {
    const rowElem = document.createElement("tr");
    for (let colIdx = 0; colIdx < columns.length; colIdx++)
    {
      const cellData = this.getCellData(colIdx, rowData, rowElem);
      const cellElem = this.renderCell(columns[colIdx], cellData);
      rowElem.append(cellElem);
    }

    return rowElem;
  }

  renderCell(column, cellData)
  {
    const cellElem = document.createElement("td");
    this.renderAsType(column.renderAs, cellElem, cellData);

    return cellElem;
  }

  renderFooterCells(parentElem)
  {
  }

  renderAsType(type, dstElem, data)
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
}

export default Table_Buddy;