import { Category } from "../models/category.js";
import { errorCodes, Message, statusCodes } from "../core/common/constant.js";
import CustomError from "../utils/exception.js";

export const addCategory  = async (req) => {
  
  const { categoryName,desc, isAvailable} = req.body;

  

  const isCategoryAlreadyExist = await Category.findOne({ categoryName });

  if (isCategoryAlreadyExist) {
    throw new CustomError(
      statusCodes?.conflict,
      Message?.alreadyExist,
      errorCodes?.already_exist,
    );
  }
  const categoryImage = req.file ? `/uploads/${req.file.filename}` : null;
 

  const category = await Category.create({
    categoryName,
    desc, 
    isAvailable, 
    categoryImage
  });

  const createdCategory  = await Category.findById(category._id);
  

  if (!createdCategory) {
    return new CustomError(
      statusCodes?.serviceUnavailable,
      Message?.serverError,
      errorCodes?.service_unavailable,
    );
  }

  return createdCategory ;
};


export const deleteCategory = async (req) => {
  const { id } = req.params; 

 
  const category = await Category.findById(id);
  if (!category) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    );
  }


  await Category.findByIdAndDelete(id);

  return {
    message: Message?.deletedSuccessfully,
    categoryId: id,
  };
};

export const getCategory = async () => {
  const category = await Category.find(); 
  return category;
};

export const updateCategory = async (id, updatedData) => {
  
  const category = await Category.findByIdAndUpdate(id, updatedData, { new: true });

  if (!category) {
    throw new CustomError(
      statusCodes?.notFound,
      "Category not found",
      errorCodes?.not_found,
    );
  }

  return category;
};

