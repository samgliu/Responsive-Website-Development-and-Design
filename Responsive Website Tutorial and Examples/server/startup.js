
// define a startup script that 
// reads the JSON data files from the filesystem 
// and inserts them into the database if needed


Meteor.startup(function(){
	if (!Datas.findOne()){
	console.log("no datas yet... creating from filesystem");
	// pull in the NPM package 'fs' which provides
	// file system functions
	var fs = Meteor.npmRequire('fs');
	// get a list of files in the folder private/jsonfiles, which
	// ends up as assets/app/jsonfiles in the app once it is built
	var files = fs.readdirSync('./assets/app/jsonfiles/');///
	// iterate the files, each of which should be a 
	var inserted_datas = 0; //count insert data
        console.log(files.length);
	for (var i=0;i<files.length; i++){
	//for (var i=0;i<1; i++){
              console.log(files[i]);
	 	var filename = 'jsonfiles/'+ files[i];
	 	// in case the file does not exist, put it in a try catch
	 	try{
                    var mydata = JSON.parse(Assets.getText(filename)); //parse right data
                    console.log(mydata.length);//right number, json array
                    for (j=0; j<mydata.length; j++){
                          Datas.insert(mydata[j]);
                          inserted_datas++;
                    } //end of 1st for
	 	}catch (e){
	 		console.log("error parsing file "+filename);
	 	}// end of catch and try
	}
	console.log("Inserted "+inserted_datas+" new datas...");
}
})

// Meteor.publish("datas", function(){
//   return Datas.find();
// })
