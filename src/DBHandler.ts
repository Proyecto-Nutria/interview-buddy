const MongoClient = require('mongodb').MongoClient;
const _mongoClient = MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });

module.exports.DBHandler = class DBHandler
{
    private db;
    private static instance: any;

	private constructor()
    {
		_mongoClient.connect(err => 
        {
		    if(err) throw err;
			this.db = _mongoClient.db('InterviewBuddy');
		});
	}

    getMail(user)
    {	
		return this.db.collection('mails').findOne({id:user.id});
	}
	
    setMail(user)
    {
		return this.db.collection('mails').findOneAndUpdate({id:user.id}, {$set:user}, {upsert:true});
	}
	end(){_mongoClient.close();}

    public static getInstance(): DBHandler 
    {
		if (!DBHandler.instance)
            DBHandler.instance = new DBHandler();
		return DBHandler.instance;
	}
}
