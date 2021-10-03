import Utils from "./Utils.mjs";

class Paging_Bar extends HTMLElement 
{
  constructor() 
  {
    super();

    this.table_id = null;
    this.table = null;

    this.Render_Update = this.Render_Update.bind(this);

    this.attachShadow({mode: 'open'});
  }

  connectedCallback()
  {
    const rootElem = this.Render();
    this.shadowRoot.append(rootElem);

    if (this.table_id)
    {
      const elem = document.getElementById(this.table_id);
      this.Set_Src_Table(elem);
    }
  }

  static observedAttributes = ['table-id'];
  attributeChangedCallback(name, oldValue, newValue) 
  {
    if (name == "table-id")
    {
      this.table_id = newValue;
    }
  }

  Set_Src_Table(elem)
  {
    this.table = elem;
    if (this.table)
    {
      const selectElem = this.shadowRoot.getElementById("page_size_sel");
      selectElem.value = this.table.page_size;
      selectElem.onchange = (event) => this.table.Set_Page_Size(event.target.value);
  
      this.shadowRoot.getElementById("btnPrevPageSuppliers").onclick = this.table.Goto_Prev_Page;
      this.shadowRoot.getElementById("btnFirstPageSuppliers").onclick = this.table.Goto_First_Page;
      this.shadowRoot.getElementById("btnLastPageSuppliers").onclick = this.table.Goto_Last_Page;
      this.shadowRoot.getElementById("btnNextPageSuppliers").onclick = this.table.Goto_Next_Page;
  
      this.Render_Update();
  
      this.table.addEventListener("update", this.Render_Update);
    }
  }

  Render_Update()
  {
    const countSpan = this.shadowRoot.getElementById("countSpan");

    if (this.table)
    {
      countSpan.innerText = 
        this.table.item_count + " Items, " +
        "Page " + (this.table.curr_page + 1) + " of " + this.table.page_count;
    }
  }

  Render()
  {
    const html = 
      `<style>
        :host
        {
          padding: 5px;
          display: inline-block;
          font-size: 11px;
        }
        img
        {
          margin: 0;
          padding: 0;
          cursor: pointer;
          vertical-align: middle;
        }
        img:hover
        {
          background: #eee;
        }
        #allBtnPanel
        {
          margin: 0 20px 0 0;
          padding: 0;
        }
        #page_size_sel
        {
          font-size: 12px;
          border: 2px solid #000;
          vertical-align: middle;
          cursor: pointer;
          margin-right: 20px;
          border-radius: 3px;
        }
        .xcurrPage
        {
          background: #eee;
        }
        #countSpan
        {
          font-weight: bold;
        }
      </style>
      
      <span id="allBtnPanel">
        <img id="btnFirstPageSuppliers" title="First Page" src="/src/images/icons8-first-24.png">
        <img id="btnPrevPageSuppliers" title="Previous Page" src="/src/images/icons8-previous-24.png">
        <img id="btnNextPageSuppliers" title="Next Page" src="/src/images/icons8-next-24.png">
        <img id="btnLastPageSuppliers" title="Last Page" src="/src/images/icons8-last-24.png">
      </span>
      Rows per page
      <select id="page_size_sel">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
      <span id="countSpan"></span>`;
    const doc = Utils.toDocument(html);

    return doc;
  }
}

export default Paging_Bar;