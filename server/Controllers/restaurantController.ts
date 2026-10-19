import { Request, Response } from "express";
import { Restaurant } from "../model/Restaurant.js";

/// Get All Restaurant with Search and Filter
/// GET/ api/ restaurant
export const GetRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, priceRange, rating, location, sort } = req.body;

    const queryObj: any = { status: "approved" };

    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (priceRange) {
      const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
      queryObj.priceRange = { $in: prices };
    }

    if (rating) {
      queryObj.rating = { $gte: parseFloat(rating as string) };
    }

    if (location) {
      queryObj.location = { $regex: location as string, $options: "i" };
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "price_low") {
      sortOption = { priceRange: 1 };
    } else if (sort === "price_high") {
      sortOption = { priceRange: -1 };
    }

    const restaurants = await Restaurant.find(queryObj).sort(sortOption);
    res.json(restaurants);

  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

/// Get Featured and Excusive Restaurant
/// GET/ api/restaurant/Featured
export const GetFeaturedRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {

  try {

    const Featured = await Restaurant.find({
        status:'approved',
        $or:[{featured:true}, {exclusive:true}]
    }).limit(6)

    res.json(Featured)

  } catch (error: any) {
    console.error('Get featured Restaurant Error',error);
    res.status(400).json({ message: 'server Error' });
  }
};

/// Get single Restaurant by slug
/// GET/ api/restaurant/:slug
export const GetRestaurantsByslug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {


  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

/// Get dynamic seat availability for slots
/// GET/ api/restaurant/:id/availability
export const GetRestaurantAvailability = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {


  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
