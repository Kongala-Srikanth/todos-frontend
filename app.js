const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const {v4:uuidv4} = require('uuid')
require('dotenv').config();
const {ObjectId, MongoClient} = require('mongodb')

const app = express()

app.use(express.json())
app.use(cors())

let client 
const initializeDBandServer = async () => {

    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbCluster = process.env.DB_CLUSTER;
    const dbName = process.env.DB_NAME;
    const url = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority`;    
    client = new MongoClient(url)

    try{
        await client.connect()
        console.log('Successfully Connected to MongoDB')

        const port = 3000
        app.listen(port, () => {
            console.log('Server Running at Port:', port)
        })
    }
    catch(error){
        console.log(`Error while connecting to MongoDB: ${error.message}`)
        process.exit(1)
    }
}

initializeDBandServer()



const middlewareJwtToken = (request, response, next) => {
    let jwtToken

    const authHeader = request.headers["authorization"]

    if(authHeader !== undefined){
        jwtToken = authHeader.split(" ")[1]
    }
    if(jwtToken === undefined){
        response.status(401)
        response.send({errorMsg: "Invalid JWT Token"})
    }
    else{
        jwt.verify(jwtToken, process.env.JWT_SECRET, async(error, payload)=> {
            if(error){
                response.status(401)
                response.send({errorMsg: error})
            }
            else{
                request.userId = payload.userId
                next();
            }
        })
    }
}

// API-1 Creating New User Account

app.post('/register', async(request, response) => {
    const collection = client.db(process.env.DB_NAME).collection('userDetails')
    const {username, email, password} = request.body

    const checkUserInDB = await collection.find(
        {email}
    ).toArray();

    if(checkUserInDB.length === 0){
        const hashedPassword = await bcrypt.hash(password, 10)

        if(username !==undefined){
            await collection.insertOne({
                username: username,
                email: email,
                password: hashedPassword
            })
            
            response.status(201)
            response.send('User Registered Successfully')
        }
        else{
            response.status(401)
            response.send({errorMsg: 'Please Enter Valid User Details'})
        }
        
    }
    else{
        response.status(401)
        response.send({errorMsg: "User Already Exists"})
    }
})


// API-2 User Login

app.post('/login', async(request, response) => {
    const {username, password} = request.body
    const collection = client.db(process.env.DB_NAME).collection('userDetails')
 
    
    const checkUserInDB = await collection.find({username}).toArray()
    
    if(checkUserInDB.length === 1){
        const verifyPassword = await bcrypt.compare(password, checkUserInDB[0].password)
        if(verifyPassword){
            const token = jwt.sign({userId: checkUserInDB[0]._id }, 'MY_SECRET_TOKEN')
            response.status(201)
            response.send({jwtToken: token})
        }
        else{
            response.status(401)
            response.send({errorMsg: 'Incorrect Password'})
        }

    }
    else{
        response.status(401)
        response.send({errorMsg: "User Doesn't Exists"})
    }

})


// API Create Todos 

app.post('/todos', middlewareJwtToken, async (request, response) => {
    const { id, status, task } = request.body;
    const collection = client.db(process.env.DB_NAME).collection('userDetails');

    const findUserId = new ObjectId(request.userId); 

    try {
        const findUser = await collection.findOne({ _id: findUserId });

        if (!findUser) {
            return response.status(404).json({ message: 'User not found' });
        }

        const newTodo = {
            userId: findUserId,
            id: id,
            status: status,
            task: task,
        };

        const todosTableData = client.db(process.env.DB_NAME).collection('todoList');
        const result = await todosTableData.insertOne(newTodo);
        response.status(201).json({ message: 'Todo added successfully', todoId: result.insertedId });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error adding todo', error: error.message });
    }
});


// API-4 Update Todo


app.put('/todo/:id', middlewareJwtToken, async (request, response) => {
    const { id } = request.params;
    const { task, status } = request.body;
    const todosTableData = client.db(process.env.DB_NAME).collection('todoList');


    try {
        const updateData = {};


        switch (true) {
            case !!task && !!status:
                updateData.task = task;
                updateData.status = status;
                break;
            case !!task:
                updateData.task = task;
                break;
            case !!status:
                updateData.status = status;
                break;
            default:
                return response.status(400).send({ errorMsg: 'No valid fields to update' });
        }
        

        const result = await todosTableData.updateOne(
            { id: parseInt(id), userId: new ObjectId(request.userId) }, 
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return response.status(404).send({ errorMsg: 'Todo not found' });
        }

        response.status(200).send({ message: 'Todo updated successfully' });
    } catch (error) {
        response.status(500).send({ errorMsg: 'Failed to update todo' });
    }
});

// API-5 Todo Deletion

app.delete('/todo/:id', middlewareJwtToken, async (request, response) => {
    const { id } = request.params; 
    const todosTableData = client.db(process.env.DB_NAME).collection('todoList');
    const findUserId = new ObjectId(request.userId); 

    try {
        const result = await todosTableData.deleteOne({
            id: parseInt(id), 
            userId: findUserId 
        });

        if (result.deletedCount === 0) {
            return response.status(404).json({ message: 'Todo not found' });
        }

       
        response.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        response.status(500).json({ message: 'Error', error: error.message });
    }
});


// API-6 Update user details

app.put('/profile', middlewareJwtToken, async (request, response) => {
    const { userId } = request;
    const { username, email, password } = request.body;
    const userCollection = client.db(process.env.DB_NAME).collection('userDetails');
    const updateFields = {};

    try {

        if(username){
            updateFields.username = username
        }
    
        if(email){
            updateFields.email = email
        }
    
        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }
        
        if (Object.keys(updateFields).length === 0) {
            return response.status(400).send({ errorMsg: "No fields provided to update" });
        }

        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return response.status(404).send({ errorMsg: "User not found" });
        }

        response.status(200).send({ message: "User updated successfully" });
    } catch (error) {
        console.error("Update error:", error);
        response.status(500).send({ errorMsg: "Failed to update user data" });
    }
});


app.get('/todos', middlewareJwtToken, async (request, response) => {
    const userCollection = client.db(process.env.DB_NAME).collection('todoList');
    const {userId} = request
    const findUserId = new ObjectId(userId)

    try{
        const data = await userCollection.find({userId: findUserId}).toArray()
        response.status(200).json(data)

    }catch (e){
        console.log('Error fetching all todos:', e)
        response.status(500).json({message: 'Failed to fetch todos', error: e.message})
    }
    
})