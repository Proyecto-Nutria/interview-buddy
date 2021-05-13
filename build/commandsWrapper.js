"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const help_1 = require("./CommandsImplementation/HelpCommand/help");
const subscribe_1 = require("./CommandsImplementation/SubscribeCommand/subscribe");
const buddy_1 = require("./CommandsImplementation/BuddyInterviewCommand/buddy");
exports.default = {
    help: help_1.default,
    subscribe: subscribe_1.default,
    buddy: buddy_1.default.getInstance().executeCommand
};
