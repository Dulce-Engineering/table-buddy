import Utils from "../../2Utils.mjs";

class Paging_Bar extends HTMLElement 
{
  constructor() 
  {
    super();

    this.isZeroPageIdx = false;
    this.srcTableId = null;
    this.srcTableElem = null;

    this.attachShadow({mode: 'open'});
    const rootElem = this.render();
    this.shadowRoot.append(rootElem);

    this.renderUpdate = this.renderUpdate.bind(this);
  }

  connectedCallback()
  {
    if (this.srcTableId)
    {
      const elem = document.getElementById(this.srcTableId);
      this.setSrcTable(elem);
    }
  }

  static observedAttributes = ['table-id'];
  attributeChangedCallback(name, oldValue, newValue) 
  {
    if (name == "table-id")
    {
      this.srcTableId = newValue;
      const elem = document.getElementById(this.srcTableId);
      this.setSrcTable(elem);
    }
  }

  setSrcTable(elem)
  {
    this.srcTableElem = elem;
    if (this.srcTableElem)
    {
      const selectElem = this.shadowRoot.getElementById("selLimitSuppliers");
      selectElem.value = this.srcTableElem.pageSize;
      selectElem.onchange = this.srcTableElem.setPageSize;
  
      this.shadowRoot.getElementById("btnPrevPageSuppliers").onclick = this.srcTableElem.gotoPrevPage;
      this.shadowRoot.getElementById("btnFirstPageSuppliers").onclick = this.srcTableElem.gotoFirstPage;
      this.shadowRoot.getElementById("btnLastPageSuppliers").onclick = this.srcTableElem.gotoLastPage;
      this.shadowRoot.getElementById("btnNextPageSuppliers").onclick = this.srcTableElem.gotoNextPage;
  
      this.renderUpdate();
  
      this.srcTableElem.addEventListener("update", this.renderUpdate);
    }
  }

  removeChildren(elem)
  {
    while (elem.firstChild) 
    {
      elem.removeChild(elem.lastChild);
    }
  }

  renderUpdate()
  {
    const countSpan = this.shadowRoot.getElementById("countSpan");

    if (this.srcTableElem)
    {
      let currPage = this.srcTableElem.currPage;
      if (this.isZeroPageIdx)
      {
        currPage++;
      }
      countSpan.innerText = 
        this.srcTableElem.itemCount + " Items, Page " + currPage + " of " + this.srcTableElem.pageCount;
    }
  }

  render()
  {
    const html = 
      `<style>
        button
        {
          width: 40px;
          height: 40px;
          background: #fff;
          border-right: 1px solid #ccc;
          border-top: none;
          border-bottom: none;
          border-left: none;
          cursor: pointer;
          font-size: 14px;
        }
        button:hover
        {
          background: #eee;
        }
        #sep
        {
          width: 30px;
          height: 39px;
          display: inline-block;
          text-align: center;
          padding: 0;
          margin: 0;
          border-right: 1px solid #ccc;
          vertical-align: middle;
        }
        #allBtnPanel
        {
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          display: inline-block;
        }
        #selLimitSuppliers
        {
          border-radius: 5px;
          padding: 12px;
          border: 1px solid #ccc;
          cursor: pointer;
          margin-right: 50px;
          margin-left: 10px;
        }
        .currPage
        {
          background: #eee;
        }
        #countSpan
        {
          margin-left: 20px;
        }
      </style>
      
      Rows per page
      <select id="selLimitSuppliers">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
      </select>
      <span id="allBtnPanel">
        <button id="btnFirstPageSuppliers" title="First Page">&Lt;</button><button id="btnPrevPageSuppliers" title="Previous Page">&lt;</button><span id="pageBtnPanel"></span><button id="btnNextPageSuppliers" title="Next Page">&gt;</button><button id="btnLastPageSuppliers" title="Last Page">&Gt;</button>
      </span>
      <span id="countSpan"></span>`;
    const doc = Utils.toDocument(html);

    return doc;
  }
}

export default Paging_Bar;