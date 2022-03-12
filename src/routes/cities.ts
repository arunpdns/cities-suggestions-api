import { Router } from 'express';
import { citiesSuggestion } from '../controllers/citiesController';
import { citiesSuggestionValidator } from '../validations/citiesValidator';

const router = Router();

router.get('/suggestions', citiesSuggestionValidator, citiesSuggestion);

export default router;
