const fastcsv = require('fast-csv');
const path = require('path');
const fs = require('fs');

const db = require("../Models");

const customers = db.customers;
const customer_sizes = db.customer_sizes;
const inventory = db.inventory;
const inventory_items = db.inventory_items;

function isEmpty(o){
  var _isempty = true;
  Object.keys(o).forEach(function(key) {
    if (o[key]) _isempty = false;
  });
  return _isempty;
}

exports.importcustomers = async (req, res) => {
  try {
    let jsondata = [];
    let sizedata = [];
    fs.createReadStream(path.resolve(__dirname, '\..\\assets', 'customers.csv'))
    .pipe(fastcsv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', async row => {
      if(!row["Last Name"] && !row["First Name"]) return;
      row["Phone Number"] = row["Phone Number"].replace('\'','');

      jsondata.push(row);
      //console.log(row);

      let _customers = await customers.findAll({where: {
        //LastName:'Carroll'
        LastName: row["Last Name"], 
        Phone:row["Phone Number"], 
        Email:row["Email Address"]
      }});
      let _cust = null;
      if(_customers.length>0){
        //update
        let cust = _customers[0];
        let update = {
          FirstName:row["First Name"],
          //LastName:row["Last Name"],
          //Email:row["Email Address"],
          //Phone:row["Phone Number"],
          Address:row["Street Address 1"],
          City:row.City,
          State:row.State,
          Zipcode:row["Postal Code"],
          Birthday:row.Birthdate,
        }
        _cust = await customers.update(update, {
          where: {
            ID: cust.ID
          }
        });

      }
      else{
        //create
        _cust = await customers.create({
          FirstName:row["First Name"],
          LastName:row["Last Name"],
          Email:row["Email Address"],
          Phone:row["Phone Number"],
          Address:row["Street Address 1"],
          City:row.City,
          State:row.State,
          Zipcode:row["Postal Code"],
          Birthday:row.Birthdate,
        });
      }

      
      let nu = await customers.findAll({where: {
        LastName: row["Last Name"], 
        Phone:row["Phone Number"], 
        Email:row["Email Address"]
      }});

      //search for sizes
        let sizes = {
          Coat:"",
          Shirt:"",
          Pants:"",
          Waist:"",
          Vest:"",
          Tie:"",
          Shoe:"",
          Height:"",
          Chest:"",
          Neck:"",
          Sleeve:""
        }
      if(row.Memo){
        let ms = row.Memo;
        let coatstyle = /Coat Style:(.*)\n/.test(ms) ? /Coat Style:(.*)\n/.exec(ms)[1] : "";
        let color = /Color:(.*)\n/.test(ms) ? /Color:(.*)\n/.exec (ms)[1] : "";
        let pants = /Pants:(.*)\n/.test(ms) ? /Pants:(.*)\n/.exec (ms)[1] : "";
        let shirt = /Shirt:(.*)\n/.test(ms) ? /Shirt:(.*)\n/.exec (ms)[1] : "";
        let tie = /Tie:(.*)\n/.test(ms) ? /Tie:(.*)\n/.exec (ms)[1] : "";
        let vest = /Vest:(.*)\n/.test(ms) ? /Vest:(.*)\n/.exec (ms)[1] : "";
        let shoes = /Shoes:(.*)\n/.test(ms) ? /Shoes:(.*)\n/.exec (ms)[1] : "";
        
        let height = /Height:(.*)\n/.test(ms) ? /Height:(.*)\n/.exec (ms)[1] : "";
        let chest = /Chest:(.*)\n/.test(ms) ? /Chest:(.*)\n/.exec (ms)[1] : "";
        let outarm = /Out Arm:(.*)\n/.test(ms) ? /Out Arm:(.*)\n/.exec (ms)[1] : "";
        let coatsize = /Coat\s?Size:(.*)\n/.test(ms) ? /Coat\s?Size:(.*)\n/.exec (ms)[1] : "";
        let waist = /Waist:(.*)\n/.test(ms) ? /Waist:(.*)\n/.exec (ms)[1] : "";
        let outseam = /Out Seam:(.*)\n/.test(ms) ? /Out Seam:(.*)\n/.exec (ms)[1] : "";
        let neck = /Neck:(.*)\n/.test(ms) ? /Neck:(.*)\n/.exec (ms)[1] : "";
        let sleeve = /Sleeve:(.*)\n/.test(ms) ? /Sleeve:(.*)\n/.exec (ms)[1] : "";
        let shoesize = /Shoe Size:(.*)\n/.test(ms) ? /Shoe Size:(.*)\n/.exec (ms)[1] : "";

        sizes.Coat = `${coatstyle.trim()} ${color.trim().toUpperCase()} ${coatsize.trim()}`.replace("  ", " ").trim();
        sizes.Shirt = `${shirt.trim()}`;
        sizes.Pants = `${pants.trim()}`;
        sizes.Waist = `${waist.trim()}`;
        sizes.Vest = `${vest.trim()}`;
        sizes.Tie = `${tie.trim()}`;
        sizes.Shoe = `${shoes.trim()} ${shoesize.trim()}`.trim();
        sizes.Height = `${height.trim()}`;
        sizes.Chest = `${chest.trim()}`;
        sizes.Neck = `${neck.trim()}`;
        sizes.Sleeve = `${sleeve.trim()}`;

        var a = true;
      }
      else{
        sizes.Coat = row["Coat Color/Size"].trim();
        sizes.Shirt = row["Shirt Color/Size"].trim();
        sizes.Pants = row["Pants Color"].trim();
        sizes.Waist = row.Waist/Outseam.trim();
        sizes.Vest = row["Vest Color/Size"].trim();
        sizes.Tie = row["Tie Style/Color "].trim();
        sizes.Shoe = row["Shoe color/Size"].trim();
        sizes.Height = row.Height.trim();
        sizes.Chest = row.Chest.trim();
        sizes.Neck = row["Neck Size"].trim();
        sizes.Sleeve = row["Sleeve Size"].trim();
      }
      if(!isEmpty(sizes)){      
        let _customersizes = await customer_sizes.findAll({where: {
          CustomerID: nu[0].ID
        }});
        let _custsize = null;
        if(_customersizes.length>0){
          //update
          let custsize = _customersizes[0];
          _custsize = await customer_sizes.update(sizes, {
            where: {
              ID: custsize.ID
            }
          });
  
        }
        else{
          //create
          sizes.CustomerID=nu[0].ID;
          _custsize = await customer_sizes.create(sizes);
        }
      }
    })
    .on('end', rowCount => {
      //console.log(`Parsed ${rowCount} rows`)
      //res.json(sizedata);
      res.json(jsondata);
    } );
  } catch (err) {
    res.status(500).send({
      message: `Error importing`
    });
  }
};


exports.importinventory = async (req, res) => {
  try {
    let jsondata = [];
    let sizedata = [];
    fs.createReadStream(path.resolve(__dirname, '\..\\assets', 'inventory3.csv'))
    .pipe(fastcsv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', async _row => {
      // let srow = JSON.stringify(_row);
      // let row = JSON.parse(srow);
      let row = _row;
      if(row[3]==="Barcode" || row[0]==null || row[1]==null || row[2]==null || row[3]==null || row[0]=="" || row[1]==""  || row[2]==""  || row[3]=="" ) return;

      jsondata.push(row);
      //console.log(row);
    })
    .on('end', async rowCount => {

      let FixedData = await FixKnownDataIssues(jsondata);

      for(var i=0; i<FixedData.length; i++){ 
        let row = FixedData[i];

        let types = await db.inventory_types.findAll({where:{Name:row[2]}});
        if(types.length==0)continue;
        let _type = types[0];

        let _inventory = await db.inventory.findAll({where: {
          InventoryTypeID: _type.ID, 
          ModelName:row[0]
        }});

        let cost = 0;

        switch(row[2]){
          case "Vest":
            cost=29;
            break;
          case "Pants":
            cost=39;
            break;
          case "Coat":
            cost=79.95;
            break;
          case "Shoes":
            cost=26;
            break;
          case "Shirt":
            cost=12.95;
            break;
          case "Windsor Tie":
            cost=10;
            break;
          case "Bow Tie":
            cost=10;
            break;
          default:
            cost=0;
        }

        let _inv = null;
        
        let _name = row[0];
        let _desc = row[1];
        _name = _name.length>45 ? _name.substring(0,45) : _name;
        _desc = _desc.length>100 ? _desc.substring(0,100) : _desc;

        if(_inventory.length>0){
          //update
          let inv = _inventory[0];
          let update = {
            InventoryTypeID:_type.ID,
            Description:_desc,
            ModelName:_name,
            Cost:cost
          }
          _inv = await db.inventory.update(update, {
            where: {
              ID: inv.ID
            }
          });

        }
        else{
          //create
          _inv = await db.inventory.create({
            InventoryTypeID:_type.ID,
            Description:_desc,
            ModelName:_name,
            Cost:cost
          });
        
          _inventory= await db.inventory.findAll({where: {
            InventoryTypeID:_type.ID,
            ModelName:_name
          }});
        }

        if(_inventory.length>0){
          let nu = _inventory[0];
          let _inventory_items = await inventory_items.findAll({where: {
            InventoryID: nu.ID, 
            Size:row[3], 
            Barcode:row[4]
          }});
          let _inv_item = null;
          if(_inventory_items.length>0){
            // //update
            // let inv_item = _inventory_items[0];
            // let update = {
            //   InventoryID: nu.ID,
            //   Size:row[2].trim(), 
            //   StatusID:2,
            //   Barcode:row[3].trim()
            // }
            // _inv_item = await inventory_items.update(update, {
            //   where: {
            //     ID: inv_item.ID
            //   }
            // });
          }
          else{
            //create
            inv_item = await inventory_items.create({
              InventoryID: nu.ID,
              Size:row[3], 
              StatusID:2,
              Barcode:row[4]
            });
          }
        }
      }
     
      res.json(FixedData);
    } );
  } catch (err) {
    res.status(500).send({
      message: `Error importing`
    });
  }
};

async function FixKnownDataIssues(jsondata) {
  let FixedData = [];
  for(var i=0; i<jsondata.length; i++){ 
    let row = jsondata[i];

    let Name = row[0].trim();
    let Desc = row[0].trim();
    Name = Name.length>45 ? Name.substring(0,45) : Name;
    Desc = Desc.length>100 ? Desc.substring(0,100) : Desc;
    let Mtype = row[1].trim();
    let Size=row[2].trim();
    let Barcode=row[3].trim();

    FixedData.push([Name,Desc,Mtype,Size,Barcode]);
  }
  _ = await RenameModel("test","test");
  _ = await RenameModel("Bow Tie Solid Brown Cognac  686","Bow Tie Solid Brown Cognac 686");
  _ = await RenameModel("Bow Tie Boys Solid Brown Cognac  686","Bow Tie Boys Solid Brown Cognac 686");
  _ = await RenameModel("Paisley Charcoal  Ultra Slim Vest 4961V-008","Paisley Charcoal Ultra Slim Vest 4961V-008");
  _ = await RenameModel("Bow Tie Paisley  Orchid 520","Bow Tie Paisley Orchid 520");
  _ = await RenameModel("Bow Tie Solid Chianti  665","Bow Tie Solid Chianti 665");
  _ = await RenameModel("Bow Tie Solid  Raspberry 611","Bow Tie Solid Raspberry 611");
  _ = await RenameModel("Bow Tie Paisley  Champagne 458","Bow Tie Paisley Champagne 458");
  _ = await RenameModel("Windsor Tie Solid Brown Cognac  686","Windsor Tie Solid Brown Cognac 686");
  _ = await RenameModel("White Solid Coat W/Shawl  Neil Allyn","White Solid Coat W/Shawl Neil Allyn");
  _ = await RenameModel("Windsor Tie Solid Sea  Mist 631","Windsor Tie Solid Sea Mist 631");
  _ = await RenameModel("Windsor Tie Paisley Brown Cognac  686","Windsor Tie Paisley Brown Cognac 686");
  //_ = await RenameModel("Windsor Tie Solid Plum 511","Windsor Tie Solid 511"); //***********
  _ = await RenameModel("Windsor Tie Solid 511","Windsor Tie Solid Plum 511"); //***********
  _ = await RenameModel("Bow Tie Solid Burn Orange 616","Bow Tie Solid Burnt Orange 616");
  _ = await RenameModel("Bow Tie Paisley Burn Orange 616","Bow Tie Paisley Burnt Orange 616");
  _ = await RenameModel("Navy Coat Shiny Lapel 8560C-37 Nicholas Has","Navy Coat Shiny Lapel 8560C-37");
  _ = await RenameModel("Windsor Tie Solid Burn Orange 616","Windsor Tie Solid Burnt Orange 616");
  return FixedData;
}

async function RenameModel(from, to) {
  try {
    let newname = {
      ModelName:to
    }
    return await db.inventory.update(newname, {
      where: {
        ModelName:from
      }
    });
  } catch (err) {
    throw err;
  }
}


// async function RemoveDuplicateBarcodes(){
//   //const users = await sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
//   const projects = await sequelize.query('SELECT * FROM projects', {
//     model: Projects,
//     mapToModel: true // pass true here if you have any mapped fields
//   });
// }














function removeDuplicateObjectFromArray(array, key) {
  var check = new Set();
  var no_dupes = array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
  return no_dupes.sort(function (a, b) {
    return (a.InventoryTypeID < b.InventoryTypeID) ? -1 : 1;
  });
}

exports.testinventory = async (req, res) => {
  try {
    let jsondata = [];
    let sizedata = [];
    let ret = {
      invs:[],
      items:[]
    }
    fs.createReadStream(path.resolve(__dirname, '\..\\assets', 'inventory3.csv'))
    .pipe(fastcsv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', async _row => {
      // let srow = JSON.stringify(_row);
      // let row = JSON.parse(srow);
      let row = _row;
      if(row[3]==="Barcode" || row[0]==null || row[1]==null || row[2]==null || row[3]==null || row[0]=="" || row[1]==""  || row[2]==""  || row[3]=="" ) return;

      jsondata.push(row);
      //console.log(row);
    })
    .on('end', async rowCount => {
      for(var i=0; i<jsondata.length; i++){ 
          let row = jsondata[i];
          let types = await db.inventory_types.findAll({where:{Name:row[1].trim()}});
          if(types.length==0)continue;

          let _type = types[0];

          let _inventory = await db.inventory.findAll({where: {
            InventoryTypeID: _type.ID, 
            ModelName:row[0].trim()
          }});

          let cost = 0;
          switch(row[1].trim()){
            case "Vest":
              cost=29;
              break;
              case "Pants":
                cost=39;
                break;
                case "Coat":
                  cost=79.95;
                  break;
                  case "Shoes":
                    cost=26;
                    break;
                    case "Shirt":
                      cost=12.95;
                      break;
                      case "Windsor Tie":
                        cost=10;
                        break;
                        case "Bow Tie":
                          cost=10;
                          break;
                          default:
                            cost=0;
          }

          let _inv = null;
          if(_inventory.length>0){
            //update
            let inv = _inventory[0];
            let update = {
              InventoryTypeID:_type.ID,
              Description:row[0].trim(),
              ModelName:row[0].trim(),
              Cost:cost
            }
            // _inv = await db.inventory.update(update, {
            //   where: {
            //     ID: inv.ID
            //   }
            // });

          }
          else{
            //create
            // _inv = await db.inventory.create({
            //   InventoryTypeID:_type.ID,
            //   Description:row[0].trim(),
            //   ModelName:row[0].trim(),
            //   Cost:cost
            // });
            ret.invs.push({
              InventoryTypeID:_type.ID,
              InventoryType:_type.Name,
              Description:row[0].trim(),
              ModelName:row[0].trim(),
              Cost:cost
            });
          
            // _inventory= await db.inventory.findAll({where: {
            //   InventoryTypeID:_type.ID,
            //   ModelName:row[0].trim()
            // }});
          }

          // if(_inventory.length>0){
          //   let nu = _inventory[0];
          //   let _inventory_items = await inventory_items.findAll({where: {
          //     InventoryID: nu.ID, 
          //     Size:row[2].trim(), 
          //     Barcode:row[3].trim()
          //   }});
          //   let _inv_item = null;
          //   if(_inventory_items.length>0){
          //     // //update
          //     // let inv_item = _inventory_items[0];
          //     // let update = {
          //     //   InventoryID: nu.ID,
          //     //   Size:row[2].trim(), 
          //     //   StatusID:2,
          //     //   Barcode:row[3].trim()
          //     // }
          //     // _inv_item = await inventory_items.update(update, {
          //     //   where: {
          //     //     ID: inv_item.ID
          //     //   }
          //     // });
          //   }
          //   else{
          //     //create
          //     // inv_item = await inventory_items.create({
          //     //   InventoryID: nu.ID,
          //     //   Size:row[2].trim(), 
          //     //   StatusID:2,
          //     //   Barcode:row[3].trim()
          //     // });

          //     // ret.items.push({
          //     //     InventoryID: nu.ID,
          //     //     Size:row[2].trim(), 
          //     //     StatusID:2,
          //     //     Barcode:row[3].trim()
          //     //   });
          //   }
          // }
      } //end of jsondata for
     
      const unique = removeDuplicateObjectFromArray(ret.invs, "ModelName");  
      res.json(unique);
    } );
  } catch (err) {
    res.status(500).send({
      message: `Error importing`
    });
  }
};
