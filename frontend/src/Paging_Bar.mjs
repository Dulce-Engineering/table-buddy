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
  attributeChangedCallback(name, old_value, new_value) 
  {
    if (name == "table-id")
    {
      this.table_id = new_value;
    }
  }

  Set_Src_Table(elem)
  {
    this.table = elem;
    if (this.table)
    {
      const select_elem = this.shadowRoot.getElementById("page_size_sel");
      select_elem.value = this.table.page_size;
      select_elem.onchange = (event) => this.table.Set_Page_Size(event.target.value);
  
      this.shadowRoot.getElementById("prev_btn").onclick = this.table.Goto_Prev_Page;
      this.shadowRoot.getElementById("first_btn").onclick = this.table.Goto_First_Page;
      this.shadowRoot.getElementById("last_btn").onclick = this.table.Goto_Last_Page;
      this.shadowRoot.getElementById("next_btn").onclick = this.table.Goto_Next_Page;
  
      this.Render_Update();
  
      this.table.addEventListener("update", this.Render_Update);
    }
  }

  Render_Update()
  {
    const paging_span = this.shadowRoot.getElementById("paging_span");

    if (this.table)
    {
      paging_span.innerText = 
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
        #btn_panel
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
        #paging_span
        {
          font-weight: bold;
        }
      </style>
      
      <span id="btn_panel">
        <img id="first_btn" title="First Page" src="/src/images/icons8-first-24.png">
        <img id="prev_btn" title="Previous Page" src="/src/images/icons8-previous-24.png">
        <img id="next_btn" title="Next Page" src="/src/images/icons8-next-24.png">
        <img id="last_btn" title="Last Page" src="/src/images/icons8-last-24.png">
      </span>
      Rows per page
      <select id="page_size_sel">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
      <span id="paging_span"></span>`;
    const doc = Utils.toDocument(html);

    return doc;
  }
}

export default Paging_Bar;