var  express 			=  require("express"),
	 app				=  express(),
	 bodyParser  		=  require("body-parser"),
	 mongoose 			=  require('mongoose'),
	 logger				=  require('morgan');

var app = express();

mongoose.connect('mongodb://localhost/edison-2');


var BatterySchema=new mongoose.Schema({
			battery_id 		: String,
			times_charged:{type:Number,default:0},
			timestamps:[Number]
});
const Battery = mongoose.model("Battery",BatterySchema);

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/',function(req,res){
	Battery.find({},function(err,doc){
		// res.send(doc);
		res.render('index',{battery: doc});
	});
});
app.get('/create-battery',function(req,res){
	res.render('battery-form');
})

app.post('/create-battery',function(req,res){
	var newBattery=new Battery({
		battery_id:req.body.batteryId,
		times_charged:1,
		timestamps:Date.now()
	});
	newBattery.save()
    .then(item => {
      res.redirect("/create-battery");
    })
    .catch(err => {
      res.send(err);
    });
});



app.get('/:battery_id',function(req,res){
	Battery.findOneAndUpdate({battery_id:req.params.battery_id},{ $push: { timestamps: Date.now()  } ,$inc: { times_charged: 1 } },function(err,doc){
		if(err)
		res.send(err);
		res.send('done');
		console.log(doc);
	});

});


app.listen(3000,function(){
	console.log("Edison's server is working just fine!");
});