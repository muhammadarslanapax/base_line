const router = require("express").Router();
const bookingServices = require("../../services/booking/index");



router.post('/booking' , bookingServices.createBooking);


router.get('/my-bookings' , bookingServices.getMyBookings);

router.get('/business/bookings' , bookingServices.getBusinessBookings);

router.patch('/booking/:bookingId/status' , bookingServices.updateBookingStatus);

router.get("/admin/bookings", bookingServices. getAllBookings);
router.get("/booking/:id", bookingServices. getBookingById);


module.exports = router;

