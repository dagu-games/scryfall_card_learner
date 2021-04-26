var cards = [
  {
    name:"Giant's Growth",
    mana_cost:"{G}",
    type:"instant",
    oracle_text:"target creature gets +3/+3",
    successes:0,
    attempts:0,
    card_links:["images/card_back.jpg"],
    art_links:["images/card_back.jpg"],
  },
  {
    name:"card2 // card3",
    mana_cost:"card2 // card3",
    type:"card2 // card3",
    oracle_text:"card2 // card3",
    successes:0,
    attempts:0,
    card_links:["images/card_back.jpg","images/card_back.jpg"],
    art_links:["images/card_back.jpg","images/card_back.jpg"],
  },
  {
    name:"Giant's Growth2",
    mana_cost:"{G}2",
    type:"instant2",
    oracle_text:"target creature gets +3/+32",
    successes:0,
    attempts:0,
    card_links:["images/card_back.jpg"],
    art_links:["images/card_back.jpg"],
  },
  {
    name:"Giant's Growth3",
    mana_cost:"{G}3",
    type:"instant3",
    oracle_text:"target creature gets +3/+33",
    successes:0,
    attempts:0,
    card_links:["images/card_back.jpg"],
    art_links:["images/card_back.jpg"],
  },
  {
    name:"Giant's Growth4",
    mana_cost:"{G}4",
    type:"instant4",
    oracle_text:"target creature gets +3/+34",
    successes:0,
    attempts:0,
    card_links:["images/card_back.jpg"],
    art_links:["images/card_back.jpg"],
  },
  {
    name:"Giant's Growth5",
    mana_cost:"{G}5",
    type:"instant5",
    oracle_text:"target creature gets +3/+35",
    successes:0,
    attempts:0,
    card_links:["images/card_back.jpg"],
    art_links:["images/card_back.jpg"],
  },
];



var app = new Vue({
  el: '#app',
  data: {
    message: 'Welcome!',
    cards: cards,
    current_card: 0,
    successes: 0,
    attempts: 0,
    hide_settings: false,
    current_question_type: "name",
    current_question_options: [
      "card1",
      "card2",
      "card3",
      "card4",
    ],
    correct_answer_index: 0,
    seed_string: "",
  },
  methods: {
    get_seed_string: function() {
      return this.seed_string + " lang:english";
    },
    is_settings_hidden: function() {
      return this.hide_settings;
    },
    answer_question: function (answer_index) {
      this.cards[this.current_card].attemps++;
      this.attempts++;
      if(answer_index == this.correct_answer_index){
        this.cards[this.current_card].successes++;
        this.successes++;
        this.current_card++;
        if(this.current_card == this.cards.length){
          this.current_card = 0;
          this.add_card();
        }
        var new_correct_answer_index = Math.floor(Math.random() * 5);
        var question_types = [
          "name",
          "mana_cost",
          "type",
          "oracle_text",
          "art",
        ];
        var new_correct_answer_type = question_types[Math.floor(Math.random() * question_types.length)];

        for(var i = 0; i < 5; i++){
          if(i==new_correct_answer_index){
            if(new_correct_answer_type == "name"){
              this.current_question_options[i] = this.cards[current_card].name;
            }
            if(new_correct_answer_type == "mana_cost"){
              this.current_question_options[i] = this.cards[current_card].mana_cost;
            }
            if(new_correct_answer_type == "type"){
              this.current_question_options[i] = this.cards[current_card].type;
            }
            if(new_correct_answer_type == "oracle_text"){
              this.current_question_options[i] = this.cards[current_card].oracle_text;
            }
            if(new_correct_answer_type == "art"){
              this.current_question_options[i] = this.cards[current_card].art_link;
            }
          }
        }
      }else{
        this.current_card = 0;
      }
    },
    toggle_settings: function () {
      if(app.hide_settings){
        app.hide_settings = false;
      }else{
        app.hide_settings = true;
      }
    },
    add_card: function () {
      app.cards.push({
        name:"Giant's Growth" + this.cards.length,
        mana_cost:"{G}" + this.cards.length,
        type:"instant" + this.cards.length,
        oracle_text:"target creature gets +3/+3" + this.cards.length,
        successes:0,
        attempts:0,
        card_links:["images/card_back.jpg"],
        art_links:["images/card_back.jpg"],
      });
    },
    seed_cards: function () {
      app.cards = [
        {
          name:"Giant's Growth",
          mana_cost:"{G}",
          type:"instant",
          oracle_text:"target creature gets +3/+3",
          successes:0,
          attempts:0,
          card_links:["images/card_back.jpg"],
          art_links:["images/card_back.jpg"],
        },
        {
          name:"card2 // card3",
          mana_cost:"card2 // card3",
          type:"card2 // card3",
          oracle_text:"card2 // card3",
          successes:0,
          attempts:0,
          card_links:["images/card_back.jpg","images/card_back.jpg"],
          art_links:["images/card_back.jpg","images/card_back.jpg"],
        },
        {
          name:"Giant's Growth2",
          mana_cost:"{G}2",
          type:"instant2",
          oracle_text:"target creature gets +3/+32",
          successes:0,
          attempts:0,
          card_links:["images/card_back.jpg"],
          art_links:["images/card_back.jpg"],
        },
        {
          name:"Giant's Growth3",
          mana_cost:"{G}3",
          type:"instant3",
          oracle_text:"target creature gets +3/+33",
          successes:0,
          attempts:0,
          card_links:["images/card_back.jpg"],
          art_links:["images/card_back.jpg"],
        },
        {
          name:"Giant's Growth4",
          mana_cost:"{G}4",
          type:"instant4",
          oracle_text:"target creature gets +3/+34",
          successes:0,
          attempts:0,
          card_links:["images/card_back.jpg"],
          art_links:["images/card_back.jpg"],
        },
        {
          name:"Giant's Growth5",
          mana_cost:"{G}5",
          type:"instant5",
          oracle_text:"target creature gets +3/+35",
          successes:0,
          attempts:0,
          card_links:["images/card_back.jpg"],
          art_links:["images/card_back.jpg"],
        },
      ];


    },
  }
});






/*
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
};*/
