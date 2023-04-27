const SOURCE="172.20.10.5"
// const SOURCE="localhost"
const PORT=3000

module.exports={
    BACKEND: `http://${SOURCE}:${PORT}` // Si changement, changer aussi dans /Backend/.env le PORT
}
