export const createPaginationList = (currentPage: number, maxPage = 51) =>{ 
    const p: any[] = [];
    const cp = currentPage;

    for(let num = cp - 9; num < cp ; num++) {
      if(num <= 0) { continue; }
      p.push({ number: num,active: num == cp });
    }
    for(let num = cp; num < cp + 9 ; num++) {
      if(num >= maxPage) { continue; }
      p.push({ number: num, active: num == cp });
    }
    if(cp >= 11){
      p.unshift(null);
      p.unshift({ number: 1} );
    }
    if(cp <= maxPage){
      p.push(null);
      p.push({ number: maxPage, active: cp == maxPage} );
    }
    return p;
}