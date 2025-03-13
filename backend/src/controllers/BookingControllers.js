import prisma from "../config/db.config.js";

export const createBooking = async (req, res) => {
  const userId = req.user.id;

  const { providerId, serviceId, scheduledDate, bookingStatus, paymentStatus } =
    req.body;

  if (!userId || !serviceId) {
    return res.status(400).json({
      error: "Missing required fields or unauthorized access..",
    });
  }

  if (providerId) {
    const existingBooking = await prisma.booking.findMany({
      where: {
        userId: Number(userId),
        serviceId: Number(serviceId),
        providerId: Number(providerId),
        bookingStatus: "pending",
      },
    });

    if (existingBooking.length > 0) {
      return res.status(400).json({
        error:
          "You already have a pending booking for this service with this provider",
      });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { providers: true },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    console.log(service);

    try {
      const booking = await prisma.booking.create({
        data: {
          userId: Number(userId),
          providerId: Number(providerId),
          serviceId: Number(serviceId),
          scheduledDate,
          bookingStatus,
          paymentStatus,
        },
      });
      res.status(200).json({
        message:
          "Booking created, and selected provider is notified about your booking...",
        booking,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: error.message,
      });
    }
  } else {
    const existingBooking = await prisma.booking.findMany({
      where: {
        userId: Number(userId),
        serviceId: Number(serviceId),
        scheduledDate,
        bookingStatus: "pending",
      },
    });

    if (existingBooking.length > 0) {
      return res.status(400).json({
        error: "You already have a pending booking for this service.",
      });
    }

    try {
      const booking = await prisma.booking.create({
        data: {
          userId: Number(userId),
          serviceId: Number(serviceId),
          bookingStatus,
          paymentStatus,
        },
      });

      return res.status(200).json({
        message:
          "Immediate booking created, and available nearby service providers are notified about your booking...",
        booking,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: error.message,
      });
    }
  }
};

export const getBookings = async (req, res) => {
  const {
    serviceId,
    providerId,
    bookingId,
    bookingStatus,
    minAmount,
    maxAmount,
    minRating,
    maxRating,
    bookingAfter,
    bookingBefore,
  } = req.query;
  console.log(serviceId, providerId, bookingId, bookingStatus);

  const filter = [];

  if (serviceId) filter.push({ serviceId: parseInt(serviceId) });
  if (providerId) filter.push({ providerId: parseInt(providerId) });
  if (bookingId) filter.push({ id: parseInt(bookingId) });
  if (bookingStatus) filter.push({ bookingStatus: bookingStatus });
  if (minAmount) filter.push({ amount: { gte: parseFloat(minAmount) } });
  if (maxAmount) filter.push({ amount: { lte: parseFloat(maxAmount) } });
  if (minRating) filter.push({ rating: { gte: parseInt(minRating) } });
  if (maxRating) filter.push({ rating: { lte: parseInt(maxRating) } });
  if (bookingAfter) filter.push({ createdAt: { gte: new Date(bookingAfter) } });
  if (bookingBefore)
    filter.push({ createdAt: { lte: new Date(bookingBefore) } });

  try {
    const bookings = await prisma.booking.findMany({
      where: { AND: filter },
      // include: { user: true, service: true },
    });
    return res.json(bookings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.role == "user") {
    const { scheduledDate, bookingStatus, paymentStatus, amount, rating } =
      req.body;

    try {
      const booking = await prisma.booking.update({
        where: { id },
        data: {
          scheduledDate,
          bookingStatus,
          paymentStatus,
          amount: parseFloat(amount),
          rating: parseInt(rating),
        },
      });
      return res.status(200).json({ message: "Booking updated", booking });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  } else if (req.user.role == "provider") {
    const { bookingStatus, paymentStatus, amount } = req.body;
    try {
      const booking = await prisma.booking.update({
        where: { id },
        data: {
          bookingStatus,
          paymentStatus,
          amount: parseFloat(amount),
        },
      });
      return res.status(200).json({ message: "Booking updated", booking });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  }
};

export const deleteBooking = async (req, res) => {
  const id = parseInt(req.params.id);

  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  try {
    const booking = await prisma.booking.delete({ where: { id } });
    return res.status(200).json({ message: "Booking deleted", booking });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

export const onlineProviders = async (req, res) => {};
