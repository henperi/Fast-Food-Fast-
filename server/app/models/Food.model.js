// import moment from 'moment';
import randomId from 'uuid';
import db from './Query.model';

class Food {
  /**
   * class constructor
   */
  constructor() {
    this.foods = db;
  }

  async createFood(data) {
    const queryText = `INSERT INTO foods(food_id, food_name, food_cat, food_img,
      description, unit_price, quantity_available, created_at, updated_at)
      Values($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning *`;

    const values = [
      randomId.v4(),
      data.foodName,
      data.foodCat,
      data.foodImg,
      data.description,
      data.unitPrice,
      data.quantityAvailable,
      new Date(),
      new Date(),
    ];

    try {
      const { rows } = await this.foods.query(queryText, values);

      const newFood = {
        foodId: rows[0].food_id,
        foodName: rows[0].food_name,
        foodCat: rows[0].food_cat,
        foodImg: rows[0].food_img,
        description: rows[0].description,
        unitPrice: rows[0].unit_price,
        quantityAvailable: rows[0].quantity_available,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at,
      };

      const response = { success: true, newFood };
      return response;
    } catch (err) {
      // console.log('err:', err);
      const response = { success: false, err };
      return response;
    }
  }

  /**
   * @param {request.params.foodId} foodId
   * @returns {object} food object
   */
  async findOne(foodId) {
    const queryText = 'SELECT * from foods WHERE food_id = $1';
    try {
      const { rows } = await this.foods.query(queryText, [foodId]);
      const response = { success: true, rows: rows[0] };
      return response;
    } catch (error) {
      const response = { success: false, error };
      return response;
    }
  }

  /**
   * @param {String} foodName
   * @returns {object} food object
   */
  async findByName(foodName) {
    const queryText = 'SELECT * from foods WHERE food_name = $1';
    try {
      const { rows } = await this.foods.query(queryText, [foodName]);
      const response = { success: true, rows: rows[0] };
      return response;
    } catch (error) {
      const response = { success: false, error };
      return response;
    }
  }

  /**
   * Find All foods
   * @param null
   * @returns {object:} All foods stored in the database
   */
  async findAll(req, res) {
    const queryText = 'SELECT * from foods';
    try {
      const { rows } = await this.foods.query(queryText);
      return rows;
    } catch (err) {
      return res.status(500).send({
        success: false,
        errors: [{ msg: 'An error occured, try again later' }],
      });
    }
  }
}

export default new Food();
