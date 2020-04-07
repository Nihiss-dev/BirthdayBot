require('dotenv').config();

'use strict';

var infos = function() {
	this.channel = "";
	this.birthdays = [];
}

const info = new infos();

const Discord = require('discord.js');
const client = new Discord.Client();

/* CSV */
const fs = require('fs');

function load()
{
	console.log('loading file');
	var contents = fs.readFileSync("data.json");
	var jsonContent =  JSON.parse(contents);
	console.log("channel: ", jsonContent.channel);
	info.channel = jsonContent.channel;
	console.log("birthdays: ", jsonContent.birthdays);
	info.birthdays = jsonContent.birthdays;
}

function write()
{
	console.log(JSON.stringify(info));
	var infoString = JSON.stringify(info);
	fs.writeFileSync("data.json", infoString);
}

// !add
function add(msg, args)
{
	var birthday = {name: args[0], date: args[1]};
	info.birthdays.push(birthday);
	write();
}

// !remove
function remove(msg, args)
{
	for (var i = 0; i < info.birthdays.length; i++)
	{
		if (info.birthdays[i].name == args)
		{
			info.birthdays.splice(i,1);
		}
	}
	write();
}

// !clear
function clear(msg)
{
}

// !list
function list(msg)
{
	info.birthdays.forEach(function(birthday) {
		msg.channel.send('name: ' + birthday.name + ' date: ' + birthday.date);
	});
}

// !setChannel
function setChannel(msg, args)
{
	info.channel = args;
	write();
}

// !reload
function reload(msg)
{
	clear(msg);
	load();
}

// !help
function help(msg)
{
	msg.channel.send("List of commands:\n-`!add <Username> <Date DD-MM-YYYY>`: add this user in the birthdays list\n"+
	"-`!remove <Username>`: remove this user from birthdays list\n"+
	"-`!list`: show all users in list with their birthday date\n"+
	"-`!setChannel <ChannelName>`: set the channel where the bot will wish birthday\n"+
	"-`!help`: display this help");
}

function sendMessageTo(username)
{
	var channelId;
	client.channels.cache.forEach(function(channel) {
		console.log(channel.name);
		if (channel.name == info.channel)
		{
			channelId = channel.id;
			console.log(channel.id);
		}
	})
	client.users.cache.forEach(function(user) {
		console.log('username: ' + user.username + ' id: ' + user.id);
		if (user.username == username)
			client.channels.resolve(channelId).send("Happy birthay" + ` <@${user.id}>` + " :tada:");
	});
}

function check()
{
	var today = new Date();
	//if (today.getHours() == 15 && today.getMinutes() == 07)
	//{
		info.birthdays.forEach(function(birthday) {
			var date = birthday.date.split('-');
			var day = date[0];
			var month = date[1];
			if (today.getDate() == day && (today.getMonth() + 1) == month)
			{
				sendMessageTo(birthday.name);
			}
		});
	//}
}

console.log(client);
client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
		load();
		/* check every minute */
		client.setInterval(check, 60000);
	});

client.on('message', msg => {
	/*if (msg.content == 'ping')
	{
		// will reply with @
		msg.reply('pong');
		
		// will send to channel
		msg.channel.send('pong');
	}*/
	if (msg.content.substring(0,1) == '!')
	{
		console.log(msg);
		var args = msg.content.substring(1).split(' ');
		var cmd = args[0];
		
		args = args.splice(1);
		switch (cmd)
		{
			case 'ping':
				msg.channel.send('pong');
				break;
			case 'add':
				add(msg, args)
				break;
			case 'remove':
				remove(msg, args);
				break;
			case 'clear':
				clear(msg);
				break;
			case 'list':
				list(msg);
				break;
			case 'reload':
				reload(msg);
				break;
			case 'setChannel':
				setChannel(msg, args);
				break;
			case 'help':
				help(msg);
				break;
			default:
				help(msg);
		}
	}
});

client.login(process.env.DISCORD_TOKEN);