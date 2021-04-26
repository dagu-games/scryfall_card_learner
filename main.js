function reset() {


}


var scryfall_images = [];

var get_card_image = function(name) {
  var link = "";

  for(var i = 0; i < scryfall_images.length; i++){
    if(scryfall_images[i].name == name){
      return scryfall_images[i].link;
    }
  }

  const Http = new XMLHttpRequest();
  const url='https://api.scryfall.com/cards/named?fuzzy=' + encodeURI(name);
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = (e) => {
    console.log(Http.responseText)
  }



  //find link to given name
  return link;
};
