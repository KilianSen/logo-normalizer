# MadeIn
A simple component to display the "Made in" label with a flag icon and a few other details.

_**Join the movement of showcasing your pride in your region with this component!**_

## Features
- Displays the "Made in" label with a flag icon.
- Display EU flag if the country is part of the European Union.
- Add made with love icon.
- Automatic translation of the label based on the user's language.

## Variants
| Example 1 | Example 2 | Example 3 |
|-----------|-----------|-----------|
| ![Example 1](https://via.placeholder.com/150) | ![Example 2](https://via.placeholder.com/150) | ![Example 3](https://via.placeholder.com/150) |

## Usage
### Install the package
```bash
npm install @your-org/made-in
```
### Using the component
```typescript jsx
import { MadeIn } from '@your-org/made-in';

const App = () => {
  return (
    <div className={"absolute bottom-0 right-0 p-4"}>
      <MadeIn country="FR" showHeart showEU/>
    </div>
  );
};
```

## Motivation
Some time ago, I came across a similar component on the web, but it slipped my mind. 
Recently, I recalled it and thought it would be a great addition to my projects to showcase **unity** and pride for my region.
Sadly, I couldn't find the original component, so I decided to create my own version.