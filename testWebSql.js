'use strict';

const db = openDatabase('test', '1.0', 'test database!!', 2 * 1024 * 1024);

const createTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS COMPANIES (COMPANY_NAME, COUNTRY)'
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS PRODUCTIONS (COMPANY_IDX, PRODUCTION_NAME)'
        );
      },
      [],
      () => {
        resolve();
      },
      () => {
        reject(new Error('create table fail'));
      }
    );
  });
};

const dropTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('DROP TABLE IF EXISTS COMPANIES');
        tx.executeSql('DROP TABLE IF EXISTS PRODUCTIONS');
      },
      [],
      () => {
        resolve();
      },
      () => {
        reject(new Error('drop table error'));
      }
    );
  });
};

const insertData = (datas) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        datas.forEach((item, i) => {
          const companyName = datas[i].company;
          const country = datas[i].country;

          console.log(`${companyName} / ${country}`);
          tx.executeSql(
            'INSERT INTO COMPANIES(COMPANY_NAME, COUNTRY) VALUES(?,?)',
            [companyName, country],
            (tx, result) => {
              console.log(tx, result);
            },
            (tx, result) => {
              console.error(tx, result);
              reject(new Error('insert data fail'));
            }
          );
        });
      },
      [],
      () => {
        resolve();
      },
      () => {
        reject(new Error('insert data fail'));
      }
    );
  });
};
async function asyncInsertData_companies() {
  db.transaction(
    (tx) => {
      datas.forEach((item, i) => {
        const companyName = datas[i].company;
        const country = datas[i].country;

        console.log(`${companyName} / ${country}`);
        tx.executeSql(
          'INSERT INTO COMPANIES(COMPANY_NAME, COUNTRY) VALUES(?,?)',
          [companyName, country],
          (tx, result) => {
            console.log(tx, result);
          },
          (tx, result) => {
            console.error(tx, result);
            new Error('async insert data error');
          }
        );
      });
    },
    [],
    () => {
      // resolve();
    },
    () => {
      new Error('async insert data error');
    }
  );
}
async function asyncInsertData_productions() {
  db.transaction(
    (tx) => {
      datas2.forEach((item, i) => {
        const company_idx = datas2[i].company_idx;
        const production_name = datas2[i].production_name;

        console.log(`${company_idx} / ${production_name}`);
        tx.executeSql(
          'INSERT INTO PRODUCTIONS(COMPANY_IDX, PRODUCTION_NAME) VALUES(?,?)',
          [company_idx, production_name],
          (tx, result) => {
            console.log(tx, result);
          },
          (tx, result) => {
            console.error(tx, result);
            new Error('async insert data error');
          }
        );
      });
    },
    [],
    () => {
      // resolve();
    },
    () => {
      new Error('async insert data error');
    }
  );
}
function selectTable(table) {
  let query = 'SELECT * FROM ' + table;

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (tx, result) => {
          resolve(result.rows);
        },
        (tx, result) => {
          reject(result);
        }
      );
    });
  });
}
async function asyncSelectTable(table) {
  return await selectTable(table);
}

const datas = [
  { company: 'google', country: 'usa' },
  { company: 'samsung', country: 'korea' },
  { company: 'sony', country: 'japan' },
  { company: 'siemens', country: 'germany' },
];
const datas2 = [
  { company_idx: 1, production_name: 'qqqq' },
  { company_idx: 2, production_name: 'wwww' },
  { company_idx: 3, production_name: 'eeee' },
];

// web sql test1
// dropTable().then(() => {
//   createTable().then(() => {
//     console.log('create table success!!');
//   });
// });

// web sql test2
// createTable().then(() => {
//   console.log('create table success!!');
//   insertData(datas).then(() => {
//     console.log('insert data success!!');
//   });
// });

// web sql test3 using promise chain
// dropTable() //
//   .then(console.log('drop table success'))
//   .then(createTable)
//   .then(console.log('create table success'))
//   .then(() => {
//     console.log('before insert data');
//     insertData(datas) //
//       .then(console.log('insert data success'))
//       .catch(console.log);
//   })
//   .catch(console.log);

// seq sql test4 using async & await
function asyncInsertData() {
  return new Promise((resolve, reject) => {
    try {
      Promise.all([asyncInsertData_companies(), asyncInsertData_productions()]);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
function asyncSelectData() {
  return Promise.all([
    asyncSelectTable('COMPANIES'),
    asyncSelectTable('PRODUCTIONS'),
  ]);
}
dropTable() //
  .then(console.log('drop table success'))
  .then(createTable)
  .then(console.log('create table success'))
  .then(() => {
    console.log('before insert data');

    asyncInsertData().then(() => {
      console.log('select table before');

      asyncSelectData().then((res) => {
        console.log('--------------------------------------------------');
        console.log(res);
      });
    });
  })
  .catch(console.log);
