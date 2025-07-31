import { DataTypes } from "sequelize";

const MemberModel = (sequelize) => {
  const Member = sequelize.define("Member", {
    MemberID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    MemberName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    JoinDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    PasswordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Image: {
      type: DataTypes.STRING,
      allowNull: true, 
    }

  }, {
    tableName: "Members",  
    timestamps: false        
  });

  return Member;
};

export default MemberModel;
