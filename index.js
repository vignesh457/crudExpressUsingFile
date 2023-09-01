const express = require("express");
const data = require("./data.json")
const fs = require("fs") 

const app = express();
const PORT = 5000;

app.use(express.urlencoded({extended:false}))//middleware1

app.use((req,res,next)=>{
    // if we send "response" (or) "return" then the server return from this middleware2 itself(i.e, won't run the CRUD operations)
    // res.send("middleware2")
    console.log("control passed from middleware1");
    //it is used to pass control from the current middleware function to the next middleware function (or) the final route handler
    next();
})

//Extra(Sever Side Rendering(SSR))
app.get("/users",(req,res)=>{
    const html = data.map((user)=>{
        return `<li>${user.first_name}</li>`
    }).join(" ")
    res.send(`<ol>${html}</ol>`)
})

//CRUD operations in express using RESTFUL API(Client Side Rendering(CSR))

//Read data
app.get("/api/users",(req,res)=>{
    res.json(data)
})
app.get("/api/users/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    //If you want to stop searching as soon as you find it, use find(). If you need all matching elements in a new array, use filter().
    const result = data.find((user)=>user.id===id) 
    if(!result){
        return res.status(404).json({message: `user not found with id:${id}`})
    }
    res.json(result);
})
//Write data
app.post("/api/users",(req,res)=>{
    const newData = { id: data.length+1, ...req.body};
    data.push(newData)
    fs.writeFile("./data.json",JSON.stringify(data),(err)=>{
        if (err) {
            return res.status(500).send({ status: 'error' });
        }
        return res.status(201).send({ status: 'success', id: data.length });
    })
})
//Update data
//PUT replaces the entire resource, while PATCH updates part of the resource.
app.patch("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    data.map((user,userIndex) => {
        if (user.id === id) {
            //try to modify updates in the existing array itself
            data[userIndex]={...user, ...req.body};
        }
    });
    fs.writeFile("./data.json", JSON.stringify(data), (err) => {
        if (err) {
            return res.status(500).send({ status: 'error' });
        }
        return res.send({ status: 'success', id: id });
    });
});
//Delete data
app.delete("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    data.map((user,userIndex) => {
        if(user.id === id){
            //splice is used for deleting because it can modify the existing array without creating a new array
            data.splice(userIndex,1); 
        }
    });
    fs.writeFile("./data.json", JSON.stringify(data), (err) => {
        if (err) {
            return res.status(500).send({ status: 'error' });
        }
        return res.send({ status: 'success', id: id });
    });
});


app.listen(PORT,()=>console.log(`server running at port:${PORT}`));

//Note : 
//Adding Different Status Codes : Using the correct HTTP status codes in your responses is essential for conveying the outcome of a request. Status codes like 200 (OK), 404 (Not Found), 500 (Internal Server Error), etc., provide clear information about the success or failure of a request. This helps both developers and clients understand the state of the operation.
//Using Proper HTTP Requests : Using the appropriate HTTP methods (GET, POST, PUT, DELETE, etc.) based on their use case is crucial for following the principles of the RESTful architecture. Each method has a specific purpose, and using them correctly helps maintain the logical separation of different operations on resources.
