const SOURCE="192.168.1.26"
const PORT=3000

module.exports={
    BACKEND: `http://${SOURCE}:${PORT}` // Si changement, changer aussi dans /Backend/.env le PORT
}
