import { CitiesSuggestionJsonInput } from './../dto/citiesSuggestionJsonInput';
import { Request, Response } from 'express';
import { citiesSuggestionWithLatitudeAndLongitude } from '../services/citiesService';
import { citiesSuggestionWitoutLatitudeAndLongitude } from '../services/citiesService';

export async function citiesSuggestion(req: Request, res: Response) {
  try {
    const citiesSuggestionJsonInput: CitiesSuggestionJsonInput = req.query;
    if (
      citiesSuggestionJsonInput.latitude &&
      citiesSuggestionJsonInput.longitude
    ) {
      const suggestionsOutput = await citiesSuggestionWithLatitudeAndLongitude(
        citiesSuggestionJsonInput,
      );
      res.json(suggestionsOutput);
    } else {
      const suggestionsOutput =
        await citiesSuggestionWitoutLatitudeAndLongitude(
          citiesSuggestionJsonInput,
        );
      res.json(suggestionsOutput);
    }
  } catch (error) {
    res.status(500).json('An error occured' + error);
  }
}
