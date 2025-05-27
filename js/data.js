// js/data.js

// Function to generate times table lessons (could be expanded)
function generateTimesTableLesson(yearPrefix, num) {
  let material = `<p>Let's learn the <strong>${num} times table</strong>!</p><ul>`;
  for (let i = 1; i <= 12; i++) material += `<li>${i} x ${num} = ${i * num}</li>`;
  material += `</ul><p>Practice makes perfect!</p>`;
  let quiz = [];
  let answersPool = [];
  for(let i=1; i<=12; i++) { answersPool.push(i*num); }
  for(let i=1; i<=12; i++) {
      if(num > 1) answersPool.push(i*num + (Math.random() < 0.5 ? 1 : -1)* (Math.ceil(Math.random()*2)));
      answersPool.push(i*(num+1));
      if (num > 2) answersPool.push(i*(num-1));
  }
  answersPool = [...new Set(answersPool)].filter(ans => ans > 0 && ans < 150).sort(() => 0.5 - Math.random());

  for (let i = 0; i < 8; i++) {
      let multiplier = Math.ceil(Math.random() * 12);
      let correctAnswer = multiplier * num;
      let options = [correctAnswer.toString()];
      let attempts = 0;
      while (options.length < 4 && attempts < 50) {
          let wrongAnswerPoolIndex = Math.floor(Math.random() * answersPool.length);
          let wrongAnswer = answersPool[wrongAnswerPoolIndex].toString();
          if (!options.includes(wrongAnswer) && wrongAnswer !== correctAnswer.toString()) {
              options.push(wrongAnswer);
          }
          attempts++;
      }
      while(options.length < 4) options.push((parseInt(options[0] || '0') + options.length + Math.ceil(Math.random()*5)).toString());

      quiz.push({
          question: `What is ${multiplier} x ${num}?`,
          options: options.sort(() => 0.5 - Math.random()),
          answer: correctAnswer.toString(),
          type: 'radio'
      });
  }
  return {
      id: `${yearPrefix}_tt_${num}`, title: `${num} Times Table`, icon: 'images/times_table_icon.svg',
      type: 'lesson', learningMaterial: material, quiz: quiz, completed: false
  };
}


// Main application data structure
const appData = [
  {
      id: 'year3', title: 'Year 3', icon: 'images/category_maths.svg', type: 'year_group', // Icon change: No specific year icons for cards
      children: [
          {
              id: 'y3_maths', title: 'Mathematics', icon: 'images/category_maths.svg', type: 'subject',
              children: [
                  {
                      id: 'y3_times_tables_category', title: 'Times Tables', icon: 'images/times_table_icon.svg', type: 'category',
                      children: [] // Populated below
                  },
                  {
                      id: 'y3_fractions', title: 'Fractions (Intro)', icon: 'images/fractions_icon.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Fractions tell us about parts of a whole. Let's explore!</p>
                          <div id="interactiveFractionExplorer">
                              <!-- The interactive circle will be rendered here by JavaScript -->
                          </div>
                          <p><strong>Denominator:</strong> The bottom number of a fraction. It tells us how many equal parts the whole is divided into.</p>
                          <p><strong>Numerator:</strong> The top number of a fraction. It tells us how many of those equal parts we have.</p>
                          <hr>
                          <h3>What Fraction Is This?</h3>
                          <div id="fractionImageQuizArea">
                              <!-- Static fraction images and questions will be added here or managed by quizManager -->
                          </div>
                      `,
                      quiz: [
                          { type: 'radio', question: "If a pizza is cut into 10 slices, what fraction is 1 slice?", options: ["1/5", "1/10", "10/1", "1/2"], answer: "1/10" },
                          { type: 'radio', question: "Which of these is a UNIT fraction?", options: ["3/5", "1/8", "7/10", "2/2"], answer: "1/8" },
                          { type: 'radio', question: "What is 3/10 + 4/10?", options: ["7/20", "1/10", "7/10", "12/100"], answer: "7/10" },
                          { type: 'radio', question: "Which fraction means 'three quarters'?", options: ["1/4", "3/4", "4/3", "3/10"], answer: "3/4" },
                          { type: 'radio', question: "If you eat 2/5 of a cake, how much is left?", options: ["1/5", "3/5", "5/2", "2/5"], answer: "3/5" },
                          { type: 'radio', question: "What is 5/9 - 2/9?", options: ["3/0", "7/9", "3/9", "3/18"], answer: "3/9" }
                      ],
                      completed: false
                  }
              ]
          },
          {
              id: 'y3_english', title: 'English', icon: 'images/category_english.svg', type: 'subject',
              children: [
                  {
                      id: 'y3_nouns_verbs', title: 'Nouns & Verbs', icon: 'images/book.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Let's learn about two important types of words: <strong>Nouns</strong> and <strong>Verbs</strong>!</p>
                          <p><strong>Nouns</strong> are naming words. They name a Person (e.g., teacher, Sam), Place (e.g., school, park), Thing (e.g., book, car), or Idea (e.g., happiness).</p>
                          <p><strong>Verbs</strong> are doing or being words. They show an Action (run, jump, eat) or a State of Being (is, am, are).</p>
                      `,
                      quiz: [
                          { type: 'radio', question: "'The <strong>dog</strong> barked.' What is 'dog'?", options: ["Verb", "Adjective", "Noun", "Adverb"], answer: "Noun" },
                          { type: 'radio', question: "'She <strong>sings</strong> beautifully.' What is 'sings'?", options: ["Noun", "Verb", "Preposition", "Adjective"], answer: "Verb" },
                          {
                              type: 'drag_and_drop_match',
                              question: "Drag the words to the correct boxes:",
                              categories: [
                                  { id: "noun_box", name: "Nouns (Naming Words)" },
                                  { id: "verb_box", name: "Verbs (Doing/Being Words)" }
                              ],
                              items: [
                                  { id: "dnd_item_cat", text: "cat", correctCategory: "noun_box" },
                                  { id: "dnd_item_jump", text: "jump", correctCategory: "verb_box" },
                                  { id: "dnd_item_school", text: "school", correctCategory: "noun_box" },
                                  { id: "dnd_item_sing", text: "sing", correctCategory: "verb_box" },
                                  { id: "dnd_item_teacher", text: "teacher", correctCategory: "noun_box" },
                                  { id: "dnd_item_read", text: "read", correctCategory: "verb_box" },
                                  { id: "dnd_item_happiness", text: "happiness", correctCategory: "noun_box" },
                                  { id: "dnd_item_is", text: "is", correctCategory: "verb_box" }
                              ],
                              userAnswers: {}
                          }
                      ],
                      completed: false
                  },
                  {
                      id: 'y3_punctuation', title: 'Basic Punctuation', icon: 'images/punctuation_icon.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Punctuation helps us understand writing!</p>
                          <ul>
                              <li><strong>Capital Letters:</strong> Start sentences, for names (Sarah), places (London), 'I'.</li>
                              <li><strong>Full Stop (.):</strong> Ends a statement sentence.</li>
                              <li><strong>Question Mark (?):</strong> Ends a question.</li>
                              <li><strong>Exclamation Mark (!):</strong> Shows strong feeling or surprise.</li>
                              <li><strong>Commas in Lists (,):</strong> Separate items in a list. E.g., I like apples, bananas, and oranges.</li>
                          </ul>
                      `,
                      quiz: [
                          { type: 'radio', question: "What do you put at the end of this sentence: 'What is your name'", options: [".", "!", "?", ","], answer: "?" },
                          { type: 'radio', question: "Which words need a capital letter: 'my friend ben lives in london.'?", options: ["my, ben, london", "ben, london", "my, london", "my, ben"], answer: "my, ben, london" },
                          { type: 'radio', question: "What ends this: 'Wow, that's amazing'", options: [".", "?", "!", ";"], answer: "!" },
                          { type: 'radio', question: "A sentence that tells you something usually ends with a...", options: ["Question Mark", "Full Stop", "Comma", "Exclamation Mark"], answer: "Full Stop" },
                          { type: 'radio', question: "Which punctuation is used to separate items in this list: 'I need milk eggs bread'?", options: [".", "!", "?", ","], answer: "," }
                      ],
                      completed: false
                  }
              ]
          },
          {
              id: 'y3_science', title: 'Science', icon: 'images/category_science.svg', type: 'subject',
              children: [
                  {
                      id: 'y3_plants_parts', title: 'Parts of a Plant', icon: 'images/plant.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Plants have parts with special jobs:</p>
                          <img src="images/plant_diagram.svg" alt="Diagram of a plant" style="max-width: 150px; display: block; margin: 10px auto; border: 1px solid #ccc; padding: 5px; background: #f9f9f9;">
                          <ul>
                              <li><strong>Roots:</strong> Anchor the plant, absorb water & nutrients from the soil.</li>
                              <li><strong>Stem:</strong> Supports the plant, transports water and nutrients to leaves and flowers.</li>
                              <li><strong>Leaves:</strong> Make food for the plant using sunlight, air, and water (photosynthesis).</li>
                              <li><strong>Flowers:</strong> Often colorful, help the plant make seeds to grow new plants (pollination, seed formation).</li>
                          </ul>
                      `,
                      quiz: [
                          { type: 'radio', question: "Which part makes food for the plant?", options: ["Roots", "Stem", "Leaves", "Flower"], answer: "Leaves" },
                          { type: 'radio', question: "What do roots primarily absorb?", options: ["Sunlight", "Air", "Water and Nutrients", "Pollen"], answer: "Water and Nutrients" },
                          { type: 'radio', question: "Which part helps the plant make seeds?", options: ["Stem", "Leaves", "Flower", "Roots"], answer: "Flower" },
                          { type: 'radio', question: "The process leaves use to make food is called:", options: ["Respiration", "Pollination", "Germination", "Photosynthesis"], answer: "Photosynthesis" },
                          { type: 'radio', question: "What is the main job of the stem?", options: ["Make seeds", "Absorb sunlight", "Support and transport", "Attract insects"], answer: "Support and transport" }
                      ],
                      completed: false
                  },
                  {
                      id: 'y3_rocks_types', title: 'Rocks and Fossils', icon: 'images/rocks_icon.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Rocks are all around us! There are different types.</p>
                          <ul>
                              <li><strong>Igneous:</strong> Formed from cooled magma (underground) or lava (above ground) e.g., granite, basalt.</li>
                              <li><strong>Sedimentary:</strong> Formed from layers of sand, shells, pebbles, and other sediments squashed together over time. E.g., sandstone, limestone, shale. Fossils are often found here!</li>
                              <li><strong>Metamorphic:</strong> Formed when other rocks (igneous or sedimentary) are changed by great heat and pressure deep in the Earth. E.g., marble (from limestone), slate (from shale).</li>
                          </ul>
                          <p><strong>Fossils</strong> are the remains or traces of ancient life (plants or animals) preserved in rock, usually sedimentary rock.</p>
                      `,
                      quiz: [
                          { type: 'radio', question: "Which rock type often contains fossils?", options: ["Igneous", "Metamorphic", "Sedimentary", "Crystal"], answer: "Sedimentary" },
                          { type: 'radio', question: "Granite is an example of which rock type?", options: ["Sedimentary", "Igneous", "Metamorphic", "Fossilized"], answer: "Igneous" },
                          { type: 'radio', question: "How are metamorphic rocks formed?", options: ["From lava cooling quickly", "From sea shells compacting", "By existing rocks changed by heat and pressure", "By wind erosion"], answer: "By existing rocks changed by heat and pressure" },
                          { type: 'radio', question: "What are fossils?", options: ["Shiny crystals", "Layers of sand", "Man-made stones", "Remains or traces of ancient life"], answer: "Remains or traces of ancient life" },
                          { type: 'radio', question: "Limestone is a type of _________ rock.", options: ["Igneous", "Sedimentary", "Metamorphic", "Volcanic"], answer: "Sedimentary" }
                      ],
                      completed: false
                  }
              ]
          }
      ]
  },
  {
      id: 'year4', title: 'Year 4', icon: 'images/category_science.svg', type: 'year_group', // Icon change
      children: [
          {
              id: 'y4_maths_subject', title: 'Mathematics', icon: 'images/category_maths.svg', type: 'subject',
              children: [
                  {
                      id: 'y4_decimals_intro', title: 'Introduction to Decimals', icon: 'images/decimals_icon.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Decimals are another way to show parts of a whole, especially when using tenths and hundredths.</p>
                          <p>A <strong>decimal point (.)</strong> separates whole numbers from parts of a number.</p>
                          <p>Example: In <strong>3.4</strong>, '3' is the whole number and '.4' means four tenths (4/10).</p>
                          <ul>
                              <li>0.1 means one tenth (1/10).</li>
                              <li>0.5 means five tenths (5/10 or 1/2).</li>
                              <li>0.01 means one hundredth (1/100).</li>
                              <li>2.7 means two whole ones and seven tenths. In 2.75, the '7' is 7 tenths and '5' is 5 hundredths.</li>
                          </ul>
                          <p>Think of money: £1.50 means 1 whole pound and 50 hundredths of a pound (or 5 tenths).</p>
                      `,
                      quiz: [
                          { type: 'radio', question: "What does the '4' represent in the number 6.42?", options: ["4 ones", "4 tenths", "4 hundredths", "4 tens"], answer: "4 tenths" },
                          { type: 'radio', question: "How would you write 'seven hundredths' as a decimal?", options: ["0.7", "7.0", "0.07", "0.007"], answer: "0.07" },
                          { type: 'radio', question: "Which is larger: 0.8 or 0.18?", options: ["0.8", "0.18", "They are equal"], answer: "0.8" },
                          { type: 'radio', question: "What is 3/10 as a decimal?", options: ["3.0", "0.03", "0.3", "30.0"], answer: "0.3" },
                          { type: 'radio', question: "If a chocolate bar costs £0.75, what does the '7' stand for?", options: ["7 pounds", "7 pence", "7 tenths of a pound (70p)", "7 hundredths of a pence"], answer: "7 tenths of a pound (70p)" },
                          { type: 'radio', question: "What is 1 and 5 tenths written as a decimal?", options: ["1.05", "1.5", "0.15", "15.0"], answer: "1.5" },
                          { type: 'radio', question: "Convert 25/100 to a decimal.", options: ["2.5", "0.025", "0.25", "25.0"], answer: "0.25" }
                      ],
                      completed: false
                  }
              ]
          },
          {
              id: 'y4_english_subject', title: 'English', icon: 'images/category_english.svg', type: 'subject',
              children: [
                   {
                      id: 'y4_apostrophes', title: 'Apostrophes', icon: 'images/punctuation_icon.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Apostrophes (') have two main jobs in Year 4:</p>
                          <ol>
                              <li><strong>Possession (Showing Ownership):</strong> To show something belongs to someone or something.
                                  <ul>
                                      <li>Singular noun: Add 's. Example: <strong>Sarah's</strong> book. (The book belonging to Sarah)</li>
                                      <li>Plural noun ending in s: Add just an apostrophe. Example: The <strong>dogs'</strong> tails. (Tails belonging to many dogs)</li>
                                      <li>Plural noun not ending in s: Add 's. Example: The <strong>children's</strong> toys.</li>
                                  </ul>
                              </li>
                              <li><strong>Contraction (Omission):</strong> To show where letters have been left out when two words are joined.
                                  <ul>
                                      <li>is not → isn<strong>'</strong>t</li>
                                      <li>I am → I<strong>'</strong>m</li>
                                      <li>do not → don<strong>'</strong>t</li>
                                      <li>we will → we<strong>'</strong>ll</li>
                                      <li>cannot → can<strong>'</strong>t</li>
                                  </ul>
                              </li>
                          </ol>
                          <p><strong>Common Mistake:</strong> Don't use apostrophes for simple plurals (e.g., "apple's" for more than one apple is wrong; it should be "apples"). Also, 'its' (belonging to it) has no apostrophe, while 'it's' (it is/it has) does.</p>
                      `,
                      quiz: [
                          { type: 'radio', question: "Which sentence uses an apostrophe for possession correctly for one cat?", options: ["The cats food is in the bowl.", "The cat's food is in the bowl.", "The cats's food is in the bowl."], answer: "The cat's food is in the bowl." },
                          { type: 'radio', question: "What does 'it's' mean in the sentence 'It's a sunny day.'?", options: ["Belonging to it", "It was", "It is", "Plural of it"], answer: "It is" },
                          { type: 'radio', question: "How do you write 'do not' as a contraction?", options: ["do'nt", "dont'", "do'not", "don't"], answer: "don't" },
                          { type: 'radio', question: "The toys belong to the children (plural). How is this written with an apostrophe?", options: ["The childrens' toys.", "The children's toys.", "The childrens toys'."], answer: "The children's toys." },
                          { type: 'radio', question: "Which of these is NOT a reason to use an apostrophe?", options: ["To show possession", "To make a word plural", "To show omitted letters in a contraction"], answer: "To make a word plural" },
                          { type: 'radio', question: "The bikes belong to many boys. How is this written?", options: ["The boy's bikes.", "The boys bikes'.", "The boys' bikes."], answer: "The boys' bikes."},
                          { type: 'radio', question: "Choose the correct sentence: 'The dog wagged (its/it's) tail.'", options: ["The dog wagged it's tail.", "The dog wagged its tail."], answer: "The dog wagged its tail."}
                      ],
                      completed: false
                  }
              ]
          },
          {
              id: 'y4_science_subject', title: 'Science', icon: 'images/category_science.svg', type: 'subject',
              children: [
                  {
                      id: 'y4_magnets', title: 'Magnets', icon: 'images/magnets_icon.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Magnets are fascinating! They have special properties.</p>
                          <ul>
                              <li>Magnets attract (pull towards) certain materials, mainly iron, steel, nickel, and cobalt. These are <strong>magnetic materials</strong>.</li>
                              <li>Materials like wood, plastic, glass, and copper are <strong>non-magnetic</strong>.</li>
                              <li>Every magnet has two <strong>poles</strong>: a North pole (N) and a South pole (S).</li>
                              <li><strong>Like poles repel</strong> (push away): N repels N, S repels S.</li>
                              <li><strong>Opposite poles attract</strong>: N attracts S.</li>
                              <li>A magnetic force can act at a distance (without touching).</li>
                          </ul>
                      `,
                      quiz: [
                          { type: 'radio', question: "Which of these materials is magnetic?", options: ["Wood", "Iron", "Plastic", "Glass"], answer: "Iron" },
                          { type: 'radio', question: "What happens if you bring the North pole of one magnet near the North pole of another?", options: ["They attract", "They repel", "Nothing happens", "They stick together weakly"], answer: "They repel" },
                          { type: 'radio', question: "A magnet has how many poles?", options: ["One", "Two", "Three", "Four"], answer: "Two" },
                          { type: 'radio', question: "If a magnet picks up a paperclip, the paperclip must be made of...", options: ["Rubber", "A magnetic material", "Wood", "Only copper"], answer: "A magnetic material" },
                          { type: 'radio', question: "Which statement is true?", options: ["All metals are magnetic.", "Magnets only attract.", "Opposite poles attract.", "Magnetic force needs contact."], answer: "Opposite poles attract." }
                      ],
                      completed: false
                  },
                  {
                      id: 'y4_solar_system', title: 'Our Solar System (Planets)', icon: 'images/planets_icon.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Our Solar System is made up of the Sun and everything that orbits (travels around) it.</p>
                          <p>The <strong>Sun</strong> is a star at the center.</p>
                          <p>There are <strong>eight planets</strong> that orbit the Sun. From the Sun outwards, they are:</p>
                          <ol>
                              <li><strong>Mercury</strong> (Smallest, closest to Sun)</li>
                              <li><strong>Venus</strong> (Hottest planet)</li>
                              <li><strong>Earth</strong> (Our home, has liquid water)</li>
                              <li><strong>Mars</strong> (The 'Red Planet')</li>
                              <li><strong>Jupiter</strong> (Largest planet, has a Great Red Spot)</li>
                              <li><strong>Saturn</strong> (Known for its beautiful rings)</li>
                              <li><strong>Uranus</strong> (Rotates on its side)</li>
                              <li><strong>Neptune</strong> (Farthest from the Sun, very cold)</li>
                          </ol>
                          <p>An easy way to remember the order: <strong>M</strong>y <strong>V</strong>ery <strong>E</strong>xcellent <strong>M</strong>other <strong>J</strong>ust <strong>S</strong>erved <strong>U</strong>s <strong>N</strong>oodles.</p>
                      `,
                      quiz: [
                          { type: 'radio', question: "Which planet is closest to the Sun?", options: ["Earth", "Venus", "Mercury", "Mars"], answer: "Mercury" },
                          { type: 'radio', question: "Which planet is known as the 'Red Planet'?", options: ["Jupiter", "Saturn", "Mars", "Venus"], answer: "Mars" },
                          { type: 'radio', question: "What is at the center of our Solar System?", options: ["Earth", "The Moon", "The Sun", "Jupiter"], answer: "The Sun" },
                          { type: 'radio', question: "Which is the largest planet in our Solar System?", options: ["Earth", "Saturn", "Neptune", "Jupiter"], answer: "Jupiter" },
                          { type: 'radio', question: "Which planet is famous for its rings?", options: ["Uranus", "Mars", "Saturn", "Venus"], answer: "Saturn" },
                          { type: 'radio', question: "How many planets are in our Solar System?", options: ["7", "8", "9", "10"], answer: "8" }
                      ],
                      completed: false
                  },
                  {
                      id: 'y4_states_of_matter', title: 'States of Matter', icon: 'images/states_of_matter_icon.svg', type: 'lesson',
                      learningMaterial: `
                          <p>Everything around us is made of matter, and matter can exist in different states. The three main states are:</p>
                          <ul>
                              <li><strong>Solid:</strong>
                                  <ul>
                                      <li>Keeps its own shape.</li>
                                      <li>Doesn't flow.</li>
                                      <li>Particles are packed closely together in a regular pattern and vibrate in place.</li>
                                      <li>Examples: Ice, wood, rock, metal.</li>
                                  </ul>
                              </li>
                              <li><strong>Liquid:</strong>
                                  <ul>
                                      <li>Takes the shape of its container.</li>
                                      <li>Can flow.</li>
                                      <li>Particles are close but can move past each other.</li>
                                      <li>Examples: Water, milk, juice, oil.</li>
                                  </ul>
                              </li>
                              <li><strong>Gas:</strong>
                                  <ul>
                                      <li>Spreads out to fill the entire container.</li>
                                      <li>Can flow easily.</li>
                                      <li>Particles are far apart and move quickly in all directions.</li>
                                      <li>Examples: Air, oxygen, steam, helium.</li>
                                  </ul>
                              </li>
                          </ul>
                          <p>Matter can change state, e.g., ice (solid) melts to water (liquid), water boils to steam (gas).</p>
                      `,
                      quiz: [
                          { type: 'radio', question: "Which state of matter keeps its own shape?", options: ["Liquid", "Gas", "Solid", "Plasma"], answer: "Solid" },
                          { type: 'radio', question: "Which state of matter spreads out to fill its entire container?", options: ["Solid", "Liquid", "Gas", "All of them"], answer: "Gas" },
                          { type: 'radio', question: "Water is an example of a:", options: ["Solid", "Liquid", "Gas", "It can be all three"], answer: "It can be all three" },
                          { type: 'radio', question: "In which state are particles packed very closely and vibrate in place?", options: ["Solid", "Liquid", "Gas"], answer: "Solid" },
                          { type: 'radio', question: "When ice melts, it changes from a solid to a ________.", options: ["Gas", "Solid (different type)", "Liquid", "Vapour"], answer: "Liquid" }
                      ],
                      completed: false
                  }
              ]
          }
      ]
  },
  {
      id: 'year5', title: 'Year 5', icon: 'images/year_icon.svg', type: 'year_group', // Placeholder
      children: [ {id: 'y5_placeholder', title: 'Content Coming Soon!', icon: 'images/star_empty.svg', type:'lesson', learningMaterial:'Year 5 topics will appear here.', quiz:[], completed:false}]
  },
  {
      id: 'gcse_foundation', title: 'GCSE Foundation (Beta)', icon: 'images/year_icon.svg', type: 'year_group', // Placeholder
      children: [ {id: 'gcse_placeholder', title: 'Content Coming Soon!', icon: 'images/star_empty.svg', type:'lesson', learningMaterial:'GCSE Foundation topics will appear here.', quiz:[], completed:false}]
  }
];

// Populate Year 3 Times Tables after appData is defined
const y3Maths = appData.find(yg => yg.id === 'year3').children.find(s => s.id === 'y3_maths');
if (y3Maths) {
  const y3TimesTablesCat = y3Maths.children.find(c => c.id === 'y3_times_tables_category');
  if (y3TimesTablesCat) {
      for (let i = 2; i <= 12; i++) {
          y3TimesTablesCat.children.push(generateTimesTableLesson('y3', i));
      }
  }
}

// Export the data
export { appData, generateTimesTableLesson };