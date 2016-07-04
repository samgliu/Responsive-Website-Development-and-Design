//subscribe read datas
//Meteor.subscribe("datas");

// this variable will store the visualisation so we can delete it when we need to 
var visjsobj;
//if (Meteor.isClient){

////////////////////////////
///// helper functions for the vis control form
////////////////////////////

  Template.data_viz_controls.helpers({
    // returns an array of the names of all features of the requested type
    features : function(){
      var feature = [{feature:"Not select"},{feature:"age"},{feature:"registered"}]
        return feature;
      }
  });

    Template.data_feature_list.helpers({
    // returns an array of the names of all features of the requested type
    getnamedata : function(){
      var my_data = Datas.find().fetch();
      console.log(my_data);
        return my_data;
      }
  });

////////////////////////////
///// helper functions for the feature list display template
////// (provide the data for that list of datas)
////////////////////////////

// helper that provides an array of feature_values
// for all datas of the currently selected type
// this is used to feed the template that displays the big list of 
// numbers
  // Template.data_feature_list.helpers({
  //   "get_all_feature_values":function(){
  //     if (Session.get("feature") != undefined){
  //       var datas = datas.find({});
  //       var features = new Array();
  //       var ind = 0;
  //       // build an array of data on the fly for the 
  //       // template consisting of 'feature' objects
  //       // describing the data and the value it has for this particular feature
  //       datas.forEach(function(data){
  //         //console.log(data);
  //           features[ind] = {
  //             artist:data.metadata.tags.artist,
  //             title:data.metadata.tags.title, 
  //             value:data[Session.get("feature")["type"]][Session.get("feature")["name"]]
  //           };
  //           ind ++;
  //       })
  //       return features;
  //     }
  //     else {
  //       return [];
  //     }
  //   }
  // })

////////////////////////////
///// event handlers for the viz control form
////////////////////////////

  Template.data_viz_controls.events({
    // event handler for when user changes the selected
    // option in the drop down list
    "change .js-select-single-feature":function(event){
      event.preventDefault();
      var feature = $(event.target).val();
      console.log(feature);
      Session.set("feature", {featurename:feature});//Session.get("feature");
      if (feature == "registered"){
        $('button').attr('disabled',"true");
        $(".js-show-Graph2d-registered").removeAttr("disabled");
        $("#instruction").html("This is another data algorithm. it counts how many people registered at the same day not just show a value of a object. So I only did one chart, Please switch it to 'age'");
      }
      if (feature == "age"){
        $('button').removeAttr("disabled");
        $(".js-show-Graph2d-registered").attr('disabled',"true");
        $("#instruction").html(" ");
      }
      
    }, 
    // event handler for when the user clicks on the 
    "click .js-show-Graph2d-registered":function(event){
      event.preventDefault();
      initGraph2dregisteredVis();
    }, 
    "click .js-show-Graph2d":function(event){
      event.preventDefault();
      initDateVis();
    },
    "click .js-show-Graph2d-points":function(event){
      event.preventDefault();
      initDatepointsVis();
    },  
    // network button
    "click .js-show-network1":function(event){
      event.preventDefault();
      initDatenw1Vis();
      $("#instruction").html("Group everyone by eyecolor in different figure");
    }, 
    "click .js-show-network2":function(event){
      event.preventDefault();
      initDatenw2Vis();
      $("#instruction").html("Using edges to connect everyone by eyecolor");
    }
  }); 
//}



////////////////////////////
///// functions that set up and display the visualisation
////////////////////////////
function initGraph2dregisteredVis(){
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var my_data = Datas.find().fetch();
  // var time_array = [];
  // var dataset = new vis.DataSet();
  // for(var x = 0; x < Datas.find().count(); x++){
  //     var value = my_data[x].registered.slice(0,10); //2012-12-30
  //     //var value2date = Date.parse(value);
  //     //var value_date = new Date(value2date)
  // }
  //console.log(groupByProperty(my_data, 'registered'));


  // for (var each_time = 0; each_time < time_array.length)
  var options = {
     start: '2014-02-12',
    end: '2016-06-06',
    repeat:'weekly'
  };
  var finaldata = groupByProperty(my_data, 'registered');
  //console.log(finaldata);
  var dataset = new vis.DataSet(finaldata);
  // for (var i,j in time_array) {
  //   dataset.add(x:i, y:j);
  // // }
  var container = document.getElementById('visjs');
  // create the graph
  visjsobj = new vis.Graph2d(container, dataset, options);
  // tell the graph to set up its axes so all data points are shown
  visjsobj.fit();
}//end of function initGraph2dVis




//function for 1st chat
function initDateVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var datas = Datas.find({});
  var ind = 0;
  // generate an array of items
  // from the datas collection
  // where each item describes a data plus the currently selected
  // feature
  var items = new Array();
  // iterate the datas collection, converting each data into a simple
  // object that the visualiser understands
  datas.forEach(function(data){
    //console.log(data.registered);
   // console.log(data.age);
    //console.log(data.name);
    //console.log("=========================");
    if (data.registered != undefined){
      var label = "ind: "+ind;
      if (data.name != undefined){// we have a title
        label = data.name;
      }  
      var value = data.age;
      var date = data.registered;
      // here we create the actual object for the visualiser
      // and put it into the items array
      items[ind] = {
        x: date, 
        y: value, 
        // slighlty hacky label -- check out the vis-label
        // class in data_data_viz.css 
        label:{content:label, className:'vis-label', xOffset:-5}, 
      };
      ind ++ ;
  }
  });
  // set up the data plotter
  // var options = {
  //   style:'bar', 
  // };
  // get the div from the DOM that we are going to 
  // put our graph into 
  var container = document.getElementById('visjs');
  // create the graph
  visjsobj = new vis.Graph2d(container, items);
  // tell the graph to set up its axes so all data points are shown
  visjsobj.fit();
}

//2nd chart
function initDatepointsVis(){
  // clear out the old visualisation if needed
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var datas = Datas.find({});
  var ind = 0;
  // generate an array of items
  // from the datas collection
  // where each item describes a data plus the currently selected
  // feature
  var items = new Array();
  // iterate the datas collection, converting each data into a simple
  // object that the visualiser understands
  datas.forEach(function(data){
    //console.log(data.registered);
    //console.log(data.age);
    //console.log(data.name);
    //console.log("=========================");
    if (data.registered != undefined){
      var label = "ind: "+ind;
      if (data.name != undefined){// we have a title
        label = data.name;
      }  
      var value = data.age;
      var date = data.registered;
      // here we create the actual object for the visualiser
      // and put it into the items array
      items[ind] = {
        x: date, 
        y: value, 
        // slighlty hacky label -- check out the vis-label
        // class in data_data_viz.css 
        label:{content:label, className:'vis-label', xOffset:-5}, 
      };
      ind ++ ;
  }
  });
  // set up the data plotter
  var options = {
    sort: false,
    sampling:false,
    style:'points'
  };
  // get the div from the DOM that we are going to 
  // put our graph into 
  var container = document.getElementById('visjs');
  // create the graph
  visjsobj = new vis.Graph2d(container, items, options);
  // tell the graph to set up its axes so all data points are shown
  visjsobj.fit();
}

//3rd chart
function initDatenw1Vis(){
  // clear out the old visualisation if needed
  //console.log("=====")
  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var datas = Datas.find({});
  var nodes = new Array();
  var ind = 0;
  // iterate the datas, converting each data into 
  // a node object that the visualiser can understand
    datas.forEach(function(data){
      // set up a label with the data title and artist
     var label = "ind: "+ind;
     if (data.name != undefined){// we have a title
          label = data.name;
      } 
      // figure out the value of this feature for this data
      var value = data.age;
      var group = data.eyeColor;
      //console.log(group);
      // create the node and store it to the nodes array
        nodes[ind] = {
          id:ind, 
          label:label, 
          value:value,
          group:group
        }
        ind ++;
        //console.log(nodes[ind]);
    })
    // edges are used to connect nodes together. 
    // we don't need these for now...
    edges =[];
    // this data will be used to create the visualisation
    var data = {
      nodes: nodes,
      edges: edges
    };
    // options for the visualisation
     var options = {
      nodes: {
        shape: 'dot',
      },
      groups: {
       blue: {color:{background:'blue'}, borderWidth:1,shape:'star'},
       brown:{color:{background:'brown'}, borderWidth:1,shape:'triangle'},
       green:{color:{background:'green'}, borderWidth:1,shape:'diamond'}
      }
    };
    // get the div from the dom that we'll put the visualisation into
    container = document.getElementById('visjs');
    // create the visualisation
    visjsobj = new vis.Network(container, data, options);
}

//4rd chart
function initDatenw2Vis(){
  // clear out the old visualisation if needed
  //console.log("=====")

  if (visjsobj != undefined){
    visjsobj.destroy();
  }
  var datas = Datas.find({});
  var edges =[];
  var nodes = new Array();
  var ind = 0;
  nodes[1] = {
      id:1,
      label:"red eyecolor",
      group:"biggreen",
      value:200
    };
  nodes[2] = {
      id:2,
      label:"blue eyecolor",
      group:"bigblue",
      value:200
    };
  nodes[3] = {
      id:3,
      label:"red eyecolor",
      group:"bigbrown",
      value:200
    };
  // iterate the datas, converting each data into 
  // a node object that the visualiser can understand
    datas.forEach(function(data){
      // set up a label with the data title and artist
     var label = "ind: "+ind;
     if (data.name != undefined){// we have a title
          label = data.name;
      } 
      // figure out the value of this feature for this data
      var value = data.age;
      var group = data.eyeColor;
      
      //console.log(group);
      if (group == "green"){
        edges[ind]={
          "from":1,
          "to":ind
        };
      }
      if (group == "blue"){
        edges[ind]={
          "from":2,
          "to":ind
        };
      }
      if (group == "brown"){
        edges[ind]={
          "from":3,
          "to":ind
        };
      }
      // create the node and store it to the nodes array
        nodes[ind] = {
          id:ind, 
          label:label, 
          value:value,
          group:group
        };
        
        ind ++;
        //console.log(nodes[ind]);
    })

    
    //console.log(edges);

    // edges are used to connect nodes together. 
    // we don't need these for now...

    // this data will be used to create the visualisation
    var data = {
      nodes: nodes,
      edges: edges
    };
    // options for the visualisation
     var options = {
      nodes: {
        shape: 'dot',
      },
      edges: {
         selectionWidth: function (width) {return width*2;}
      },
      groups: {
       bigblue: {color:{background:'blue'}, borderWidth:5},
       bigbrown:{color:{background:'brown'}, borderWidth:5},
       biggreen:{color:{background:'green'}, borderWidth:5}
      }
    };
    // get the div from the dom that we'll put the visualisation into
    container = document.getElementById('visjs');
    // create the visualisation
    visjsobj = new vis.Network(container, data, options);
}

//extra function for data counting
function groupByProperty(array, property) {
  var newObject = array.reduce(function(counters, item) {
    //console.log(item[property]);
    if(!counters[item[property]]) {
      counters[item[property]] = 1;
    }
    else {
      counters[item[property]] += 1;
    }
    //console.log(counters);
    return counters;

  }, {});
  return Object.keys(newObject).map(function(x) {
    var obj = {
      x: x,
      y: newObject[x]
    };
    return obj; 
  });
}


