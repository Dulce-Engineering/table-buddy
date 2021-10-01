import Utils from "./Utils.mjs";
import Table_Buddy from "./Table_Buddy.mjs";

class Table_Paging_Server extends Table_Buddy 
{  
  constructor() 
  {
    super();

    this.pageSize = 10; // Utils.getFromLocalStorgeInt(this.getStorageKeyPrefix() + ".pageSize", 10);
    this.currPage = 0;
    this.itemCount = 0;

    this.orderByCode = null;
    this.filters = null;

    this.setPageSize = this.setPageSize.bind(this);
    this.gotoPrevPage = this.gotoPrevPage.bind(this);
    this.gotoFirstPage = this.gotoFirstPage.bind(this);
    this.gotoLastPage = this.gotoLastPage.bind(this);
    this.gotoNextPage = this.gotoNextPage.bind(this);
  }

  get pageCount()
  {
    return Math.ceil(this.itemCount/this.pageSize);
  }

  set orderBy(orderByCode)
  {
    this.orderByCode = orderByCode;
    this.updateRender(false, true);
  }

  set where(filters)
  {
    this.filters = filters;
    this.updateRender(false, true);
  }
  
  setPageSize(event)
  {
    this.pageSize = event.target.value;
    //localStorage.setItem(this.getStorageKeyPrefix() + ".pageSize", this.pageSize);
    this.updateRender();
  }

  gotoPrevPage()
  {
    if (this.currPage > 0)
    {
      this.currPage--;
      this.updateRender();
    }
  }
  
  gotoNextPage()
  {
    if (this.currPage < this.pageCount - 1)
    {
      this.currPage++;
      this.updateRender();
    }
  }

  gotoFirstPage()
  {
    this.currPage = 0;
    this.updateRender();
  }
  
  gotoLastPage()
  {
    this.currPage = this.pageCount - 1;
    this.updateRender();
  }
}

export default Table_Paging_Server;