import express from "express"
import cors from "cors"
import joi from "joi"
import dayjs from "dayjs"
import dotenv from "dotenv"
import {MongoClient} from "mongodb"
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

const mongoClient = new MongoClient(process.env.BASE_URL)
try{
    await mongoClient.connect()
    console.log("MongoDB conectado!")
} catch (err) {
    console.log(err)
}
const db = mongoClient.db()

const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(3),
    confirmPassword: joi.string().required().min(3)
})

const signinSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
})

app.post("/cadastro", async (req, res) => {
    const {name, email, password, confirmPassword} = req.body

    const validation = signupSchema.validate(req.body, {abortEarly: false})
    if(validation.error){
        const errors = validation.error.details.map(d => d.message)
        return res.status(422).send(errors)
    }


    try {
        if(password !== confirmPassword) return res.status(409).send("As senhas nao estao compativies!")

        const checkEmail = await db.collection("users").findOne({email})
        if(checkEmail) return res.status(409).send("Email ja cadastrado")

        const hash = bcrypt.hashSync(password, 10)

        await db.collection("users").insertOne({name, email, password: hash})

        res.status(201).send(req.body)
    } catch (err) {
        res.status(500).send("err.messages")
    }
})


app.post("/", async (req, res) => {
    const {email, password} = req.body

    const validation = signinSchema.validate(req.body, {abortEarly: false})
    if(validation.error){
        const errors = validation.error.details.map(d => d.message)
        return res.status(422).send(errors)
    }

    try {
        const checkEmail = await db.collection("users").findOne({email})
        if(!checkEmail) return res.status(404).send("Email nao cadastrado")

        const correctPassword = bcrypt.compareSync(password, checkEmail.password)
        if(!correctPassword) return res.status(401).send("Senha incorreta")

        const token = uuid()
        await db.collection("sessions").insertOne({token, idUser: checkEmail._id})
        res.status(200).send(token)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

const port = 5000
app.listen(port, () => console.log(`O servidor esta rodando na porta ${port}`))