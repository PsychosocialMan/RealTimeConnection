let oracledb = require("oracledb");
let config = require("./config/db-config");

function execute(statement, binds = [], opts = {}) {
    return new Promise(async (resolve, reject) => {
        opts.autoCommit = true;
        let connection;
        try {
            connection = await oracledb.getConnection(config);
            console.debug(`Запрос: ${statement}. Параметры: ${binds}`);
            const result = await connection.execute(statement, binds, opts);
            resolve(result);
        } catch (err) {
            reject(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    });
}

module.exports.execute = execute;

