# Trace
UserAuthentication.register { username: 'MichaelFan3', password: 'pw' } => { user: '019a7109-e433-7c0a-99e2-75dc5f11352d' }
Library.addUser { user: '019a7109-e433-7c0a-99e2-75dc5f11352d' } => {}
UserAuthentication.authenticate { username: 'MichaelFan3', password: 'pw' } => { user: '019a7109-e433-7c0a-99e2-75dc5f11352d' }
[Requesting] Received request for path: /Library/_getAllUserVersions
[Requesting] Received request for path: /Library/addUser
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  path: '/Library/_getAllUserVersions'
} => { request: '019a7109-f0cb-75ab-a205-a1f8d5f109f0' }
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  path: '/Library/addUser'
} => { request: '019a7109-f0e6-7279-82bc-76c3a5dc90ce' }
Requesting.respond { request: '019a7109-f0cb-75ab-a205-a1f8d5f109f0', versions: [] } => { request: '019a7109-f0cb-75ab-a205-a1f8d5f109f0' }
[Requesting] Error processing request: Request 019a7109-f0e6-7279-82bc-76c3a5dc90ce timed out after 10000ms
[Requesting] Received request for path: /Library/_getAllUserVersions
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  path: '/Library/_getAllUserVersions'
} => { request: '019a710a-19f1-7200-9934-265d0555e9fb' }
Requesting.respond { request: '019a710a-19f1-7200-9934-265d0555e9fb', versions: [] } => { request: '019a710a-19f1-7200-9934-265d0555e9fb' }
[Requesting] Received request for path: /Library/submitNewFic
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  ficText: 'The Hallway Never Ends\n' +
    '\n' +
    "Michael's laughter echoed through the impossible corridor, each giggle bouncing off walls that shouldn't exist at angles that made your eyes hurt to perceive.\n" +
    '\n' +
    `"Lost, are we?" The voice came from everywhere and nowhere, fractured like light through a kaleidoscope. "How delightful! Though I suppose 'lost' implies there was ever a 'found' to begin with."\n` +
    '\n' +
    'The hallway stretched infinitely in both directions—or was it spiraling? It was so hard to tell. The doors multiplied with each blink: oak, mahogany, one that seemed to be made of screaming faces, another that was definitely breathing.\n' +
    '\n' +
    '"Which door leads out?" The question escaped before rational thought could stop it.\n' +
    '\n' +
    `Michael's form coalesced from the wallpaper itself, all wrong angles and too-wide grin. "Out? OUT?!" The thing that was and wasn't Michael threw its head back in delight. "My dear, confused little thing—they ALL lead out. None of them lead out. Does it matter? The real question is: did you ever actually come IN?"\n` +
    '\n' +
    'The hallway laughed. Or maybe that was Michael. Or maybe there was no difference anymore.\n' +
    '\n' +
    `"I do so love it when they ask questions," Michael whispered, already dissolving back into the geometry. "It means they're starting to understand they never knew the answers to begin with."`,
  ficName: 'The Hallway Never Ends',
  authorTags: 'horror\n' +
    'psychological horror\n' +
    'spiral\n' +
    'madness\n' +
    'liminal spaces\n' +
    'cosmic horror\n' +
    'destiel\n' +
    'doomguy\n' +
    'the creature\n' +
    'my little pony\n' +
    'this is the best fic ever\n' +
    'this is the worst fic ever\n' +
    'cringe\n' +
    'pog\n' +
    'etcetera',
  date: { day: 10, month: 11, year: 2025 },
  path: '/Library/submitNewFic'
} => { request: '019a710a-40ab-7823-a63b-c05143747227' }
Library.submitNewFic {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  ficText: 'The Hallway Never Ends\n' +
    '\n' +
    "Michael's laughter echoed through the impossible corridor, each giggle bouncing off walls that shouldn't exist at angles that made your eyes hurt to perceive.\n" +
    '\n' +
    `"Lost, are we?" The voice came from everywhere and nowhere, fractured like light through a kaleidoscope. "How delightful! Though I suppose 'lost' implies there was ever a 'found' to begin with."\n` +
    '\n' +
    'The hallway stretched infinitely in both directions—or was it spiraling? It was so hard to tell. The doors multiplied with each blink: oak, mahogany, one that seemed to be made of screaming faces, another that was definitely breathing.\n' +
    '\n' +
    '"Which door leads out?" The question escaped before rational thought could stop it.\n' +
    '\n' +
    `Michael's form coalesced from the wallpaper itself, all wrong angles and too-wide grin. "Out? OUT?!" The thing that was and wasn't Michael threw its head back in delight. "My dear, confused little thing—they ALL lead out. None of them lead out. Does it matter? The real question is: did you ever actually come IN?"\n` +
    '\n' +
    'The hallway laughed. Or maybe that was Michael. Or maybe there was no difference anymore.\n' +
    '\n' +
    `"I do so love it when they ask questions," Michael whispered, already dissolving back into the geometry. "It means they're starting to understand they never knew the answers to begin with."`,
  ficName: 'The Hallway Never Ends',
  authorTags: 'horror\n' +
    'psychological horror\n' +
    'spiral\n' +
    'madness\n' +
    'liminal spaces\n' +
    'cosmic horror\n' +
    'destiel\n' +
    'doomguy\n' +
    'the creature\n' +
    'my little pony\n' +
    'this is the best fic ever\n' +
    'this is the worst fic ever\n' +
    'cringe\n' +
    'pog\n' +
    'etcetera',
  date: { day: 10, month: 11, year: 2025 }
} => { ficId: '019a710a-4132-7a4d-aa9e-94c10b622f76' }
Categorizing.categorizeFic {
  ficId: '019a710a-4132-7a4d-aa9e-94c10b622f76',
  ficText: 'The Hallway Never Ends\n' +
    '\n' +
    "Michael's laughter echoed through the impossible corridor, each giggle bouncing off walls that shouldn't exist at angles that made your eyes hurt to perceive.\n" +
    '\n' +
    `"Lost, are we?" The voice came from everywhere and nowhere, fractured like light through a kaleidoscope. "How delightful! Though I suppose 'lost' implies there was ever a 'found' to begin with."\n` +
    '\n' +
    'The hallway stretched infinitely in both directions—or was it spiraling? It was so hard to tell. The doors multiplied with each blink: oak, mahogany, one that seemed to be made of screaming faces, another that was definitely breathing.\n' +
    '\n' +
    '"Which door leads out?" The question escaped before rational thought could stop it.\n' +
    '\n' +
    `Michael's form coalesced from the wallpaper itself, all wrong angles and too-wide grin. "Out? OUT?!" The thing that was and wasn't Michael threw its head back in delight. "My dear, confused little thing—they ALL lead out. None of them lead out. Does it matter? The real question is: did you ever actually come IN?"\n` +
    '\n' +
    'The hallway laughed. Or maybe that was Michael. Or maybe there was no difference anymore.\n' +
    '\n' +
    `"I do so love it when they ask questions," Michael whispered, already dissolving back into the geometry. "It means they're starting to understand they never knew the answers to begin with."`,
  authorTags: 'horror\n' +
    'psychological horror\n' +
    'spiral\n' +
    'madness\n' +
    'liminal spaces\n' +
    'cosmic horror\n' +
    'destiel\n' +
    'doomguy\n' +
    'the creature\n' +
    'my little pony\n' +
    'this is the best fic ever\n' +
    'this is the worst fic ever\n' +
    'cringe\n' +
    'pog\n' +
    'etcetera'
} => { ficId: '019a710a-4132-7a4d-aa9e-94c10b622f76' }
Requesting.respond {
  request: '019a710a-40ab-7823-a63b-c05143747227',
  ficId: '019a710a-4132-7a4d-aa9e-94c10b622f76'
} => { request: '019a710a-40ab-7823-a63b-c05143747227' }
[Requesting] Received request for path: /Library/_getAllUserVersions
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  path: '/Library/_getAllUserVersions'
} => { request: '019a710a-52d9-7bfc-a8bd-f5bb57d720b0' }
Requesting.respond {
  request: '019a710a-52d9-7bfc-a8bd-f5bb57d720b0',
  versions: [
    {
      _id: '019a710a-4132-70f6-be61-b7867be9783d',
      title: 'The Hallway Never Ends',
      fics: [Array]
    }
  ]
} => { request: '019a710a-52d9-7bfc-a8bd-f5bb57d720b0' }
[Requesting] Received request for path: /Library/_viewFic
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  ficName: 'The Hallway Never Ends',
  versionNumber: 0,
  path: '/Library/_viewFic'
} => { request: '019a710a-5d84-7da8-9587-f39241e46f0f' }
Requesting.respond {
  request: '019a710a-5d84-7da8-9587-f39241e46f0f',
  fic: {
    _id: '019a710a-4132-7a4d-aa9e-94c10b622f76',
    name: 'The Hallway Never Ends',
    text: 'The Hallway Never Ends\n' +
      '\n' +
      "Michael's laughter echoed through the impossible corridor, each giggle bouncing off walls that shouldn't exist at angles that made your eyes hurt to perceive.\n" +
      '\n' +
      `"Lost, are we?" The voice came from everywhere and nowhere, fractured like light through a kaleidoscope. "How delightful! Though I suppose 'lost' implies there was ever a 'found' to begin with."\n` +
      '\n' +
      'The hallway stretched infinitely in both directions—or was it spiraling? It was so hard to tell. The doors multiplied with each blink: oak, mahogany, one that seemed to be made of screaming faces, another that was definitely breathing.\n' +
      '\n' +
      '"Which door leads out?" The question escaped before rational thought could stop it.\n' +
      '\n' +
      `Michael's form coalesced from the wallpaper itself, all wrong angles and too-wide grin. "Out? OUT?!" The thing that was and wasn't Michael threw its head back in delight. "My dear, confused little thing—they ALL lead out. None of them lead out. Does it matter? The real question is: did you ever actually come IN?"\n` +
      '\n' +
      'The hallway laughed. Or maybe that was Michael. Or maybe there was no difference anymore.\n' +
      '\n' +
      `"I do so love it when they ask questions," Michael whispered, already dissolving back into the geometry. "It means they're starting to understand they never knew the answers to begin with."`,
    authorTags: 'horror\n' +
      'psychological horror\n' +
      'spiral\n' +
      'madness\n' +
      'liminal spaces\n' +
      'cosmic horror\n' +
      'destiel\n' +
      'doomguy\n' +
      'the creature\n' +
      'my little pony\n' +
      'this is the best fic ever\n' +
      'this is the worst fic ever\n' +
      'cringe\n' +
      'pog\n' +
      'etcetera',
    date: { day: 10, month: 11, year: 2025 },
    versionNumber: 0
  }
} => { request: '019a710a-5d84-7da8-9587-f39241e46f0f' }
[Requesting] Received request for path: /Categorizing/_viewFicCategory
Requesting.request {
  ficId: '019a710a-4132-7a4d-aa9e-94c10b622f76',
  path: '/Categorizing/_viewFicCategory'
} => { request: '019a710a-5f5a-7a02-b4ec-0d61dc61f963' }
Requesting.respond {
  request: '019a710a-5f5a-7a02-b4ec-0d61dc61f963',
  ficCategory: [
    {
      _id: '019a710a-4132-7a4d-aa9e-94c10b622f76',
      suggestedTags: [Array],
      tagsToRemove: [Array]
    }
  ]
} => { request: '019a710a-5f5a-7a02-b4ec-0d61dc61f963' }
[Requesting] Received request for path: /Library/submitNewVersionOfFanfic
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  ficText: '"heh. nice hallway you got here." \n' +
    '\n' +
    "Michael's spiraling form froze mid-twist. In all the eons of lying and unmaking, nothing had ever simply... walked in. Especially not a skeleton in a blue hoodie, hands shoved deep in his pockets, grinning like he owned the place.\n" +
    '\n' +
    `"You—" Michael's voice cracked like breaking mirrors, "—you shouldn't be able to exist here. This is MY domain. The Spiral doesn't—"\n` +
    '\n' +
    `"doesn't make sense? yeah, i noticed." Sans shrugged, somehow completely unfazed by the geometry that was actively trying to make his bones bend in directions bones definitely shouldn't bend. "pretty *humerus* actually. though i gotta say, the whole 'infinite corridor' thing? kinda been there, done that."\n` +
    '\n' +
    'The hallway shrieked. Or maybe that was Michael. The distinction was becoming harder to maintain.\n' +
    '\n' +
    `"You're not AFRAID?" Each word dripped with fractured confusion.\n` +
    '\n' +
    `"buddy, i've seen the end of the world more times than i can count. which is saying something, 'cause i'm really good at counting. one, one, one..." Sans's grin never wavered. "besides, you're not the first mysterious entity who thinks doorways and corridors are the height of psychological horror."\n` +
    '\n' +
    'Michael coalesced fully now, towering over the small skeleton with impossible angles and too many teeth. "Then what DO you fear, little comedian?"\n' +
    '\n' +
    `Sans's left eye flared blue for just a moment. "running out of ketchup, mostly. that, and not being able to protect the people i care about. but mostly the ketchup thing."\n` +
    '\n' +
    'For the first time in forever, Michael the Distortion laughed—genuinely laughed—not the cruel giggle of madness, but something almost like surprise.\n' +
    '\n' +
    '"You know what? I like you. Which door do you want?"\n' +
    '\n' +
    `"the one that leads to grillby's. i'm starving."\n` +
    '\n' +
    "Impossibly, one of the doors became a door to Grillby's.\n" +
    '\n' +
    `"huh. thanks, pal." Sans paused at the threshold. "you should come by sometime. tell jokes. you'd kill at open mic night." He winked. "get it? kill?"\n` +
    '\n' +
    'The hallway stopped laughing.\n' +
    '\n' +
    'Sans was already gone.\n' +
    '\n' +
    'Michael stood alone in the corridor, feeling something uncomfortably close to fondness. How delightfully spiral. How wonderfully impossible.\n' +
    '\n' +
    'A skeleton who told puns had just out-stranged The Distortion itself.',
  authorTags: 'crossover\n' +
    'sans\n' +
    'comedy\n' +
    'cosmic horror meets puns\n' +
    'michael distortion\n' +
    'the magnus archives\n' +
    'multiverse\n' +
    'unlikely friendships\n' +
    'romance\n' +
    'terrible fic\n' +
    'great fic\n' +
    'destiel',
  versionTitle: 'The Hallway Never Ends',
  date: { day: 11, month: 11, year: 2025 },
  ficName: 'The Hallway Never Ends',
  path: '/Library/submitNewVersionOfFanfic'
} => { request: '019a710b-1154-77ed-b1bc-7a42b0073960' }
Library.submitNewVersionOfFanfic {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  ficText: '"heh. nice hallway you got here." \n' +
    '\n' +
    "Michael's spiraling form froze mid-twist. In all the eons of lying and unmaking, nothing had ever simply... walked in. Especially not a skeleton in a blue hoodie, hands shoved deep in his pockets, grinning like he owned the place.\n" +
    '\n' +
    `"You—" Michael's voice cracked like breaking mirrors, "—you shouldn't be able to exist here. This is MY domain. The Spiral doesn't—"\n` +
    '\n' +
    `"doesn't make sense? yeah, i noticed." Sans shrugged, somehow completely unfazed by the geometry that was actively trying to make his bones bend in directions bones definitely shouldn't bend. "pretty *humerus* actually. though i gotta say, the whole 'infinite corridor' thing? kinda been there, done that."\n` +
    '\n' +
    'The hallway shrieked. Or maybe that was Michael. The distinction was becoming harder to maintain.\n' +
    '\n' +
    `"You're not AFRAID?" Each word dripped with fractured confusion.\n` +
    '\n' +
    `"buddy, i've seen the end of the world more times than i can count. which is saying something, 'cause i'm really good at counting. one, one, one..." Sans's grin never wavered. "besides, you're not the first mysterious entity who thinks doorways and corridors are the height of psychological horror."\n` +
    '\n' +
    'Michael coalesced fully now, towering over the small skeleton with impossible angles and too many teeth. "Then what DO you fear, little comedian?"\n' +
    '\n' +
    `Sans's left eye flared blue for just a moment. "running out of ketchup, mostly. that, and not being able to protect the people i care about. but mostly the ketchup thing."\n` +
    '\n' +
    'For the first time in forever, Michael the Distortion laughed—genuinely laughed—not the cruel giggle of madness, but something almost like surprise.\n' +
    '\n' +
    '"You know what? I like you. Which door do you want?"\n' +
    '\n' +
    `"the one that leads to grillby's. i'm starving."\n` +
    '\n' +
    "Impossibly, one of the doors became a door to Grillby's.\n" +
    '\n' +
    `"huh. thanks, pal." Sans paused at the threshold. "you should come by sometime. tell jokes. you'd kill at open mic night." He winked. "get it? kill?"\n` +
    '\n' +
    'The hallway stopped laughing.\n' +
    '\n' +
    'Sans was already gone.\n' +
    '\n' +
    'Michael stood alone in the corridor, feeling something uncomfortably close to fondness. How delightfully spiral. How wonderfully impossible.\n' +
    '\n' +
    'A skeleton who told puns had just out-stranged The Distortion itself.',
  authorTags: 'crossover\n' +
    'sans\n' +
    'comedy\n' +
    'cosmic horror meets puns\n' +
    'michael distortion\n' +
    'the magnus archives\n' +
    'multiverse\n' +
    'unlikely friendships\n' +
    'romance\n' +
    'terrible fic\n' +
    'great fic\n' +
    'destiel',
  versionTitle: 'The Hallway Never Ends',
  date: { day: 11, month: 11, year: 2025 },
  ficName: 'The Hallway Never Ends'
} => { versionId: '019a710b-11e8-73be-bb30-fc778d8fed8e' }
Categorizing.categorizeFic {
  ficId: '019a710b-11e8-73be-bb30-fc778d8fed8e',
  ficText: '"heh. nice hallway you got here." \n' +
    '\n' +
    "Michael's spiraling form froze mid-twist. In all the eons of lying and unmaking, nothing had ever simply... walked in. Especially not a skeleton in a blue hoodie, hands shoved deep in his pockets, grinning like he owned the place.\n" +
    '\n' +
    `"You—" Michael's voice cracked like breaking mirrors, "—you shouldn't be able to exist here. This is MY domain. The Spiral doesn't—"\n` +
    '\n' +
    `"doesn't make sense? yeah, i noticed." Sans shrugged, somehow completely unfazed by the geometry that was actively trying to make his bones bend in directions bones definitely shouldn't bend. "pretty *humerus* actually. though i gotta say, the whole 'infinite corridor' thing? kinda been there, done that."\n` +
    '\n' +
    'The hallway shrieked. Or maybe that was Michael. The distinction was becoming harder to maintain.\n' +
    '\n' +
    `"You're not AFRAID?" Each word dripped with fractured confusion.\n` +
    '\n' +
    `"buddy, i've seen the end of the world more times than i can count. which is saying something, 'cause i'm really good at counting. one, one, one..." Sans's grin never wavered. "besides, you're not the first mysterious entity who thinks doorways and corridors are the height of psychological horror."\n` +
    '\n' +
    'Michael coalesced fully now, towering over the small skeleton with impossible angles and too many teeth. "Then what DO you fear, little comedian?"\n' +
    '\n' +
    `Sans's left eye flared blue for just a moment. "running out of ketchup, mostly. that, and not being able to protect the people i care about. but mostly the ketchup thing."\n` +
    '\n' +
    'For the first time in forever, Michael the Distortion laughed—genuinely laughed—not the cruel giggle of madness, but something almost like surprise.\n' +
    '\n' +
    '"You know what? I like you. Which door do you want?"\n' +
    '\n' +
    `"the one that leads to grillby's. i'm starving."\n` +
    '\n' +
    "Impossibly, one of the doors became a door to Grillby's.\n" +
    '\n' +
    `"huh. thanks, pal." Sans paused at the threshold. "you should come by sometime. tell jokes. you'd kill at open mic night." He winked. "get it? kill?"\n` +
    '\n' +
    'The hallway stopped laughing.\n' +
    '\n' +
    'Sans was already gone.\n' +
    '\n' +
    'Michael stood alone in the corridor, feeling something uncomfortably close to fondness. How delightfully spiral. How wonderfully impossible.\n' +
    '\n' +
    'A skeleton who told puns had just out-stranged The Distortion itself.',
  authorTags: 'crossover\n' +
    'sans\n' +
    'comedy\n' +
    'cosmic horror meets puns\n' +
    'michael distortion\n' +
    'the magnus archives\n' +
    'multiverse\n' +
    'unlikely friendships\n' +
    'romance\n' +
    'terrible fic\n' +
    'great fic\n' +
    'destiel'
} => { ficId: '019a710b-11e8-73be-bb30-fc778d8fed8e' }
Requesting.respond {
  request: '019a710b-1154-77ed-b1bc-7a42b0073960',
  versionId: '019a710b-11e8-73be-bb30-fc778d8fed8e'
} => { request: '019a710b-1154-77ed-b1bc-7a42b0073960' }
[Requesting] Received request for path: /Library/_getAllUserVersions
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  path: '/Library/_getAllUserVersions'
} => { request: '019a710b-223b-72e1-8dc5-000d8de8b98d' }
Requesting.respond {
  request: '019a710b-223b-72e1-8dc5-000d8de8b98d',
  versions: [
    {
      _id: '019a710a-4132-70f6-be61-b7867be9783d',
      title: 'The Hallway Never Ends',
      fics: [Array]
    }
  ]
} => { request: '019a710b-223b-72e1-8dc5-000d8de8b98d' }
[Requesting] Received request for path: /Library/_viewFic
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  ficName: 'The Hallway Never Ends',
  versionNumber: 1,
  path: '/Library/_viewFic'
} => { request: '019a710b-29ab-7f95-890a-e49ee6baaada' }
Requesting.respond {
  request: '019a710b-29ab-7f95-890a-e49ee6baaada',
  fic: {
    _id: '019a710b-11e8-73be-bb30-fc778d8fed8e',
    name: 'The Hallway Never Ends',
    text: '"heh. nice hallway you got here." \n' +
      '\n' +
      "Michael's spiraling form froze mid-twist. In all the eons of lying and unmaking, nothing had ever simply... walked in. Especially not a skeleton in a blue hoodie, hands shoved deep in his pockets, grinning like he owned the place.\n" +
      '\n' +
      `"You—" Michael's voice cracked like breaking mirrors, "—you shouldn't be able to exist here. This is MY domain. The Spiral doesn't—"\n` +
      '\n' +
      `"doesn't make sense? yeah, i noticed." Sans shrugged, somehow completely unfazed by the geometry that was actively trying to make his bones bend in directions bones definitely shouldn't bend. "pretty *humerus* actually. though i gotta say, the whole 'infinite corridor' thing? kinda been there, done that."\n` +
      '\n' +
      'The hallway shrieked. Or maybe that was Michael. The distinction was becoming harder to maintain.\n' +
      '\n' +
      `"You're not AFRAID?" Each word dripped with fractured confusion.\n` +
      '\n' +
      `"buddy, i've seen the end of the world more times than i can count. which is saying something, 'cause i'm really good at counting. one, one, one..." Sans's grin never wavered. "besides, you're not the first mysterious entity who thinks doorways and corridors are the height of psychological horror."\n` +
      '\n' +
      'Michael coalesced fully now, towering over the small skeleton with impossible angles and too many teeth. "Then what DO you fear, little comedian?"\n' +
      '\n' +
      `Sans's left eye flared blue for just a moment. "running out of ketchup, mostly. that, and not being able to protect the people i care about. but mostly the ketchup thing."\n` +
      '\n' +
      'For the first time in forever, Michael the Distortion laughed—genuinely laughed—not the cruel giggle of madness, but something almost like surprise.\n' +
      '\n' +
      '"You know what? I like you. Which door do you want?"\n' +
      '\n' +
      `"the one that leads to grillby's. i'm starving."\n` +
      '\n' +
      "Impossibly, one of the doors became a door to Grillby's.\n" +
      '\n' +
      `"huh. thanks, pal." Sans paused at the threshold. "you should come by sometime. tell jokes. you'd kill at open mic night." He winked. "get it? kill?"\n` +
      '\n' +
      'The hallway stopped laughing.\n' +
      '\n' +
      'Sans was already gone.\n' +
      '\n' +
      'Michael stood alone in the corridor, feeling something uncomfortably close to fondness. How delightfully spiral. How wonderfully impossible.\n' +
      '\n' +
      'A skeleton who told puns had just out-stranged The Distortion itself.',
    authorTags: 'crossover\n' +
      'sans\n' +
      'comedy\n' +
      'cosmic horror meets puns\n' +
      'michael distortion\n' +
      'the magnus archives\n' +
      'multiverse\n' +
      'unlikely friendships\n' +
      'romance\n' +
      'terrible fic\n' +
      'great fic\n' +
      'destiel',
    date: { day: 11, month: 11, year: 2025 },
    versionNumber: 1
  }
} => { request: '019a710b-29ab-7f95-890a-e49ee6baaada' }
[Requesting] Received request for path: /Categorizing/_viewFicCategory
Requesting.request {
  ficId: '019a710b-11e8-73be-bb30-fc778d8fed8e',
  path: '/Categorizing/_viewFicCategory'
} => { request: '019a710b-2b64-7513-917a-bcc06dfc8a44' }
Requesting.respond {
  request: '019a710b-2b64-7513-917a-bcc06dfc8a44',
  ficCategory: [
    {
      _id: '019a710b-11e8-73be-bb30-fc778d8fed8e',
      suggestedTags: [Array],
      tagsToRemove: [Array]
    }
  ]
} => { request: '019a710b-2b64-7513-917a-bcc06dfc8a44' }
[Requesting] Received request for path: /Library/deleteFic
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  ficName: 'The Hallway Never Ends',
  versionNumber: 1,
  path: '/Library/deleteFic'
} => { request: '019a710b-b965-7389-acbf-e9184238368b' }
Library.deleteFic {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  ficName: 'The Hallway Never Ends',
  versionNumber: 1
} => { ficId: '019a710b-11e8-73be-bb30-fc778d8fed8e' }
Categorizing.deleteFicCategory { ficId: '019a710b-11e8-73be-bb30-fc778d8fed8e' } => { ficCategoryId: '019a710b-11e8-73be-bb30-fc778d8fed8e' }
Requesting.respond {
  request: '019a710b-b965-7389-acbf-e9184238368b',
  ficId: '019a710b-11e8-73be-bb30-fc778d8fed8e'
} => { request: '019a710b-b965-7389-acbf-e9184238368b' }
[Requesting] Received request for path: /Categorizing/deleteFicCategory
Requesting.request {
  ficId: '019a710b-11e8-73be-bb30-fc778d8fed8e',
  path: '/Categorizing/deleteFicCategory'
} => { request: '019a710b-c378-7afb-8186-d0a2e2e08470' }
[Requesting] Error processing request: Request 019a710b-c378-7afb-8186-d0a2e2e08470 timed out after 10000ms
[Requesting] Received request for path: /Library/_getAllUserVersions
Requesting.request {
  user: '019a7109-e433-7c0a-99e2-75dc5f11352d',
  path: '/Library/_getAllUserVersions'
} => { request: '019a710b-eba7-700c-9f85-7a2a51c2164c' }
Requesting.respond {
  request: '019a710b-eba7-700c-9f85-7a2a51c2164c',
  versions: [
    {
      _id: '019a710a-4132-70f6-be61-b7867be9783d',
      title: 'The Hallway Never Ends',
      fics: [Array]
    }
  ]
} => { request: '019a710b-eba7-700c-9f85-7a2a51c2164c' }
