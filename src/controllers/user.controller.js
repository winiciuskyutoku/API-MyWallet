import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"


export async function postSingUp(req, res){
    const {name, email, password, confirmPassword} = req.body

    try {

        const checkEmail = await db.collection("users").findOne({email})
        if(checkEmail) return res.status(409).send("Email ja cadastrado")

        const hash = bcrypt.hashSync(password, 10)

        await db.collection("users").insertOne({name, email, password: hash})

        res.status(201).send(req.body)
    } catch (err) {
        res.status(500).send("err.messages")
    }
}

export async function postSingIn(req, res){
    const {email, password} = req.body

    try {
        const checkEmail = await db.collection("users").findOne({email})
        if(!checkEmail) return res.status(404).send("Email nao cadastrado")

        const correctPassword = bcrypt.compareSync(password, checkEmail.password)
        if(!correctPassword) return res.status(401).send("Senha incorreta")

        const token = uuid()
        await db.collection("sessions").insertOne({token, idUser: checkEmail._id, email})
        res.status(200).send(token)
    } catch (err) {
        res.status(500).send(err.message)
    }
}