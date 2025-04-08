import * as categoryService from "../services/category.js";
import { Message, statusCodes } from "../core/common/constant.js";
import { asyncHandler } from "../utils/asyncWrapper.js";
import CustomError from "../utils/exception.js";

const addCategory  = async (req, res, next) => {
  const categoryData = await categoryService.addCategory(req, res, next);
  res.status(statusCodes?.created).send(categoryData);
};

const deleteCategory  = async (req, res, next) => {
  const categoryData = await categoryService.deleteCategory(req, res, next);
  res.status(statusCodes?.ok).send(categoryData);
};

const getCategory = async  (req, res, next) => {
  const category = await categoryService.getCategory(req, res, next); 
  res.status(statusCodes?.ok).send(category); 
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params; 
  const updatedData = req.body; 

  const updatedCategory = await categoryService.updateCategory(id, updatedData);

  res.status(statusCodes?.ok).send(updatedCategory); 
};




export default {
    addCategory,
    deleteCategory,
    getCategory,
    updateCategory
    
  
};
