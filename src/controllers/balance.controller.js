import dayjs from "dayjs"
import { db } from "../database/database.connection.js"

export async function postNewBalance(req, res){
    const {value, description} = req.body
    const {tipo} = req.params
    const hour = dayjs()

    console.log(res.locals.session, "Comentario")

    try {
        const today = hour.format("DD/MM")
        await db.collection("balance").insertOne({id: res.locals.session.idUser, value, description, today, tipo})
        

        res.status(201).send(`${tipo} criado com sucesso`)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export  async function getBalance(req, res){
    const {idUser} = res.locals.session

    console.log(idUser)
    try {
        const userBalances = await db.collection("balance").find({id: idUser}).toArray()

        res.send(userBalances)
    } catch (err){
        res.status(500).send(err.message)
    }
}