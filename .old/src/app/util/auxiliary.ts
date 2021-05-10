import { DiscordMessageType } from './../messages';
import Environment from './../../environment';
import Constants from './../../constants';
import Canvas from 'canvas';
import path from 'path';
import fs from 'fs';
import Logger from './logger';

export function isValidEmail(email: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function isAdmin(message: DiscordMessageType) {
  return message.member?.roles.cache.find(r => r.name === Environment.AdminRole);
}

export function isValidChannel(message: string) {
  const re = /\<\#\d+\>/;
  return re.test(message);
}

export const errorCommandText = (commandPrefix: string): string => {
  return `Wrong use of command, `
  + `type ${Constants.Prefix}${commandPrefix} help to know how to use it.`;
};

export function createMatchImage(pairs: Array<{otterOne: string, otterTwo: string}>) {
  const numberOfLines = pairs.length;
  const maxWidth = 400, cellHeight = 40;
  let x = 0, y = 0;
  
  const canvas = Canvas.createCanvas(maxWidth * 2 + 20, cellHeight * numberOfLines);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, canvas.width,  canvas.height);

  ctx.lineWidth = .5;
  ctx.font = '20px serif';
  ctx.fillStyle = "black";

  pairs.forEach(pair => {
      let line = pair.otterOne; 
      let lineMesures = ctx.measureText(line);
      ctx.fillText(line, 10 + x, y + 30);
      ctx.strokeRect(x, y, lineMesures.width + (maxWidth - lineMesures.width + 10), cellHeight);
      x = lineMesures.width + (maxWidth - lineMesures.width + 10);
      line = pair.otterTwo; 
      lineMesures = ctx.measureText(line);
      ctx.fillText(line, 10 + x, 30 + y);
      ctx.strokeRect(x, y, lineMesures.width + (maxWidth - lineMesures.width + 10), cellHeight);
      x = 0, y += cellHeight;
  });
  return canvas.createPNGStream().pipe(fs.createWriteStream(path.join(__dirname + '/img', 'weekPairs.png')));
}
