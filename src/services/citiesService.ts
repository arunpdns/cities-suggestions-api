import { CitiesSuggestionJsonInput } from './../dto/citiesSuggestionJsonInput';
import { CitiesSuggestionJsonOutput } from './../dto/citiesSuggestionJsonOutput';
import { CitiesSuggestionJsonOutputWithoutDistance } from './../dto/citiesSuggestionJsonOutputWithoutDistance';
import City from '../models/cities';

export async function citiesSuggestionWithLatitudeAndLongitude(
  data: CitiesSuggestionJsonInput,
) {
  const { q, longitude, latitude, radius, sort }: CitiesSuggestionJsonInput =
    data;
  const result = await City.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [Number(longitude), Number(latitude)],
        },
        distanceField: 'distance',
        maxDistance: Number(radius) * 1000,
        query: { name: { $regex: q, $options: 'i' } },
        includeLocs: 'dist.location',
        spherical: true,
      },
    },
    {
      $sort: {
        [sort]: 1,
      },
    },
  ]);
  const suggestionsArray: Array<CitiesSuggestionJsonOutput> = result.map(
    (element) => {
      const suggestionsObject: CitiesSuggestionJsonOutput = {
        name: `${element.name}, ${element.state}, ${element.country}`,
        latitude: element.location.coordinates[1],
        longitude: element.location.coordinates[0],
        distance: element.distance / 1000,
      };
      return suggestionsObject;
    },
  );
  const suggestionsOutput = { suggestions: suggestionsArray };
  return suggestionsOutput;
}

export async function citiesSuggestionWitoutLatitudeAndLongitude(
  data: CitiesSuggestionJsonInput,
) {
  const { q, sort }: CitiesSuggestionJsonInput = data;
  const result = await City.find({ name: { $regex: q, $options: 'i' } }).sort({
    [sort]: 1,
  });
  const suggestionsArray: Array<CitiesSuggestionJsonOutputWithoutDistance> =
    result.map((element) => {
      const suggestionsObject: CitiesSuggestionJsonOutputWithoutDistance = {
        name: `${element.name}, ${element.state}, ${element.country}`,
        latitude: element.location.coordinates[1],
        longitude: element.location.coordinates[0],
      };
      return suggestionsObject;
    });
  const suggestionsOutput = { suggestions: suggestionsArray };
  return suggestionsOutput;
}
