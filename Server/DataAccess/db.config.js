
config = {
  development:{
        HOST: "localhost",
        USER: "yourname",
        PASSWORD: "yourpwd",
        DB: "inventory",
        dialect: "mysql",
        dialectOptions: { decimalNumbers: true },
        pool: {
          max: 2,
          min: 0,
          idle: 10000
        }
  },
  production:{
    HOST: "localhost",
    USER: "yourname",
    PASSWORD: "yourpwd",
    DB: "inventory",
    dialect: "mysql",
    dialectOptions: { decimalNumbers: true },
    pool: {
      max: 2,
      min: 0,
      idle: 10000
    }
  }
}

  module.exports = config[process.env.NODE_ENV] || config['production'];
