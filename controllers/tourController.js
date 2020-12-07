const fs = require('fs');
const APIFeatuers = require('./../utils/apiFeatuers');

const Tour = require('./../models/tourModel');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.aliasTopTours = req(res, req, next);
{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatuers(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.editTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, res.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      result: 'succcess',
      message: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed',
    });
  }
};
