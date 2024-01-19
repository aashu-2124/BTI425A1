const mongoose = require("mongoose");
const listingSchema = require("./listingSchema");

module.exports = class ListingsDB {
  constructor() {
    // We don't have a `Listing` object until initialize() is complete
    this.Listing = null;
  }

  // Pass the connection string to `initialize()`
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(connectionString);

      db.once('error', (err) => {
        reject(err);
      });
      db.once('open', () => {
        this.Listing = db.model("listing", listingSchema);
        resolve();
      });
    });
  }

  async addNewListing(data) {
    try {
      const newListing = new this.Listing(data);
      await newListing.save();
      return newListing;
    } catch (error) {
      throw error;
    }
  }

  async getAllListings(page, perPage, name) {
    try {
      let findBy = name ? { "name": { "$regex": name, "$options": "i" } } : {};

      if (+page && +perPage) {
        return await this.Listing.find(findBy, { reviews: 0 })
          .sort({ number_of_reviews: -1 })
          .skip((page - 1) * +perPage)
          .limit(+perPage)
          .exec();
      } else {
        throw new Error('page and perPage query parameters must be valid numbers');
      }
    } catch (error) {
      throw error;
    }
  }

  async getListingById(id) {
    try {
      return await this.Listing.findOne({ _id: id }).exec();
    } catch (error) {
      throw error;
    }
  }

  async updateListingById(data, id) {
    try {
      return await this.Listing.updateOne({ _id: id }, { $set: data }).exec();
    } catch (error) {
      throw error;
    }
  }

  async deleteListingById(id) {
    try {
      return await this.Listing.deleteOne({ _id: id }).exec();
    } catch (error) {
      throw error;
    }
  }
};
