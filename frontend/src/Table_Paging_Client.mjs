import Utils from "./Utils.mjs";
import Table_Buddy from "./Table_Buddy.mjs";

class Table_Paging_Client extends Table_Buddy 
{  
  constructor() 
  {
    super();

    this.pageSize = 10; // Utils.getFromLocalStorgeInt(this.getStorageKeyPrefix() + ".pageSize", 10);
    this.currPage = 0;
    this.pageCount = 0;
    this.itemCount = 0;

    this.orderByCode = null;
    this.filters = null;

    this.setPageSize = this.setPageSize.bind(this);
    this.gotoPrevPage = this.gotoPrevPage.bind(this);
    this.gotoFirstPage = this.gotoFirstPage.bind(this);
    this.gotoLastPage = this.gotoLastPage.bind(this);
    this.gotoNextPage = this.gotoNextPage.bind(this);
  }

  set orderBy(orderByCode)
  {
    this.orderByCode = orderByCode;
    this.updateRender();
  }

  set where(filters)
  {
    this.filters = filters;
    this.updateRender();
  }
  
  filterRows(rows)
  {
    let res;

    if (!Utils.isEmpty(rows))
    {
      this.itemCount = rows.length;
      this.pageCount = Math.trunc(rows.length / this.pageSize) + 1;
      
      if (!Utils.isEmpty(rows))
      {
        const itemStartPos = this.currPage * this.pageSize;
        const itemEndPos = itemStartPos + this.pageSize;
        res = rows.slice(itemStartPos, itemEndPos);
      }
    }

    return res;
  }
  
  setPageSize(event)
  {
    this.pageSize = event.target.value;
    localStorage.setItem(this.getStorageKeyPrefix() + ".pageSize", this.pageSize);
    this.updateRender(true);
  }

  gotoPrevPage()
  {
    if (this.currPage > 0)
    {
      this.currPage--;
      this.updateRender(true);
    }
  }

  gotoFirstPage()
  {
    this.currPage = 0;
    this.updateRender(true);
  }
  
  gotoLastPage()
  {
    this.currPage = this.pageCount - 1;
    this.updateRender(true);
  }
  
  gotoNextPage()
  {
    if (this.currPage < this.pageCount - 1)
    {
      this.currPage++;
      this.updateRender(true);
    }
  }
}

export default Table_Paging_Client;