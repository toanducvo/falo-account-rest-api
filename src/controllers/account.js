const express = require("express");
const bscrypt = require("bcrypt");
const { StatusCodes, getReasonPhrase: Message } = require("http-status-codes");

const firebase = require("../firebase");

const createToken = require("../auth/create");

// Create reference to firebase database
const database = firebase.firestore();

/**
 * Account registration handler
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
const register = async (req, res) => {
  try {
    // Parse body
    const { phoneNumber, password, role, username, fullName, gender } =
      req.body;

    const user = {
      fullName: fullName,
      gender: gender,
    };

    const account = {
      phoneNumber: phoneNumber,
      password: password,
      role: role,
      username: username,
    };

    if (
      (await findByPhoneNumber(account.phoneNumber)) !== null ||
      (await findByUsername(account.username)) !== null
    ) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "error",
        message: "Phone number or username already exists",
      });
    }

    const salt = await bscrypt.genSalt(10);
    const hashedPassword = bscrypt.hashSync(account.password, salt);

    Promise.all([
      // Add account to firestore
      database.collection("accounts").add({
        ...account,
        password: hashedPassword,
        createdAt: new Date(),
      }),

      // Add user to firestore
      database.collection("users").add(user),
    ])
      .then((results) => {
        // Get account id
        const accountId = results[0].id;

        // Get user id
        // Update id of user
        const userId = results[1].id;
        results[1].update({ id: userId });

        // Add user id to account
        // Update user id of account and account id of user
        results[0].update({ userId: userId, id: accountId });
      })
      .then(() => {
        // Create token
        const token = createToken(account);

        console.log(token);
        // res.header("Authorization", token);
        return res.status(StatusCodes.CREATED).json({
          status: "success",
          message: "Create account successfully",
        });
      });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: Message(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
};

/**
 * Account login handler
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const account = await findByPhoneNumber(phoneNumber);

  if (account === null)
    return res.status(StatusCodes.CONFLICT).json({
      status: "error",
      message: "Phone number or password is not correct",
    });

  if (!(await comparePassword(password, account.password)))
    return res.status(StatusCodes.CONFLICT).json({
      status: "error",
      message: "Phone number or password is not correct",
    });

  // Create token
  const token = createToken(account);
  res.header("Authorization", token);

  return res.status(StatusCodes.OK).json({
    status: "success",
    message: "Login sucessfully",
  });
};

/**
 * Get account by phone number
 * @param {string} phoneNumber
 */
const findByPhoneNumber = async (phoneNumber) => {
  const accounts = await database
    .collection("accounts")
    .where("phoneNumber", "==", phoneNumber)
    .get();
  if (accounts.empty) return null;
  return accounts.docs[0].data();
};

/**
 * Get account by username
 * @param {string} username
 * @returns {object} account
 */
const findByUsername = async (username) => {
  const accounts = await database
    .collection("accounts")
    .where("username", "==", username)
    .get();
  if (accounts.empty) return null;
  return accounts.docs[0].data();
};

/**
 * Compare password with hash and return true if match
 * @param {string} password
 * @param {string} hash
 * @returns
 */
const comparePassword = async (password, hash) => {
  return bscrypt.compareSync(password, hash);
};

const deleteAccount = async (req, res, next) => {
  const { id } = req.params.phoneNumber || req.params.username;

  if (!id)
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: "Phone Number or username is required",
    });
};

module.exports.register = register;
module.exports.login = login;
