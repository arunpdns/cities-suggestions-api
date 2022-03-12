# Cities suggestion api

Returns city suggestions based on user request.

## Assumptions

1. If latitude or longitude is not provided in the request query, the result will not contain distance.
2. If latitude or longitude is not provided in the request query, sort can only have the value name.
3. A default radius of 10km will be assumed, if radius is not provided in the request query.

## Installation

Use npm to install the packages.

```bash
npm install
```

To build the code, use

```bash
npm run build
```

To test the code, use

```bash
npm run test
```

To start the development server, use

```bash
npm start:dev
```

To start the server, use

```bash
npm start
```

## API Reference

#### Get city suggestions

```http
  GET /api/cities/suggestions
```

| Query Parameter | Type     | Description                                        |
| :-------------- | :------- | :------------------------------------------------- |
| q               | `string` | **Required**. The string to be searched against    |
| latitude        | `number` | Input latitude                                     |
| longitude       | `number` | Input longitude                                    |
| radius          | `number` | Max distance from the input latitude and longitude |
| sort            | `string` | Takes the values name and distance                 |

#### Sample request

```http
/api/cities/suggestions?q=lon&latitude=40.79672&radius=500&sort=name
```

#### Sample response

```http
 {
    "suggestions": [
        {
            "name": "Colonial Heights, TN, US",
            "latitude": 36.4851,
            "longitude": -82.5032,
            "distance": 487.4849492442173
        },
        {
            "name": "Colonial Park, PA, US",
            "latitude": 40.30064,
            "longitude": -76.80969,
            "distance": 402.310932730492
        }
    ]}
```

#### Sample request

```http
/api/cities/suggestions?q=lon&sort=name
```

#### Sample response

```http
 {
    "suggestions": [
        {
            "name": "Alondra Park, CA, US",
            "latitude": 33.88946,
            "longitude": -118.33091
        },
        {
            "name": "Babylon, NY, US",
            "latitude": 40.69566,
            "longitude": -73.32568
        }
    ]}
```

#### Sample request

```http
/api/cities/suggestions?q=xxx&latitude=40.79672&radius=500&sort=name
```

#### Sample response

```http
 {
    "suggestions": []
    }
```

#### Sample request

```http
/api/cities/suggestions?latitude=40.79672&radius=500&sort=name
```

#### Sample response

```http
 {
    "message": "Failed to validate input \"q\" is required"
}
```

#### Sample request

```http
/api/cities/suggestions?q=lon&latitude=test&longitude=-81.52151&radius=500&sort=name
```

#### Sample response

```http
 {
    "message": "Failed to validate input \"latitude\" must be a number"
}
```

#### Sample request

```http
/api/cities/suggestions?q=lon&latitude=79.123&longitude=test&radius=500&sort=name
```

#### Sample response

```http
 {
    "message": "Failed to validate input \"longitude\" must be a number"
}
```

#### Sample request

```http
/api/cities/suggestions?q=lon&latitude=79.123&longitude=-80.33&radius=rad&sort=name
```

#### Sample response

```http
 {
    "message": "Failed to validate input \"radius\" must be a number"
}
```

#### Sample request

```http
/api/cities/suggestions?q=lon&latitude=79.123&longitude=-80.33&radius=500&sort=sort
```

#### Sample response

```http
 {
    "message": "Failed to validate input \"sort\" must be one of [name, distance]"
}
```
