var cards = [{
    name: "Giant's Growth",
    mana_cost: "{G}",
    type: "instant",
    oracle_text: "target creature gets +3/+3",
    successes: 0,
    attempts: 0,
    card_links: ["images/card_back.jpg"],
    art_links: ["images/card_back.jpg"],
  },
  {
    name: "Giant's Growth1",
    mana_cost: "{G}1",
    type: "instant1",
    oracle_text: "target creature gets +3/+31",
    successes: 0,
    attempts: 0,
    card_links: ["images/card_back.jpg", "images/card_back.jpg"],
    art_links: ["images/card_back.jpg", "images/card_back.jpg"],
  },
  {
    name: "Giant's Growth2",
    mana_cost: "{G}2",
    type: "instant2",
    oracle_text: "target creature gets +3/+32",
    successes: 0,
    attempts: 0,
    card_links: ["images/card_back.jpg"],
    art_links: ["images/card_back.jpg"],
  },
  {
    name: "Giant's Growth3",
    mana_cost: "{G}3",
    type: "instant3",
    oracle_text: "target creature gets +3/+33",
    successes: 0,
    attempts: 0,
    card_links: ["images/card_back.jpg"],
    art_links: ["images/card_back.jpg"],
  },
  {
    name: "Giant's Growth4",
    mana_cost: "{G}4",
    type: "instant4",
    oracle_text: "target creature gets +3/+34",
    successes: 0,
    attempts: 0,
    card_links: ["images/card_back.jpg"],
    art_links: ["images/card_back.jpg"],
  },
  {
    name: "Giant's Growth5",
    mana_cost: "{G}5",
    type: "instant5",
    oracle_text: "target creature gets +3/+35",
    successes: 0,
    attempts: 0,
    card_links: ["images/card_back.jpg"],
    art_links: ["images/card_back.jpg"],
  },
];



var app = new Vue({
  el: '#app',
  data: {
    cards: cards,
    current_card: 0,
    successes: 0,
    attempts: 0,
    hide_settings: true,
    current_question_type: "name",
    current_question_options: [
      "card1",
      "card2",
      "card3",
      "card4",
    ],
    correct_answer_index: 0,
    question_order: [5, 4, 3, 2, 1, 0],
    seed_string: "",
    seed_number: 100,
    round: 0,
    scryfall_page: 1,
    file_text: "",
    previous_cards: [],
    show_results: false,
    add_count: 0,
  },
  mounted: function() {
    this.onLoaded();
  },
  computed: {
    getProgress: function() {
      return Math.round((this.current_card / this.cards.length) * 95);
    },
  },
  methods: {
    clearData: function() {
      localStorage.save_data = "";
    },
    showResults: function() {
      return this.show_results;
    },
    dismissResults: function() {
      this.show_results = false;
    },
    uploadData: function(event) {
      var placeFileContent = function(target, file) {
        readFileContent(file).then(content => {
          localStorage.save_data = content;
          app.onLoaded();
        }).catch(error => console.log(error))
      };

      var readFileContent = function(file) {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
          reader.onload = event => resolve(event.target.result)
          reader.onerror = error => reject(error)
          reader.readAsText(file)
        })
      };

      const input = event.target
      if ('files' in input && input.files.length > 0) {
        placeFileContent(
          document.getElementById('content-target'),
          input.files[0])
      }
    },
    downloadData: function() {
      var str = localStorage.save_data;
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
      element.setAttribute('download', "cards_save_file.txt");

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    saveData: function() {
      var save_data = {
        cards: this.cards,
        question_order: this.question_order,
        round: this.round,
        scryfall_page: this.scryfall_page,
        seed_string: this.seed_string,
        successes: this.successes,
        attempts: this.attempts,
        current_card: this.current_card,
        correct_answer_index: this.correct_answer_index,
        current_question_type: this.current_question_type,
        current_question_options: this.current_question_options,
        previous_cards: this.previous_cards,
      };
      localStorage.save_data = LZString.compressToBase64(JSON.stringify(save_data));
    },
    refreshQuestions: function() {
      this.current_card = 0;
      this.correct_answer_index = Math.floor(Math.random() * 4);
      this.shuffle(this.question_order);
      var question_types = [
        "name",
        "mana_cost",
        "type",
        "oracle_text"
      ];
      this.current_question_type = question_types[Math.floor(Math.random() * question_types.length)];

      var possible_answers = [];
      for (var i = 0; i < this.cards.length; i++) {
        var found = false;
        if (this.cards[i][this.current_question_type] == this.cards[this.question_order[this.current_card]][this.current_question_type]) {
          found = true;
        }
        for (var j = 0; j < possible_answers.length; j++) {
          if (possible_answers[j] == this.cards[i][this.current_question_type]) {
            found = true;
          }
        }
        if (!found) {
          possible_answers.push(this.cards[i][this.current_question_type]);
        }
      }
      //console.log(possible_answers);
      possible_answers.sort((a, b) => {
        var correct_ans = this.cards[this.question_order[this.current_card]][this.current_question_type];
        var dis_a = app.calculateDifference(a, correct_ans);
        var dis_b = app.calculateDifference(b, correct_ans);

        if (dis_a < dis_b) {
          return -1;
        }
        if (dis_a > dis_b) {
          return 1;
        }
        return 0;
      });
      //console.log(possible_answers);
      //TODO
      //const levenSort = require('leven-sort');
      //levenSort(possible_answers, this.cards[this.question_order[this.current_card]][this.current_question_type]);
      //this.shuffle(possible_answers);
      var j = 0;
      for (var i = 0; i < 4; i++) {
        if (i == this.correct_answer_index) {
          this.current_question_options[i] = this.cards[this.question_order[this.current_card]][this.current_question_type];
        } else {
          this.current_question_options[i] = possible_answers[j];
          j++;
        }
      }
    },
    onLoaded: function() {
      if (localStorage.save_data == undefined || localStorage.save_data == "") {
        localStorage.save_data = "";
        this.seed_cards();
      } else {
        var save_data = JSON.parse(LZString.decompressFromBase64(localStorage.save_data));
        this.cards = save_data.cards;
        this.question_order = save_data.question_order;
        this.round = save_data.round;
        this.scryfall_page = save_data.scryfall_page;
        this.seed_string = save_data.seed_string;
        this.successes = save_data.successes;
        this.attempts = save_data.attempts;
        this.current_card = save_data.current_card;
        this.correct_answer_index = save_data.correct_answer_index;
        this.current_question_type = save_data.current_question_type;
        this.current_question_options = save_data.current_question_options;
        this.previous_cards = save_data.previous_cards;
      }
    },
    shuffle: function(arr) {
      var currentIndex = arr.length,
        temporaryValue, randomIndex;

      while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
      }

      return arr;
    },
    get_seed_string: function() {
      return this.seed_string + " lang:english";
    },
    is_settings_hidden: function() {
      return this.hide_settings;
    },
    answer_question: function(answer_index) {
      this.cards[this.question_order[this.current_card]].attempts++;
      this.attempts++;
      this.show_results = true;
      this.previous_cards.unshift({
        links: this.cards[this.question_order[this.current_card]].card_links,
        correct: answer_index == this.correct_answer_index,
      });

      if (this.previous_cards.length > 5) {
        this.previous_cards.splice(this.previous_cards.length - 1);
      }

      if (answer_index == this.correct_answer_index) {
        this.cards[this.question_order[this.current_card]].successes++;
        this.successes++;
        this.current_card++;
        if (this.current_card == this.cards.length) {
          this.current_card = 0;
          this.add_card();
          this.round++;
        }
      } else {
        this.current_card = 0;
        this.refreshQuestions();
      }
      this.correct_answer_index = Math.floor(Math.random() * 4);
      console.log(this.correct_answer_index + 1);
      var question_types = [
        "name",
        "mana_cost",
        "type",
        "oracle_text"
      ];
      this.current_question_type = question_types[Math.floor(Math.random() * question_types.length)];

      var possible_answers = [];
      for (var i = 0; i < this.cards.length; i++) {
        var found = false;
        if (this.cards[i][this.current_question_type] == this.cards[this.question_order[this.current_card]][this.current_question_type]) {
          found = true;
        }
        for (var j = 0; j < possible_answers.length; j++) {
          if (possible_answers[j] == this.cards[i][this.current_question_type]) {
            found = true;
          }
        }
        if (!found) {
          possible_answers.push(this.cards[i][this.current_question_type]);
        }
      }
      //console.log(possible_answers);
      possible_answers.sort((a, b) => {
        var correct_ans = this.cards[this.question_order[this.current_card]][this.current_question_type];
        var dis_a = app.calculateDifference(a, correct_ans);
        var dis_b = app.calculateDifference(b, correct_ans);

        if (dis_a < dis_b) {
          return -1;
        }
        if (dis_a > dis_b) {
          return 1;
        }
        return 0;
      });
      //console.log(possible_answers);
      var j = 0;
      for (var i = 0; i < 4; i++) {
        if (i == this.correct_answer_index) {
          this.current_question_options[i] = this.cards[this.question_order[this.current_card]][this.current_question_type];
        } else {
          this.current_question_options[i] = possible_answers[j];
          j++;
        }
      }

      this.saveData();
    },
    toggle_settings: function() {
      if (app.hide_settings) {
        app.hide_settings = false;
      } else {
        app.hide_settings = true;
      }
    },
    add_card: function() {
      const Http = new XMLHttpRequest();
      var query = "";
      if (this.seed_string = "") {
        query = "lang:english";
      } else {
        query = this.seed_string + " lang:english";
      }
      const url = 'https://api.scryfall.com/cards/search?order=released&unique=cards&dir=asc&include_extras=false&page=' + this.scryfall_page + '&q=' + encodeURI(query);
      Http.open("GET", url);

      Http.onreadystatechange = (e) => {


        if (Http.readyState == 4 && Http.status == 200) {
          //console.log(Http.responseText);
          var response = JSON.parse(Http.responseText);


          var tcard = {};

          for (var i = 0; i < response.data.length; i++) {
            var found = false;
            for (var j = 0; j < this.cards.length; j++) {
              if (this.cards[j].id == response.data[i].id) {
                found = true;
              }
            }
            if (!found) {
              break;
            }
          }
          if (found != true) {


            if (response.data[i].card_faces == null) {
              //a single faced card
              tcard.name = response.data[i].name;
              tcard.id = response.data[i].id;
              tcard.mana_cost = response.data[i].mana_cost;
              tcard.type = response.data[i].type_line;
              tcard.oracle_text = response.data[i].oracle_text.replaceAll(tcard.name, "[CARD NAME]");
              if (response.data[i].power != null) {
                tcard.oracle_text += "\n" + response.data[i].power + "/" + response.data[i].toughness;
              }
              tcard.card_links = [];
              tcard.art_links = [];
              if (response.data[i].image_uris != null) {
                if (response.data[i].image_uris.png != null) {
                  tcard.card_links.push(response.data[i].image_uris.png);
                }
                if (response.data[i].image_uris.art_crop != null) {
                  tcard.art_links.push(response.data[i].image_uris.art_crop);
                }
              }
            } else {
              //a double (or more) faced card
              tcard.id = response.data[i].id;
              tcard.name = response.data[i].card_faces[0].name;
              tcard.mana_cost = response.data[i].card_faces[0].mana_cost;
              tcard.type = response.data[i].card_faces[0].type_line;
              tcard.oracle_text = response.data[i].card_faces[0].oracle_text.replaceAll(response.data[i].card_faces[0].name, "[CARD NAME]");
              if (response.data[i].card_faces[0].power != null) {
                tcard.oracle_text += "\n" + response.data[i].card_faces[0].power + "/" + response.data[i].card_faces[0].toughness;
              }
              tcard.card_links = [];
              tcard.art_links = [];
              if (response.data[i].card_faces[0].image_uris != null) {
                if (response.data[i].card_faces[0].image_uris.png != null) {
                  tcard.card_links.push(response.data[i].card_faces[0].image_uris.png);
                }
                if (response.data[i].card_faces[0].image_uris.art_crop != null) {
                  tcard.art_links.push(response.data[i].card_faces[0].image_uris.art_crop);
                }
              }
              for (var j = 1; j < response.data[i].card_faces.length; j++) {
                tcard.name += "  //  " + response.data[i].card_faces[j].name;
                tcard.mana_cost += "  //  " + response.data[i].card_faces[j].mana_cost;
                tcard.type += "  //  " + response.data[i].card_faces[j].type_line;
                tcard.oracle_text += "  //  " + response.data[i].card_faces[j].oracle_text.replaceAll(response.data[i].card_faces[j].name, "[CARD NAME]");
                if (response.data[i].card_faces[j].power != null) {
                  tcard.oracle_text += "\n" + response.data[i].card_faces[j].power + "/" + response.data[i].card_faces[j].toughness;
                }
                tcard.card_links = [];
                tcard.art_links = [];
                if (response.data[i].card_faces[j].image_uris != null) {
                  if (response.data[i].card_faces[j].image_uris.png != null) {
                    tcard.card_links.push(response.data[i].card_faces[j].image_uris.png);
                  }
                  if (response.data[i].card_faces[j].image_uris.art_crop != null) {
                    tcard.art_links.push(response.data[i].card_faces[j].image_uris.art_crop);
                  }
                }
              }
            }
            this.cards.push(tcard);
            this.question_order.push(this.cards.length - 1);
            this.refreshQuestions();
            this.saveData();
            this.add_count--;
            if (this.add_count > 0) {
              this.add_card();
            }

          } else {
            this.scryfall_page++;
            this.add_card();
          }
        }
      }

      Http.send();
    },
    seed_cards: function() {
      const Http = new XMLHttpRequest();
      var query = "";
      if (this.seed_string == "") {
        query = "lang:english";
      } else {
        query = this.seed_string + " lang:english";
      }
      const url = 'https://api.scryfall.com/cards/search?order=released&unique=cards&dir=asc&include_extras=false&page=' + 1 + '&q=' + encodeURI(query);
      Http.open("GET", url);

      Http.onreadystatechange = (e) => {


        if (Http.readyState == 4 && Http.status == 200) {

          var response = JSON.parse(Http.responseText);
          //console.log(response);
          this.cards = [];
          this.question_order = [];
          var t_seed_num = app.seed_number < response.data.length ? app.seed_number : response.data.length;
          for (var i = 0; i < t_seed_num; i++) {
            var tcard = {};
            if (response.data[i].card_faces == null) {
              //a single faced card
              tcard.name = response.data[i].name;
              tcard.id = response.data[i].id;
              tcard.mana_cost = response.data[i].mana_cost;
              tcard.type = response.data[i].type_line;
              tcard.oracle_text = response.data[i].oracle_text.replaceAll(tcard.name, "[CARD NAME]");
              if (response.data[i].power != null) {
                tcard.oracle_text += "\n" + response.data[i].power + "/" + response.data[i].toughness;
              }
              tcard.card_links = [];
              tcard.art_links = [];
              if (response.data[i].image_uris != null) {
                if (response.data[i].image_uris.png != null) {
                  tcard.card_links.push(response.data[i].image_uris.png);
                }
                if (response.data[i].image_uris.art_crop != null) {
                  tcard.art_links.push(response.data[i].image_uris.art_crop);
                }
              }
            } else {
              //a double (or more) faced card
              tcard.id = response.data[i].id;
              tcard.name = response.data[i].card_faces[0].name;
              tcard.mana_cost = response.data[i].card_faces[0].mana_cost;
              tcard.type = response.data[i].card_faces[0].type_line;
              tcard.oracle_text = response.data[i].card_faces[0].oracle_text.replaceAll(response.data[i].card_faces[0].name, "[CARD NAME]");
              if (response.data[i].card_faces[0].power != null) {
                tcard.oracle_text += "\n" + response.data[i].card_faces[0].power + "/" + response.data[i].card_faces[0].toughness;
              }
              tcard.card_links = [];
              tcard.art_links = [];
              if (response.data[i].card_faces[0].image_uris != null) {
                if (response.data[i].card_faces[0].image_uris.png != null) {
                  tcard.card_links.push(response.data[i].card_faces[0].image_uris.png);
                }
                if (response.data[i].card_faces[0].image_uris.art_crop != null) {
                  tcard.art_links.push(response.data[i].card_faces[0].image_uris.art_crop);
                }
              }
              for (var j = 1; j < response.data[i].card_faces.length; j++) {
                tcard.name += "  //  " + response.data[i].card_faces[j].name;
                tcard.mana_cost += "  //  " + response.data[i].card_faces[j].mana_cost;
                tcard.type += "  //  " + response.data[i].card_faces[j].type_line;
                tcard.oracle_text += "  //  " + response.data[i].card_faces[j].oracle_text.replaceAll(response.data[i].card_faces[j].name, "[CARD NAME]");
                if (response.data[i].card_faces[j].power != null) {
                  tcard.oracle_text += "\n" + response.data[i].card_faces[j].power + "/" + response.data[i].card_faces[j].toughness;
                }
                tcard.card_links = [];
                tcard.art_links = [];
                if (response.data[i].card_faces[j].image_uris != null) {
                  if (response.data[i].card_faces[j].image_uris.png != null) {
                    tcard.card_links.push(response.data[i].card_faces[j].image_uris.png);
                  }
                  if (response.data[i].card_faces[j].image_uris.art_crop != null) {
                    tcard.art_links.push(response.data[i].card_faces[j].image_uris.art_crop);
                  }
                }
              }
            }
            this.cards.push(tcard);
            this.question_order.push(this.cards.length - 1);
            //console.log(tcard);
          }
          this.refreshQuestions();
          this.saveData();
          if (this.cards.length < this.seed_number) {
            this.add_count = this.seed_number - this.cards.length;
            this.add_card();
          }
        }
      }

      Http.send();

    },
    calculateDifference: function(str1, str2) {

      const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
      for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
      }
      for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
      }
      for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          track[j][i] = Math.min(
            track[j][i - 1] + 1, // deletion
            track[j - 1][i] + 1, // insertion
            track[j - 1][i - 1] + indicator, // substitution
          );
        }
      }
      return track[str2.length][str1.length];
    },
  },
});
