const express = require("express");
const bscrypt = require("bcrypt");
const { StatusCodes, getReasonPhrase: Message } = require("http-status-codes");

const firebase = require("../firebase");

// Import createToken method
const createToken = require("../auth/create");

// Import verifyToken method
const verifyToken = require("../auth/verify");

// Import refreshToken method
const refreshToken = require("../auth/refresh");

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
      birthDay: new Date("2000-01-01"),
      contactRequest: [],
      contacts: [],
      members: [],
      notifications: [],
      settings: [],
      avatar:
        "https://firebasestorage.googleapis.com/v0/b/falo-chat-app.appspot.com/o/user%2Fdefault%2FdefaultUser.jpg?alt=media&token=db2f66e1-0d86-42f8-a990-aff8c92ab48d",
    };

    var account = {
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
        account.userId = userId;
        results[1].update({
          id: userId,
          phoneNumber: account.phoneNumber,
        });

        // Add user id to account
        // Update user id of account and account id of user
        results[0].update({ userId: userId, id: accountId });
      })
      .then(() => {
        // Create token
        const token = createToken(account);

        return res.status(StatusCodes.CREATED).json({
          status: "success",
          message: "Create account successfully",
          data: {
            token: token,
            // refreshToken: refreshToken(token),
          },
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

  if (!comparePassword(password, account.password))
    return res.status(StatusCodes.CONFLICT).json({
      status: "error",
      message: "Phone number or password is not correct",
    });

  // Create token
  const token = createToken(account);

  return res.status(StatusCodes.OK).json({
    status: "success",
    message: "Login sucessfully",
    data: {
      token: token,
      // refreshToken: refreshToken(token),
    },
  });
};

/**
 * Change password
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
const changePassword = async (req, res) => {
  try {
    const { oldPassword, password } = req.body;

    // Assign password to new password for convenience
    // why?
    // prev: password to ensure that match password validation parameter
    // in validation middleware
    const newPassword = password;

    // Get token from request header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const payload = verifyToken(token);

    console.log(payload);

    // sub is id of user collection
    const account = await findByUserId(payload.sub);

    if (account === null || !(verifyToken(token).sub === account.userId))
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Account not found or unauthorized",
      });

    if (!comparePassword(oldPassword, account.password))
      return res.status(StatusCodes.CONFLICT).json({
        status: "error",
        message: "Old password is not correct",
      });

    const salt = await bscrypt.genSalt(10);
    const hashedPassword = bscrypt.hashSync(newPassword, salt);

    await database
      .collection("accounts")
      .doc(account.id)
      .update({ password: hashedPassword });

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Change password successfully",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * Reset password
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {void}
 */
const resetPassword = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const account = await findByPhoneNumber(phoneNumber);

    if (account === null)
      return res.status(StatusCodes.CONFLICT).json({
        status: "error",
        message: "Phone number is not correct or your account is not exist",
      });

    const salt = await bscrypt.genSalt(10);
    const hashedPassword = bscrypt.hashSync(password, salt);

    await database
      .collection("accounts")
      .doc(account.id)
      .update({ password: hashedPassword });

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Reset password successfully",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: Message(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
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
 * Get account by id
 * @param {string} id
 * @returns {object} account
 */
const findById = async (id) => {
  const account = await database.collection("accounts").doc(id).get();
  if (!account) return null;
  return account.data();
};

/**
 * Get account by userId
 * @param {string} userId
 * @returns {object} account
 */
const findByUserId = async (userId) => {
  const accounts = await database
    .collection("accounts")
    .where("userId", "==", userId)
    .get();
  if (accounts.empty) return null;
  return accounts.docs[0].data();
};

/**
 * Compare password with hash and return true if match
 * @param {string} password
 * @param {string} hash
 * @returns {boolean}
 */
const comparePassword = (password, hash) => {
  return bscrypt.compareSync(password, hash);
};

/**
 * Delete account
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns
 */
const deleteAccount = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Get account by phone number
    const account = await findByPhoneNumber(phoneNumber);

    // Get token from request header
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    // If token is invalid, return error
    // If account is not found, return error
    if (account === null || !((await verifyToken(token)).sub === account.id))
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Account not found or unauthorized",
      });

    // Delete user first
    await database.collection("users").doc(account.userId).delete();

    // then delete account
    await database.collection("accounts").doc(account.id).delete();

    // Return success status
    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Delete account successfully",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: Message(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  }
};

module.exports.register = register;
module.exports.login = login;
module.exports.changePassword = changePassword;
module.exports.resetPassword = resetPassword;
module.exports.deleteAccount = deleteAccount;
