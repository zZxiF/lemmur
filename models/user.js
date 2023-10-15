const {Model,DataTypes}=require('sequelize');
const crypt=require('../helpers/crypt');
const sequelize = require('sequelize');
const { DataTypes } = require('sequelize');

//Modelo de usuario
module.exports = (sequelize)=>{
    class User extends Model{
        verifyPassword(password){
            return crypt.encryptPassword(password,this.salt)==this.password;
        }
    }
    User.init({
        username:{
            type: DataTypes.STRING,
            unique: true,
            validate: {notEmpty: {msg:"El nompre de usuario no puede estar vacío"}}
        },
        password: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg:"La contraseña no puede estar vacía"}},
            set(password){
                //Se genera un string aleatorio para salt
                this.salt=Math.round((new Date().valueOf().Math.random()))+'0';
                this.setDataValue('password', crypt.encryptPassword(password,this.salt));
            }
        },
        salt:{
            type:DataTypes.STRING
        },
        isAdmin:{
            type:DataTypes.BOOLEAN,
            devaultValue: false
        }
    })
}