let express = require("express");

let app = express();

app.use(express.json());

app.use(function (req, res, next) {

res.header("Access-Control-Allow-Origin","*");

res.header(

"Access-Control-Allow-Methods",

"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"

);

res.header(

"Access-Control-Allow-Headers",

"Origin, X-Requested-With, Content-Type, Accept"

);

next();

});

var port=process.env.port || 2410;

app.listen(port, () => console.log(`Listening on port ${port}!`));
let {customerData}=require("./customerData.js");
let fs=require("fs");
let fname="CustomersData.json";

app.get("/resetData",function(req,res){
    let str=JSON.stringify(customerData);
    fs.writeFile(fname,str,function(err,){
        if(err)res.status(404).send(err);
        else{
            res.send("Data is reset");
        }
    })
});

app.get("/customers/:id",function(req,res){
    let id=req.params.id;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let customerData=JSON.parse(data);
            let index=customerData.findIndex(k=>k.id===id);
    if(index<0)res.status(404).send("No Data Found");
    else{
        let str=JSON.stringify(customerData);
        fs.writeFile(fname,str,function(err){
            if(err)res.status(404).send(err);
            else{
           res.send(customerData[index]); 
            }
        })
         
    }
        }
    })
    
});
app.get("/customers",function(req,res){
    let city=req.query.city;
    let gender=req.query.gender;
    let payment=req.query.payment;
    let sortBy=req.query.sortBy;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let customerData=JSON.parse(data);
            res.send(customerData);
        }
    });
    if(city){
        customers=customers.filter(k=>k.city===city);
    }
    if(gender){
        customers=customers.filter(k=>k.gender===gender);
    }
    if(payment){
        customers=customers.filter(k=>k.payment===payment);
    }
    if(sortBy){
        if(sortBy==="city"){
         customers=customers.sort((c1,c2)=>c1.city.localeCompare(c2.city));
        }
        else if(sortBy==="age"){
         customers=customers.sort((c1,c2)=>+c1.age-(c2.age));
        }
        else if(sortBy==="payment"){
         customers=customers.sort((c1,c2)=>c1.payment.localeCompare(c2.payment));
        }
    }
    
});
app.post("/customers" ,function(req,res){
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let obj=JSON.parse(data);
            obj.push(body);
            let students=JSON.stringify(obj);
            fs.writeFile(fname,students,function(err){
                if(err)res.status(404).send(err);
                else{
                    res.send(body);
                }
            })
        }
    })
});
app.put("/customers/:id" ,function(req,res){
    let id=req.params.id;
    let body=req.body;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
        let customersData=JSON.parse(data);
        let index=customersData.findIndex(k=>k.id===id);
        if(index<0)res.status(404).send("No Data Found");
        else{
        let updatedStudent={id:id,...body};
        customersData[index]=updatedStudent;
        let str=JSON.stringify(customersData);
        fs.writeFile(fname,str,function(err,data){
            if(err)res.status(404).send(err);
            else{
             res.send(updatedStudent);
            }
        })
        
        
    }
        }
    })
   
});
app.delete("/customers/:id" ,function(req,res){
   let id=req.params.id;
    fs.readFile(fname,"utf-8",function(err,data){
        if(err)res.status(404).send(err);
        else{
            let studentsData=JSON.parse(data);
    let index=studentsData.findIndex(k=>k.id===id);
    if(index<0)res.status(404).send("No Data Found");
    else{
        let delStud= studentsData.splice(index,1);
        let str=JSON.stringify(studentsData);
        fs.writeFile(fname,str,function(err){
            if(err)res.status(404).send(err);
            else{
        res.send(delStud);
            }
        })

      
        
    }
        }
    })
   
});
