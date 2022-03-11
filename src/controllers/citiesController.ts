import { Request, Response } from 'express';
import cities from '../models/cities'

export async function citiesSuggestion(req: Request, res: Response) {
    
    interface jsonOutputInterface {
        name: string,
        latitude: number,
        longitude: number,
        distance: number,

      }

    const arrayOutput: Array<jsonOutputInterface> = [];
    try {
        const { q, longitude, latitude, radius, sort } = req.query;
        const result = await cities.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                    distanceField: "dist.calculated",
                    maxDistance: Number(radius) * 1000,
                    query: { name: { "$regex": q, "$options": "i" } },
                    includeLocs: "dist.location",
                    spherical: true
                }
            }
        ]); 
        if (result.length > 0) {
            result.forEach((element) => {
                const jsonOutput:jsonOutputInterface={
                    name:`${element.name}, ${element.state}, ${element.country}`,
                    latitude:element.location.coordinates[1],
                    longitude :element.location.coordinates[0],
                    distance :element.dist.calculated/1000
                }
                arrayOutput.push(jsonOutput);
            });
            if (sort === 'name') {
                arrayOutput.sort((a: jsonOutputInterface, b: jsonOutputInterface) => {
                    const lowerCaseNameA = a.name.toLowerCase();
                    const lowerCaseNameB = b.name.toLowerCase();
                    if (lowerCaseNameA < lowerCaseNameB) {
                        return -1;
                    }
                    if (lowerCaseNameA > lowerCaseNameB) {
                        return 1;
                    }
                    return 0;
                })
            }
            if (sort === 'distance') {
                arrayOutput.sort((a: jsonOutputInterface, b: jsonOutputInterface) => {
                    b.distance - a.distance
                    return 0
                })
            }

            res.json(arrayOutput)
        }
        else {
            res.json([])
        }

    } catch (error) {
        res.status(500).json('An error occured' + error)
    }

}
