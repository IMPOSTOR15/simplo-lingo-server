const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'user'
    },
    name: {
      type: DataTypes.TEXT,
      unique: true
    },
    avatar: {
      type: DataTypes.TEXT,
    },
  }, { 
    timestamps: false,
    tableName: 'user' 
  });
  
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
    },
    dificult: {
        type: DataTypes.TEXT,
    },
    points: {
      type: DataTypes.TEXT,
      defaultValue: 0,
      allowNull: false
    },
    correct_answer: {
        type: DataTypes.TEXT,
    },
  }, { 
    timestamps: false,
    tableName: 'question' 
  });
  
  const Answer = sequelize.define('Answer', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    question_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, { 
    timestamps: false,
    tableName: 'answers' 
  });
  
  const SolvedQuestion = sequelize.define('SolvedQuestion', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    question_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    solved_by_user: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, { 
    timestamps: false,
    tableName: 'solved_question' 
  });
  
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_solved: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, { 
    timestamps: false,
    tableName: 'rating' 
  });
  
  // Определение отношений
  Question.hasMany(Answer, { foreignKey: 'question_id' });
  Answer.belongsTo(Question, { foreignKey: 'id' });
  
  User.hasMany(SolvedQuestion, { foreignKey: 'solved_by_user' });
  SolvedQuestion.belongsTo(User, { foreignKey: 'solved_by_user' });
  
  User.hasOne(Rating, { foreignKey: 'user_id' });
  Rating.belongsTo(User, { foreignKey: 'user_id' });
  
  SolvedQuestion.belongsTo(Question, { foreignKey: 'question_id' });
  Question.hasMany(SolvedQuestion, { foreignKey: 'question_id' });

module.exports = {
    User,
    Question,
    Answer,
    SolvedQuestion,
    Rating,
}