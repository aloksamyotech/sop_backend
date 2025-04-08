import { Message, statusCodes } from "../core/common/constant.js";
import * as userService from '../services/user.js'

export const addUser  = async (req, res) => {
  const userData = await userService.addUser(req, res);
  res.status(statusCodes?.created).send(userData);
};


