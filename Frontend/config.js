// const SOURCE="192.168.56.101"
const SOURCE="localhost"
const PORT=3000

module.exports={
    BACKEND: `http://${SOURCE}:${PORT}` // Si changement, changer aussi dans /Backend/.env le PORT
}
