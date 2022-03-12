import { CitiesSuggestionJsonInput } from './../dto/citiesSuggestionJsonInput';
import { Request, Response } from 'express';
import { citiesSuggestion as citiesSuggestionService } from '../services/citiesService';

export async function citiesSuggestion(req: Request, res: Response) {
  try {
    const citiesSuggestionJsonInput: CitiesSuggestionJsonInput = req.query;
    const arrayOutput = await citiesSuggestionService(
      citiesSuggestionJsonInput,
    );
    res.json(arrayOutput);
  } catch (error) {
    res.status(500).json('An error occured' + error);
  }
}
