module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "User", // 테이블 명
      // 스키마 정의
      {
        email: {
          type: DataTypes.STRING(100), // 40자 이내
          allowNull: false, // 필수
          unique: true, // 중복 금지
        },
        nickname: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        // id, createdAt, updatedAt => 필드 자동 생성
      },
      // 테이블 옵션
      {
        charset: 'utf8',
        collate: "utf8_general_ci", // 한글 저장되도록
      }
    );
  
    return User;
  };