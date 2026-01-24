const asyncHandler = require('../../utils/asycHandler');
const apiResponse = require('../../utils/apiResponse');
const apiError = require('../../utils/apiError');
const { STATUS_CODES } = require('../../config/constants');
const { User,Business,Service,Category,PaymentMethod } = require('../../models');
const { stripe, paypal } = require("../../config/payment");


// ------------------ SERVICE CONTROLLER ------------------

const createService = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "business") {
    throw new apiError(403, "Only business owners can create services");
  }

  const business = await Business.findOne({ where: { userId } });
  if (!business) throw new apiError(404, "Business not found for user");

  const { title, description, price, durationInMinutes, images, categoryId, paymentMethods } = req.body;

  const category = await Category.findByPk(categoryId);
if (!category) {
  throw new apiError(404, "Category not found — invalid categoryId");
}

  const existingService = await Service.findOne({
    where: { businessId: business.id, title },
  });

  if (existingService) {
    throw new apiError(409, "Service with this title already exists");
  }

  // Create service
  const service = await Service.create({
    businessId: business.id,
    title,
    description,
    price,
    durationInMinutes,
    images: images || [],
    categoryId,
  });

  // Associate payment methods if provided
  if (paymentMethods && paymentMethods.length > 0) {
    await service.setPaymentMethods(paymentMethods); 
  }

  // Fetch the service with category and payment methods
  const serviceWithRelations = await Service.findByPk(service.id, {
    include: [
      { model: Category, as: "category" },
      { model: PaymentMethod, as: "paymentMethods" ,
      through: { attributes: [] }
    
    },
    ],
  });

  res.status(201).json(new apiResponse(201, "Service created successfully", serviceWithRelations));
});







// ---------------- GET MY SERVICES ----------------
const getMyServices = asyncHandler(async (req, res) => {
  const userId = req.user.id;


  if (req.user.role !== "business") {
    throw new apiError(403, "Only business owners can view their services");
  }

  const business = await Business.findOne({ where: { userId } });
  if (!business) throw new apiError(404, "Business not found");

  const services = await Service.findAll({
    where: { businessId: business.id },
  });

  res.json(new apiResponse(200, "Services fetched", services));
});

// ---------------- UPDATE SERVICE ----------------
const updateService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const userId = req.user.id;

  if (req.user.role !== "business") {
    throw new apiError(403, "Only business owners can update services");
  }

  const business = await Business.findOne({ where: { userId } });
  if (!business) throw new apiError(404, "Business not found");

  const service = await Service.findOne({
    where: { id: serviceId, businessId: business.id },
  });

  if (!service) throw new apiError(404, "Service not found");

  await service.update(req.body);

  res.json(new apiResponse(200, "Service updated", service));
});

// ---------------- DELETE SERVICE ----------------
const deleteService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const userId = req.user.id;

  if (req.user.role !== "business") {
    throw new apiError(403, "Only business owners can delete services");
  }

  const business = await Business.findOne({ where: { userId } });
  if (!business) throw new apiError(404, "Business not found");

  const service = await Service.findOne({
    where: { id: serviceId, businessId: business.id },
  });

  if (!service) throw new apiError(404, "Service not found");

  await service.destroy();

  res.json(new apiResponse(200, "Service deleted"));
});




  const getSingleService = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { serviceId } = req.params;
  
    // Get business of logged-in user
    const business = await Business.findOne({ where: { userId } });
    if (!business) throw new apiError(404, "Business not found");
  
    // Fetch only service that belongs to this business
    const service = await Service.findOne({
      where: { id: serviceId, businessId: business.id },
    });
  
    if (!service) {
      throw new apiError(404, "Service not found");
    }
  
    res.json(new apiResponse(200, "Service fetched successfully", service));
  });
  
  

  const getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.findAll({
      include: [
        {
          model: Business,
          as: "business",
         // attributes: ["id", "name", "address", "city", "country", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  
    res.status(200).json(
      new apiResponse(200, "All services fetched successfully", services)
    );
  });




  // ---------------- GET SERVICES BY CATEGORY ID ----------------
const getServicesByCategoryId = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Validate category
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new apiError(404, "Category not found");
  }

  // Fetch services with category + payment methods
  const services = await Service.findAll({
    where: { categoryId },
    include: [
      { model: Category, as: "category" },
      {
        model: PaymentMethod,
        as: "paymentMethods",
        through: { attributes: [] } 
      }
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(
    new apiResponse(200, "Services fetched successfully", services)
  );
});


  

module.exports = {
    createService,
    getMyServices,
    updateService,
    deleteService,
    getSingleService,
    getAllServices,
    getServicesByCategoryId
};
