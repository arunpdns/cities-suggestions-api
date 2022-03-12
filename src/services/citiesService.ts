import { CitiesSuggestionJsonInput } from './../dto/citiesSuggestionJsonInput';
import City from '../models/cities';

export async function citiesSuggestionWithLatitudeAndLongitude(
  data: CitiesSuggestionJsonInput,
) {
  const { q, longitude, latitude, radius, sort }: CitiesSuggestionJsonInput =
    data;
  const suggestionOutput = await City.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)],
        },
        distanceField: 'dist.calculated',
        maxDistance: radius * 1000,
        query: { name: new RegExp(q, 'i') },
        includeLocs: 'dist.location',
        spherical: true,
      },
    },
    {
      $addFields: { distance: { $divide: ['$dist.calculated', 1000] } },
    },
    {
      $addFields: {
        latitude: { $toDouble: { $arrayElemAt: ['$location.coordinates', 1] } },
      },
    },
    {
      $addFields: {
        longitude: {
          $toDouble: { $arrayElemAt: ['$location.coordinates', 0] },
        },
      },
    },
    {
      $addFields: {
        name: {
          $concat: ['$name', ',', '$state', ',', '$country'],
        },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        latitude: 1,
        longitude: 1,
        distance: 1,
      },
    },
    {
      $sort: { [sort]: 1 },
    },
  ]);
  const suggestionsFinalOutput = { suggestions: suggestionOutput };
  return suggestionsFinalOutput;
}

export async function citiesSuggestionWitoutLatitudeAndLongitude(
  data: CitiesSuggestionJsonInput,
) {
  const { q, sort }: CitiesSuggestionJsonInput = data;
  const suggestionOutput = await City.aggregate([
    {
      $addFields: {
        latitude: { $toDouble: { $arrayElemAt: ['$location.coordinates', 1] } },
      },
    },
    {
      $addFields: {
        longitude: {
          $toDouble: { $arrayElemAt: ['$location.coordinates', 0] },
        },
      },
    },
    {
      $addFields: {
        name: {
          $concat: ['$name', ',', '$state', ',', '$country'],
        },
      },
    },
    {
      $match: {
        name: new RegExp(q, 'i'),
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        latitude: 1,
        longitude: 1,
      },
    },
    {
      $sort: { [sort]: 1 },
    },
  ]);

  const suggestionsFinalOutput = { suggestions: suggestionOutput };
  return suggestionsFinalOutput;
}
