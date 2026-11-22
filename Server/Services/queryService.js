const Op = require('sequelize').Op;
const defaultPage = 1;
const defaultPageSize = 100;

//query fields
function parsefilter(filter){
 let marray = filter.split(",").map(function(item) {
    return item.split("|").map(function(_item) {
        return _item.trim();
      });
  });
  let wh = {};
  marray.forEach(el => {
    let rightside = el[1][0] == '!' ? {[Op.ne]:eval(el[1].substring(1))} : el[1];
    
      wh[el[0]] = eval(rightside);
  });
  if(Object.keys(wh).length) return wh;
  return {};
}
//include fields
function parsefields(select){
  let marray = select.split(",").map(function(item) {
         return item.trim();
   });
     if(marray.length) return marray;
     return null;
}
//include children
function parseinclude(include){
    let marray = eval(include);
    marray.forEach(function (element,indx) {
      if(typeof element == 'object'){
        for (const [key, value] of Object.entries(element)) {
          marray[indx] = { association:key,include: parseinclude(value)}
        }
      }
      if(Array.isArray(element)){
          marray[indx] = { include: parseinclude(element)}
      }
    });
     if(marray.length) return marray;
     return null;
}
//keyword search
function parseq(qarray, qwhere){
    let marray = eval(qarray);
    let _s = marray[0];
    let _or=[];
    for(var i=0;i<marray.length;i++){
      if (i > 0) {
        var _m = {};
        var _mindx = marray[i].indexOf('.') > -1 ? `$${marray[i]}$` : marray[i];
        _m[_mindx] = { [Op.like]: `%${_s}%` };
        _or.push(_m);
      }
    }
     if(_or.length) {
       if(Object.keys(qwhere).length>0)qwhere[Op.and] = {[Op.or]:_or};
       else qwhere = {[Op.or]:_or};
     }
     return qwhere;
}
//order by
function parseorderby(orderby){
  let wh = [];
  let marray = orderby.split(",").map(function(item) {
     return item.split("|").map(function(_item) {
         return _item.trim();
       });
   });
   marray.forEach(el => {
     let rightside = el[1] && el[1].toUpperCase() == 'DESC' ? 'DESC' : 'ASC';
     let leftsidearr = el[0].split(".");
     leftsidearr.push(rightside);
     wh.push(leftsidearr);
   });
     if(wh.length) return wh;
     return null;
}
exports.setQuery = async (req, res, next) => {
    let query = req.query;
    try {
        let q = {where:{},include:[], limit:0, offset:0 };
        if(query.filter) q.where = parsefilter(query.filter);
        if(query.select) q.attributes = parsefields(query.select);
        if(query.include) q.include = parseinclude(query.include);
        if(query.qf) q.where = parseq(query.qf,q.where);
        if(query.orderby) q.order = parseorderby(query.orderby);

        q.limit = parseInt(query.pageSize) || defaultPageSize;
        q.offset = ((parseInt(query.page)||defaultPage)-1) * q.limit;

        Object.assign(req.query, query, q);
        next();
    } catch (err) {
      res.status(500).send({
        message: `Error setting query`
      });
    }
  };
