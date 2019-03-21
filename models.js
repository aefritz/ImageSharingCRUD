const Sequelize = require('sequelize');
let sequelize;
if (process.env.DATABASE_URL) {
sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  operatorsAliases: false,
  define: {
    underscored: true,
    returning: true
  }
});
} else {
  sequelize = new Sequelize({
    database: 'PostPicle',
    dialect: 'postgres',
    operatorsAliases: false,
    define: {
      underscored: true,
      returning: true
  }
  });
}

const User = sequelize.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password_digest: Sequelize.STRING,
  bio: Sequelize.TEXT,
  pro_pic: Sequelize.STRING
});

const Post = sequelize.define('post', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  publicId: Sequelize.STRING,
});

const Comment = sequelize.define('Comment', {
  text: Sequelize.TEXT
});

const Like = sequelize.define('Likes', {
});

User.hasMany(Post, { onDelete: 'cascade' });
Post.belongsTo(User);

User.belongsToMany(Post, { through: 'Likes' });
Post.belongsToMany(User, { through: 'Likes' });

User.belongsToMany(Post, { through: 'Comment' });
Post.belongsToMany(User, { through: 'Comment' });


module.exports = {
  Post,
  User,
  Comment,
  Like,
  sequelize
}
