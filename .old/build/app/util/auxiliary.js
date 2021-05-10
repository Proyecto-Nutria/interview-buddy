"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMatchImage = exports.errorCommandText = exports.isValidChannel = exports.isAdmin = exports.isValidEmail = void 0;
const environment_1 = __importDefault(require("./../../environment"));
const constants_1 = __importDefault(require("./../../constants"));
const canvas_1 = __importDefault(require("canvas"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
exports.isValidEmail = isValidEmail;
function isAdmin(message) {
    return message.member?.roles.cache.find(r => r.name === environment_1.default.AdminRole);
}
exports.isAdmin = isAdmin;
function isValidChannel(message) {
    const re = /\<\#\d+\>/;
    return re.test(message);
}
exports.isValidChannel = isValidChannel;
const errorCommandText = (commandPrefix) => {
    return `Wrong use of command, `
        + `type ${constants_1.default.Prefix}${commandPrefix} help to know how to use it.`;
};
exports.errorCommandText = errorCommandText;
function createMatchImage(pairs) {
    const numberOfLines = pairs.length;
    const maxWidth = 400, cellHeight = 40;
    let x = 0, y = 0;
    const canvas = canvas_1.default.createCanvas(maxWidth * 2 + 20, cellHeight * numberOfLines);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
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
    return canvas.createPNGStream().pipe(fs_1.default.createWriteStream(path_1.default.join(__dirname + '/img', 'weekPairs.png')));
}
exports.createMatchImage = createMatchImage;
