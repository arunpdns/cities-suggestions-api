import { CitiesSuggestionJsonInput } from './../dto/citiesSuggestionJsonInput';
import { CitiesSuggestionJsonOutput } from './../dto/citiesSuggestionJsonOutput';
import City from '../models/cities';

export async function citiesSuggestion(data: CitiesSuggestionJsonInput) {
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
  const arrayOutput: Array<CitiesSuggestionJsonOutput> = result.map(
    (element) => {
      const jsonOutput: CitiesSuggestionJsonOutput = {
        name: `${element.name}, ${element.state}, ${element.country}`,
        latitude: element.location.coordinates[1],
        longitude: element.location.coordinates[0],
        distance: element.distance / 1000,
      };
      return jsonOutput;
    },
  );
  return arrayOutput;
}
