const router = require('express').Router();
const Plants = require('./plantsModel.js');
const jwt_decode = require('jwt-decode');

router.get('/', async (req, res, next) => {
  try {
    const plantData = await Plants.find();
    res.status(200).json(plantData);
  } catch (err) {
    next(err);
  };
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const plantData = await Plants.findBy(id);
    res.status(200).json(plantData);
  } catch (err) {
    next(err);
  };
});

router.post('/newPlant', async (req, res, next) => {
  console.log(req.header.subject)
  const token = req.header('authorization');
  const decodedToken = jwt_decode(token);
  console.log(decodedToken)

  const plantData = req.body;
  plantData.userId = decodedToken.subject;
  console.log(plantData)
  try {
    const newPlant = await Plants.addPlant(plantData);
    res.status(201).json(newPlant);
  } catch (err) {
    next(err);
  };
});

router.put('/editPlant/:id', async (req, res, next) => {
  const { id } = req.params;
  const updatedPlant = req.body;

  try {
    const plantData = await Plants.updatePlant(id, updatedPlant);
    if (plantData) {
      res.status(204).json(plantData)
    } else {
      res.status(404).json({ message: 'Plant not found' });
    };
  } catch (err) {
    next(err);
  };
});

router.delete('/deletePlant/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const count = await Plants.deletePlant(id);
    if (count) {
      res.status(200).json('Plant deleted');
    } else {
      res.status(404).json({ message: 'Plant not found' });
    };
  } catch (err) {
    next(err);
  };
});

module.exports = router;
