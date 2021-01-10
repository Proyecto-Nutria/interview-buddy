const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');
/**
 * Makes an image of pairs
 * @function
 * @param {Array} pairs
 */
module.exports = pairs => {
    let numberOfLines = pairs.length;
    let x = 0, y = 0, maxWidth = 400, cellHeight = 40;
    
    let canvas = Canvas.createCanvas(maxWidth * 2 + 20, cellHeight * numberOfLines);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width,  canvas.height);

    ctx.lineWidth = .5;
    ctx.font = '20px serif';
    ctx.fillStyle = "black";

    pairs.forEach(pair => {
        let line = pair.otterOne.name + '#' + pair.otterOne.discriminator; 
        let lineMesures = ctx.measureText(line);
        ctx.fillText(line, 10 + x, y + 30);
        ctx.strokeRect(x, y, lineMesures.width + (maxWidth - lineMesures.width + 10), cellHeight);
        x = lineMesures.width + (maxWidth - lineMesures.width + 10);
        line = pair.otterTwo.name + '#' + pair.otterTwo.discriminator; 
        lineMesures = ctx.measureText(line);
        ctx.fillText(line, 10 + x, 30 + y);
        ctx.strokeRect(x, y, lineMesures.width + (maxWidth - lineMesures.width + 10), cellHeight);
        x = 0, y += cellHeight;
    });
    return canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname, 'weekPairs.png')))
}

/*line([
    {
        otterOne:{
            name: 'Andresrodart',
            discriminator: '1235'
        },
        otterTwo:{
            name: 'Andresrodart',
            discriminator: '1235'
        }
    },
    {
        otterOne:{
            name: 'Andresrodart',
            discriminator: '1235'
        },
        otterTwo:{
            name: 'Andresrodart',
            discriminator: '1235'
        }
    },
    {
        otterOne:{
            name: 'Andresrodart',
            discriminator: '1235'
        },
        otterTwo:{
            name: 'Andresrodart',
            discriminator: '1235'
        }
    },
    {
        otterOne:{
            name: 'Andresrodart',
            discriminator: '1235'
        },
        otterTwo:{
            name: 'Andresrodart',
            discriminator: '1235'
        }
    }
]);*/