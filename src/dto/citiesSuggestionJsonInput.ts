export class CitiesSuggestionJsonInput {
  q: string;
  longitude: number;
  latitude: number;
  radius: number;
  order: 'asc' | 'desc';
  sort: string;
}
