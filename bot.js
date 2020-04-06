require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

/* CSV */
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWrite = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWrite({
	path: 'data.csv',
	header: [
	{id: 'name', title: 'Name'},
	{id: 'date', title: 'Date'}
]});

var birthdays = [];

function load()
{
	console.log('loading file');
	fs.createReadStream('data.csv')
		.pipe(csv())
		.on('data', (row) => {
			var birthday = {name: row.Name, date: row.Date};
			birthdays.push(birthday);
		})
		.on('end', () => {
			console.log('CSV file processed');
		});
}

function write()
{
	csvWriter.writeRecords(birthdays)
	.then(() => console.log('CSV file written'));
}

// !add
function add(msg, args)
{
	var birthday = {name: args[0], date: args[1]};
	birthdays.push(birthday);
	write();
}

// !remove
function remove(msg, args)
{
	for (var i = 0; i < birthdays.length; i++)
	{
		if (birthdays[i].name == args)
		{
			birthdays.splice(i,1);
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
	birthdays.forEach(function(birthday) {
		msg.channel.send('name: ' + birthday.name + ' date: ' + birthday.date);
	});
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
}

function check()
{
	/*var date = new Date();
	if (date.getHours() == 17 && date.getMinutes() == 50)
	{
	}*/
		//const channel = client.channels.find('test-bot', channelName);
		console.log('check @Rayster');
		client.users.cache.forEach(function(user) {
			console.log('username: ' + user.username + ' id: ' + user.id);
			if (user.username == "Rayster")
				client.channels.resolve('696706965728133180').send(`check <@${user.id}>`);
		});
		//client.channels.resolve('696706965728133180').send('check <@Rayster#5916>');//.then(message => console.log(`Sent message: ${message.content}`)).catch(console.error);
}

console.log(client);
client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
		load();
		//client.setInterval(check, 10000);
		check();
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
			case 'help':
				help(msg);
				break;
			default:
				help(msg);
		}
	}
});

client.login(process.env.DISCORD_TOKEN);