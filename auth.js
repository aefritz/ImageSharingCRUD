const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = 'SECRET_PASS';

const hash = async (pass) => await bcrypt.hash(pass, 10);
const compare = async (pass, hashedPass) => await bcrypt.compare(pass, hashedPass);
const encode = async (data) => await jwt.sign(data, SECRET);
const verify = async (token) => await jwt.verify(token, SECRET);
const restrict = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, SECRET);
    res.locals.user = data; //do we need this line?
    next();
  } catch (e) {
    console.log(e);
    res.status(403).send('Unauthorized');
  }
}

module.exports = {
  hash,
  compare,
  encode,
  verify,
  restrict
};
