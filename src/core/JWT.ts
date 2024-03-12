
async function encode(payload) {
  // const token = jwt.sign(payload, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRATION,
  // });
  // return token;

}

async function decode(token: string) {
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // return decoded;

}

async function validate(token: string) {
  
}

export default {
  encode,
  validate,
  decode,
};
