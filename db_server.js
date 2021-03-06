var express=require('express');
var mysql=require('mysql');
var app=express();
var bodyParser=require('body-parser');

var router = express.Router();


app.use(bodyParser.json());



var connection =mysql.createConnection({

host:'localhost',
port:'3306',
user:'root',
password:'',
database:'flight_records',
multipleStatements:true
});



connection.connect(function(err){
	if (err){console.log("Connection Failed!!" + err);}
	else{console.log("Connection Successful!");}
});


app.get('/searchByFlight_Number',(req,res)=>{
	
	
	connection.query('SELECT * FROM flight_data WHERE Flight_Number=?',req.query.Flight_Number,(err,result,fields)=>{
		if(err){throw err;}
		console.log(result);
        res.write('<table border="10"style="background-color:#00FF00"class="table table-striped"><tr>');
        for (var column in result[0]){
            res.write('<th><label>'+column+'</label></th>');
            
            }
        for (var row in result){
            res.write('<tr>');
            for (var column in result[row]){
                res.write('<td><label>'+result[row][column]+'</label></td>');
            }
            res.write('<tr>')
		}
		res.write('</tr>');
        res.end('</table>');
		
	});
})
app.get('/searchByDestination',(req,res)=>{
	connection.query('SELECT * FROM flight_data WHERE Destination=?',[req.query.Destination],(err,result,fields)=>{
		if(err){throw err;}
		console.log(result);
       res.write('<table border="10"style="background-color:#00FF00"class="table table-striped" style="width: 100%; height: 100%;"><tr>');
        for (var column in result[0]){
            res.write('<th><label>'+column+'</label></th>');
            
            }
        for (var row in result){
            res.write('<tr>');
            for (var column in result[row]){
                res.write('<td><label>'+result[row][column]+'</label></td>');
            }
            res.write('<tr>')
		}
		res.write('</tr>');
        res.end('</table>');
		
	});
})

app.get('/searchByDate',(req,res)=>{
	connection.query('SELECT * FROM flight_data WHERE DATE_FORMAT(Departure_Time, "%Y-%m-%d") = ?',[req.query.Date],(err,result,fields)=>{
		if(err){throw err;}
		console.log(result);
		res.write('<table border="10"style="background-color:#00FF00"class="table table-striped"><tr>');
        for (var column in result[0]){
            res.write('<th><label>'+column+'</label></th>');
            
            }
        for (var row in result){
            res.write('<tr>');
            for (var column in result[row]){
                res.write('<td><label>'+result[row][column]+'</label></td>');
            }
            res.write('<tr>')
		}
		res.write('</tr>');
		res.end('</table>');
		
		
	});
})

app.get('/countByDate',(req,res)=>{
	connection.query('SELECT COUNT(Flight_Number) FROM flight_data WHERE DATE_FORMAT(Departure_Time, "%Y-%m-%d") = ?',[req.query.Date],(err,rows,fields)=>{
		if(err){throw err;}
		
		res.send(rows);
		

	
})
});


app.get('/addFlights',(req,res)=>{
	let data ={Flight_Number:req.query.Flight_Number,Flight_Duration:req.query.Flight_Duration,Source:req.query.Source,Destination:req.query.Destination,Departure_Time:req.query.Departure_Time};
	
	let sql ="INSERT INTO flight_data SET ?";
	connection.query(sql,data,(err,rows,fields)=>{
		if(!err)
		res.send("Data Inserted");
		else
		console.log(err);
	})
});


module.exports = router;



var server = app.listen(8081, function() {
	var port = server.address().port
	var host = server.address().address
	console.log("Server is listening on: http://%s:%s", host, port)
})
