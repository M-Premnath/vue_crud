const { createPool } = require('mysql');

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "test",
    connectionLimit: 10
});

module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          ws: true,
          changeOrigin: true
        }
      }
    }
  }
