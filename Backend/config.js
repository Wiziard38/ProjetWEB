require('mandatoryenv').load(['DB'])
const { DB } = process.env

module.exports = {
    local: {
        dialect: 'sqlite',
        storage: "bmt.sqlite",
        url: "127.0.0.1",
        logging: (...msg) => console.log(msg),
        //logging: false
      },
    deploiement: DB
}