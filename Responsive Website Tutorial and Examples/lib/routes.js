Router.configure({
  layoutTemplate: 'ApplicationLayout'
});
Router.route('/', function () {
  console.log("rendering root /");
  this.render("navbar", {to:"header"});
  this.render("home", {to:"main"});  
});

Router.route('/viz', function () {
  console.log("rendering viz /");
  this.render("navbar", {to:"header"});
  this.render("data_viz", {to:"main"});  
});
