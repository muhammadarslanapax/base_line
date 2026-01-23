const asyncHandler = require("../../utils/asycHandler");
const apiResponse = require("../../utils/apiResponse");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const {Category,PaymentMethod,Business} = require("../../models")
const apiError = require("../../utils/apiError");




// business


  const createBusiness = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name, description, address, categoryIds, paymentMethodIds, phone } = req.body;
  
    // Check if business already exists for this user
    const existingBusiness = await Business.findOne({ where: { userId } });
    if (existingBusiness) {
      throw new apiError(STATUS_CODES.CONFLICT, "Business already exists for this user");
    }
  
    // Validate category IDs
    const categories = await Category.findAll({ where: { id: categoryIds } });
    if (!categories || categories.length !== categoryIds.length) {
    throw new apiError(STATUS_CODES.BAD_REQUEST, "One or more category IDs are invalid");
  }
  
    // Validate payment method IDs
    const payments = await PaymentMethod.findAll({ where: { id: paymentMethodIds } });
    if (!payments || payments.length !== paymentMethodIds.length) {
      throw new apiError(STATUS_CODES.BAD_REQUEST, "One or more payment method IDs are invalid");
    }
  
    // Create business with IDs
    await Business.create({
      name,
      description,
      address,
      categoryIds,
      paymentMethodIds,
      phone,
      userId
    });
  
    res.status(STATUS_CODES.SUCCESS).json(
      new apiResponse(STATUS_CODES.SUCCESS, "Business created successfully")
    );
  });
  

   
  const updateBusiness = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const updateData = req.body; 
  
    // Check if user has a business
    let business = await Business.findOne({
      where: { userId }
    });
  
    if (!business) {
      throw new apiError(
        STATUS_CODES.NOT_FOUND,
        "Business does not exist. Please create a business first."
      );
    }
  
    await business.update(updateData);
  
    res.status(STATUS_CODES.SUCCESS).json(
      new apiResponse(
        STATUS_CODES.SUCCESS,
        "Business updated successfully",
        business
      )
    );
  });


  // category



const createCategory = asyncHandler(async (req, res) => {
  const { name} = req.body;

  if(!name){
    throw new apiError(
        STATUS_CODES.BAD_REQUEST,
        "name is required"
      );

  }



  const category = await Category.findOne({
    where: {  name: name }, 
  });

  if (category) {
    throw new apiError(
      STATUS_CODES.CONFLICT,
      "Category already exists."
    );
  }

  await Category.create({
    name
  });

  
  res.status(STATUS_CODES.SUCCESS).json(
    new apiResponse(STATUS_CODES.SUCCESS, "Category created successfully")
  );
});


const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.findAll({
      order: [["createdAt", "DESC"]],
    });
  
    res.status(STATUS_CODES.SUCCESS).json(
      new apiResponse(STATUS_CODES.SUCCESS, "Categories fetched", categories)
    );
  });


  const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const category = await Category.findByPk(id);
  
    if (!category) {
      throw new apiError(STATUS_CODES.NOT_FOUND, "Category not found");
    }
  
    res.status(STATUS_CODES.SUCCESS).json(
      new apiResponse(STATUS_CODES.SUCCESS, "Category fetched", category)
    );
  });
  


  const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    const category = await Category.findByPk(id);
  
    if (!category) {
      throw new apiError(STATUS_CODES.NOT_FOUND, "Category not found");
    }
  
    if (name) {
      const exist = await Category.findOne({ where: { name } });
      if (exist && exist.id !== id) {
        throw new apiError(
          STATUS_CODES.CONFLICT,
          "Another category exists with this name."
        );
      }
    }
  
    await category.update({ name });
  
    res.status(STATUS_CODES.SUCCESS).json(
      new apiResponse(STATUS_CODES.SUCCESS, "Category updated", category)
    );
  });
  

  const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const category = await Category.findByPk(id);
  
    if (!category) {
      throw new apiError(STATUS_CODES.NOT_FOUND, "Category not found");
    }
  
    await category.destroy();
  
    res.status(STATUS_CODES.SUCCESS).json(
      new apiResponse(STATUS_CODES.SUCCESS, "Category deleted successfully")
    );
  });



  // ------ Payment method


  const createPaymentMethod = asyncHandler(async (req, res) => {
    const { name} = req.body;
  
    if(!name){
      throw new apiError(
          STATUS_CODES.BAD_REQUEST,
          "name is required"
        );
  
    }
  
  
  
    const payment = await PaymentMethod.findOne({
      where: {  name: name }, 
    });
  
    if (payment) {
      throw new apiError(
        STATUS_CODES.CONFLICT,
        "Payment Method already exists."
      );
    }
  
    await PaymentMethod.create({
      name
    });
  
    
    res.status(STATUS_CODES.SUCCESS).json(
      new apiResponse(STATUS_CODES.SUCCESS, "Payment Method created successfully")
    );
  });
  
  
  const getAllPaymentMethod = asyncHandler(async (req, res) => {
      const payments = await PaymentMethod.findAll({
        order: [["createdAt", "DESC"]],
      });
    
      res.status(STATUS_CODES.SUCCESS).json(
        new apiResponse(STATUS_CODES.SUCCESS, "Payment Method fetched", payments)
      );
    });
  
  
    const getPaymentMethod = asyncHandler(async (req, res) => {
      const { id } = req.params;
    
      const payment = await PaymentMethod.findByPk(id);
    
      if (!payment) {
        throw new apiError(STATUS_CODES.NOT_FOUND, "Payment Method not found");
      }
    
      res.status(STATUS_CODES.SUCCESS).json(
        new apiResponse(STATUS_CODES.SUCCESS, "Payment fetched", payment)
      );
    });
    
  
  
    const updatePaymentMethod = asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { name } = req.body;
    
      const payment = await PaymentMethod.findByPk(id);
    
      if (!payment) {
        throw new apiError(STATUS_CODES.NOT_FOUND, "Payment Method not found");
      }
    
      if (name) {
        const exist = await PaymentMethod.findOne({ where: { name } });
        if (exist && exist.id !== id) {
          throw new apiError(
            STATUS_CODES.CONFLICT,
            "Another payment method exists with this name."
          );
        }
      }
    
      await payment.update({ name });
    
      res.status(STATUS_CODES.SUCCESS).json(
        new apiResponse(STATUS_CODES.SUCCESS, "Payment Method updated", payment)
      );
    });
    
  
    const deletePaymentMethod = asyncHandler(async (req, res) => {
      const { id } = req.params;
    
      const payment = await PaymentMethod.findByPk(id);
    
      if (!payment) {
        throw new apiError(STATUS_CODES.NOT_FOUND, "Payment Method not found");
      }
    
      await payment.destroy();
    
      res.status(STATUS_CODES.SUCCESS).json(
        new apiResponse(STATUS_CODES.SUCCESS, "Payment Method deleted successfully")
      );
    });
  


  
   



    
    

module.exports = {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    createPaymentMethod,
    getAllPaymentMethod,
    getPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    updateBusiness,
    createBusiness

};
