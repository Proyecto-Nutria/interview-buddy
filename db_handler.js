const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;
const client = MongoClient(uri, { useUnifiedTopology: true });
class db_handler{
	constructor(){
		client.connect(err => {
		if(err) throw err;
			this.db = client.db('InterviewBuddy');
		});
	}
	getMail(user){	
		return this.db.collection('mails').findOne({id:user.id});
	}
	setMail(user){
		return this.db.collection('mails').findOneAndUpdate({id:user.id}, {$set:user}, {upsert:true});
	}
	end(){client.close();}
}
module.exports = new db_handler();
