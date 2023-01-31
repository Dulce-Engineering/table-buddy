import Utils from "./Utils.mjs";

class Paging_Bar extends HTMLElement 
{
  static tname = "paging-bar";

  constructor() 
  {
    super();

    this.table = null;

    this.Render_Update = this.Render_Update.bind(this);
    this.On_Change_Page_Size = this.On_Change_Page_Size.bind(this);

    this.attachShadow({mode: 'open'});
  }

  connectedCallback()
  {
    this.Render();
    Utils.Set_Id_Shortcuts(this.shadowRoot, this);

    const table_id = this.getAttribute("table-id");
    if (table_id)
    {
      const elem = document.getElementById(table_id);
      this.Set_Src_Table(elem);
    }

    this.Load();
  }

  Set_Src_Table(elem)
  {
    this.table = elem;
    if (this.table)
    {
      const select_elem = this.shadowRoot.getElementById("page_size_sel");
      select_elem.value = this.table.page_size;
      select_elem.onchange = this.On_Change_Page_Size;
  
      this.shadowRoot.getElementById("prev_btn").onclick = this.table.Goto_Prev_Page;
      this.shadowRoot.getElementById("first_btn").onclick = this.table.Goto_First_Page;
      this.shadowRoot.getElementById("last_btn").onclick = this.table.Goto_Last_Page;
      this.shadowRoot.getElementById("next_btn").onclick = this.table.Goto_Next_Page;
  
      this.Render_Update();
  
      this.table.addEventListener("update", this.Render_Update);
    }
  }

  Save()
  {
    if (this.id)
    {
      const value = {page_size_sel_value: this.page_size_sel.value};
      const value_str = JSON.stringify(value);
      localStorage.setItem(this.id, value_str);
    }
  }

  Load()
  {
    if (this.id)
    {
      const store_str = localStorage.getItem(this.id);
      if (store_str)
      {
        const store = JSON.parse(store_str);
        this.page_size_sel.value = store.page_size_sel_value;
        if (this.table)
        {
          this.table.Set_Page_Size(store.page_size_sel_value);
        }
      }
      else
      {
        this.page_size_sel.value = 10;
        if (this.table)
        {
          this.table.Set_Page_Size(this.page_size_sel.value);
        }
      }
    }
  }

  On_Change_Page_Size(event)
  {
    this.table.Set_Page_Size(event.target.value);
    this.Save();
  }

  // rendering ====================================================================================

  Render_Update()
  {
    if (this.table)
    {
      this.paging_span.innerText = 
        this.table.item_count + " Items, " +
        "Page " + (this.table.curr_page + 1) + " of " + this.table.page_count;
      
      //this.page_size_sel.value = this.table.page_size;
    }
  }

  Render_Styles()
  {
    let elem = null;
    let style_html = `
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
    `;
      
    if (this.hasAttribute("style-src"))
    {
      elem = document.createElement("link");
      elem.rel = "stylesheet";
      elem.href = this.getAttribute("style-src");
    }
    else
    {
      elem = document.createElement("style");
      elem.innerHTML = style_html;
    }

    return elem;
  }

  Render()
  {
    const styles = this.Render_Styles();
    const html = `
      Rows per page
      <select id="page_size_sel">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
      
      <span id="btn_panel">
        <img id="first_btn" title="First Page" src="/images/first_page.svg">
        <img id="prev_btn" title="Previous Page" src="/images/prev_page.svg">
        <img id="next_btn" title="Next Page" src="/images/next_page.svg">
        <img id="last_btn" title="Last Page" src="/images/last_page.svg">
      </span>
      
      <span id="paging_span"></span>
    `;

    if (this.hasChildNodes)
    {
      this.shadowRoot.append(styles, ...this.children);
    }
    else
    {
    const doc = Utils.toDocument(html);
      this.shadowRoot.append(styles, doc);
    }
  }
}

export default Paging_Bar;