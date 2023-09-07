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
  }

  connectedCallback()
  {
    this.Render();
    Utils.Set_Id_Shortcuts(this, this);

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
      this.page_size_sel.value = this.table.page_size;
      this.page_size_sel.onchange = this.On_Change_Page_Size;
  
      this.prev_btn.onclick = this.table.Goto_Prev_Page;
      this.first_btn.onclick = this.table.Goto_First_Page;
      this.last_btn.onclick = this.table.Goto_Last_Page;
      this.next_btn.onclick = this.table.Goto_Next_Page;
  
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

  Render()
  {
    const html = `
      <span class="page-size">
      Rows per page
      <select id="page_size_sel">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
      </span>
      
      <span id="btn_panel">
        <button id="first_btn"><span class="btn-label">First Page</span></button>
        <button id="prev_btn"><span class="btn-label">Previous Page</span></button>
        <button id="next_btn"><span class="btn-label">Next Page</span></button>
        <button id="last_btn"><span class="btn-label">Last Page</span></button>
      </span>
      
      <span id="paging_span"></span>
    `;

    this.innerHTML = html;
  }
}

Utils.Register_Element(Paging_Bar);

export default Paging_Bar;