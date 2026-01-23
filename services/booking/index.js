const asyncHandler = require('../../utils/asycHandler');
const apiResponse = require('../../utils/apiResponse');
const apiError = require('../../utils/apiError');
const { STATUS_CODES } = require('../../config/constants');
const { User, Business, Service, Booking } = require('../../models');
const { sendBookingEmail } = require("../../utils/email");
const { sendPushNotification } = require("../../utils/sendPushNotification");


// ---------------------- CREATE BOOKING (USER ONLY) ----------------------
const createBooking = asyncHandler(async (req, res) => {
  const userId = req.user.id;


  // 🔐 CHECK ROLE
  if (req.user.role !== "user") {
    throw new apiError(STATUS_CODES.CONFLICT, "Only users can book services");
  }

  const { serviceId } = req.body;

  const service = await Service.findByPk(serviceId);
  if (!service)
    throw new apiError(STATUS_CODES.NOT_FOUND, "Service not found");

  const booking = await Booking.create({
    userId,
    businessId: service.businessId,
    serviceId: service.id,
    status: "pending"
  });

   // Fetch details for email
   const user = await User.findByPk(userId);
   const business = await Business.findByPk(service.businessId);
   const businessOwner = await User.findByPk(business.userId);
 
   // Send email to User
   await sendBookingEmail(user.email, booking, service, business, user);
 
   // Send email to Business Owner
   await sendBookingEmail(
     businessOwner.email,
     booking,
     service,
     business,
     user
   );


    // Send Push Notification to User
  await sendPushNotification(
    user.deviceToken,
    "Booking Confirmed",
    `Your booking for ${service.title} is confirmed!`,
    { bookingId: booking.id }
  );

  // Send Push Notification to Business Owner
  await sendPushNotification(
    businessOwner.deviceToken,
    "New Booking Received",
    `You have a new booking for ${service.title}`,
    { bookingId: booking.id }
  );

   

  res.status(201).json(
    new apiResponse(STATUS_CODES.CREATED, "Service booked successfully", booking)
  );
});


// ---------------------- USER BOOKINGS ----------------------
const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "user") {
    throw new apiError(STATUS_CODES.CONFLICT, "Only users can view user bookings");
  }

  const bookings = await Booking.findAll({
    where: { userId },
    include: [
      {
        model: Service,
        attributes: ["title", "price", "durationInMinutes", "images"]
      },
      {
        model: Business,
      //  attributes: ["name", "city", "country"]
      }
    ],
    order: [["createdAt", "DESC"]]
  });

  res.json(new apiResponse(200, "User bookings fetched", bookings));
});


// ---------------------- BUSINESS BOOKINGS ----------------------
const getBusinessBookings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "business") {
    throw new apiError(STATUS_CODES.CONFLICT, "Only business owners can view business bookings");
  }

  const business = await Business.findOne({ where: { userId } });
  if (!business) throw new apiError(404, "Business not found");

  const bookings = await Booking.findAll({
    where: { businessId: business.id },
    include: [
      { model: User,
        
        attributes: ["id", "name", "email", "phone"] },
      { model: Service, attributes: ["title", "price", "durationInMinutes"] }
    ],
    order: [["createdAt", "DESC"]]
  });

  res.json(new apiResponse(200, "Business bookings fetched", bookings));
});


// ---------------------- UPDATE BOOKING STATUS (BUSINESS ONLY) ----------------------
const updateBookingStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== "business") {
    throw new apiError(STATUS_CODES.CONFLICT, "Only business owners can update booking status");
  }

  const { bookingId } = req.params;
  const { status } = req.body;

  const allowed = ["pending", "in-progress", "completed", "cancelled"];
  if (!allowed.includes(status))
    throw new apiError(STATUS_CODES.CONFLICT, "Invalid status");

  const business = await Business.findOne({ where: { userId } });
  if (!business) throw new apiError(STATUS_CODES.CONFLICT, "Business not found");

  const booking = await Booking.findOne({
    where: { id: bookingId, businessId: business.id },
  });

  if (!booking) throw new apiError(STATUS_CODES.CONFLICT, "Booking not found");

  await booking.update({ status });

  res.json(new apiResponse(200, "Booking status updated", booking));
});



// ---------------------- ADMIN GET ALL BOOKINGS ----------------------
const getAllBookings = asyncHandler(async (req, res) => {

    // 🔐 CHECK ROLE
    if (req.user.role !== "admin") {
      throw new apiError(403, "Only admin can access all bookings");
    }
  
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phone"]
        },
        {
          model: Business,
        //  attributes: ["id", "name", "city", "country"]
        },
        {
          model: Service,
          attributes: ["id", "title", "price", "durationInMinutes"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });
  
    res.json(new apiResponse(STATUS_CODES.SUCCESS, "All bookings fetched", bookings));
  });



  // ---------------------- GET BOOKING BY ID (ALL ROLES) ----------------------
const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;   // bookingId
  const user = req.user;

  // 1️⃣ Fetch booking with relations
  const booking = await Booking.findOne({
    where: { id },
    include: [
      { model: User, attributes: ["id", "name", "email", "phone"] },
   //   { model: Business, attributes: ["id", "name", "city", "country", "userId"] }, 
      { model: Service, attributes: ["id", "title", "price", "durationInMinutes"] }
    ]
  });

  if (!booking) throw new apiError(STATUS_CODES.CONFLICT, "Booking not found");

  // 2️⃣ ROLE PERMISSIONS
  if (user.role === "admin") {
    // Admin can access any booking
    return res.json(new apiResponse(STATUS_CODES.SUCCESS, "Booking fetched", booking));
  }

  if (user.role === "user") {
    // User can only see their own bookings
    if (booking.userId !== user.id) {
      throw new apiError(STATUS_CODES.CONFLICT, "You are not allowed to view this booking");
    }
    return res.json(new apiResponse(200, "Booking fetched", booking));
  }

  if (user.role === "business") {
    // Business owner can only see bookings of their business
    const business = await Business.findOne({ where: { userId: user.id } });

    if (!business) throw new apiError(STATUS_CODES.CONFLICT, "Business not found");

    if (booking.businessId !== business.id) {
      throw new apiError(403, "You are not allowed to view this booking");
    }

    return res.json(new apiResponse(200, "Booking fetched", booking));
  }

  throw new apiError(403, "Invalid role");
});

  

module.exports = {
  createBooking,
  getMyBookings,
  getBusinessBookings,
  updateBookingStatus,
  getAllBookings,
  getBookingById
};
