// controllers/auth.js

const jwt = require("jsonwebtoken");
const operatorService = require("../service/operators");
const foService = require("../service/fos");
const config = require("../../config");
const upload = require("../middleware/multer");
const validation = require("../middleware/validation");

module.exports = {
  async registerOperator(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const operatorId = decodedToken.userId;
    const role = decodedToken.role;
    const states = await operatorService.getAllStates();
    const lgas = await operatorService.getLgas();

    const stateNames = states.map(state => state.name);
    const lgaNames = lgas.map(lga => lga.name);

    const { error, value } = validation.registerOperatorSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      nationality,
      state,
      lga,
      sex,
      dob,
      nin,
    } = value;

    // Check if the selected LGA belongs to the selected state

    try {
      if (role !== "operator") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!stateNames.includes(state)) {
        return res.status(400).json({
          message: "Selected state not a Nigerian state!"
        });
      }

      const stateId = await operatorService.getStateIdByName(state);

      if (!lgaNames.includes(lga)) {
        return res.status(400).json({
          message: "Selected local government not in Nigeria!"
        });
      }

      const lgaInfo = await operatorService.getLga(lga);

      const stateIdInput = lgaInfo.state_id;

      if (parseInt(stateId.id) !== parseInt(stateIdInput)) {
        return res.status(400).json({
          message: "Selected LGA does not belong to the selected state"
        })}


      const operator = await operatorService.registerOperator(
        operatorId,
        firstName,
        lastName,
        phoneNumber,
        nationality,
        stateIdInput,
        lgaInfo.id,
        sex,
        dob,
        nin
      );
      res
        .status(200)
        .json(
          `operator ${operatorId} registered successfully, an email will be sent upon verification`
        );
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async selectProduct(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const operatorId = decodedToken.userId;
    const role = decodedToken.role;
    const verified = parseInt(decodedToken.isVerified);
    const products = await operatorService.getAllProducts();
    const seedTypes = await operatorService.getSeedTypes();

    const productNames = products.map(product => product.name);
    const seedTypeNames = seedTypes.map(seedType => seedType.name);


    const { error, value } = validation.selectProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { product, seedType } = value;

    try {
      if (role !== "operator") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (verified === 0) {
        return res
          .status(401)
          .json({ message: "Request verification from admin to progress!" });
      }

      if (!productNames.includes(product)) {
        return res.status(400).json({
          message: "Selected product not available at this time. Check back later!"
        });
      }

      const productId = await operatorService.getProductIdByName(product);

      if (!seedTypeNames.includes(seedType)) {
        return res.status(400).json({
          message: "Selected seed type not available at this time. Check back later!"
        });
      }

      const seedTypeInfo = await operatorService.getSeedType(seedType);

      const productIdInput = seedTypeInfo.product_id;

      if (parseInt(productId.id) !== parseInt(productIdInput)) {
        return res.status(400).json({
          message: "Selected seed type does not belong to the selected product"
        })
      }

      const productAdd = await operatorService.selectProduct(
        product,
        seedType,
        operatorId
      );

      res.status(200).json({
        message: `Product ${product} with seed type ${seedType} has been slsected for operator ${operatorId}, further directions will be sent via email`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async recruitFO(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const operatorId = decodedToken.userId;
    const role = decodedToken.role;
    const verified = parseInt(decodedToken.isVerified);
    const foId = req.params.foId;
    const fos = foService.getAllFOs;
    const foIds = fos.map((fo) => fo.id);

    try {
      if (role !== "operator") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (verified === 0) {
        return res
          .status(401)
          .json({ message: "Request verification from admin to progress!" });
      }

      if (!foIds.includes(parseInt(foId))) {
        return res
          .status(401)
          .json({ message: `Field Officer ${foId} does not exist` });
      }

      const result = await operatorService.recruitFO(operatorId, foId);
      res.json({
        message: `Field Officer ${foId} recruited successfully by operator ${operatorId}`,
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getFOsByOperatorId(req, res) {
    const { operatorId } = req.params.operatorId;
    try {
      const result = await operatorService.getFOsByOperatorId(operatorId);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async addPicture(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const operatorId = decodedToken.userId;
    const role = decodedToken.role;

    try {
      if (role !== "operator") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Use multer to get the picture from the request
      upload.single("picture")(req, res, async function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }

        // Get the picture file from the request object
        const picture = req.file;

        const filename = picture.originalname;

        // Call the service to add the picture
        const operator = await operatorService.addPicture(filename, operatorId);
        res
          .status(200)
          .json({
            message: `operator ${operatorId} picture added successfully, an email will be sent upon verification`,
          });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({message: "Internal server error"});
    }
  },
};
