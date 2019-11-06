module.exports = {
    queryAll: 'SELECT * FROM ?? limit ?,?',
    queryById: 'SELECT * FROM ?? WHERE id=?',
    queryByName: 'SELECT * FROM ?? WHERE name=?',
    del: 'DELETE FROM ?? WHERE id=?',
    queryCount:'Select count(*) count from ??',
    adminsAddIP:'update ?? set ip=? where name=?',
    adminsRemoveIP:'update ?? set ip=null where name=?'
};