const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_2207');

const User = conn.define('user', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

const Department = conn.define('department', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

User.belongsTo(Department);
Department.hasMany(User);

const init = async()=> {
  console.log('start');
  try {
    await conn.sync({ force: true });
    const [moe, lucy, larry, ethyl, hr, engineering, finance] = await Promise.all([
      User.create({ name: 'moe'}),
      User.create({ name: 'lucy'}),
      User.create({ name: 'larry'}),
      User.create({ name: 'ethyl'}),
      Department.create({ name: 'hr'}),
      Department.create({ name: 'engineering'}),
      Department.create({ name: 'finance'}),
    ]);
    lucy.departmentId = engineering.id;
    ethyl.departmentId = engineering.id;
    larry.departmentId = hr.id

    await Promise.all([
      lucy.save(),
      ethyl.save(),
      larry.save()
    ]);
    console.log('done seeding');
  }
  catch(ex){
    console.log(ex);
  }
};

init();
