# Reflection

## What was hard or easy?

What was easy was figuring out what I wanted to do-- stuff like thinking of problems and concepts was fun and came naturally to me! The implementation of the backend was similarly easy, I've got a ton of experience from 6.102 on creating classes like Categorizing, Library, and UserAuthentication with actions and test cases for them. On the other hand, implementing the frontend and the syncs was a first for me, and was somewhat difficult to get started as I didn't really know where *to* get started. So stuff like getting syncs exactly right and bugfixing them were pretty difficult, especially figuring out exactly *what* is wrong with the sync.

## What went well?

I think my idea formulation and implementation of the backend went well, but I somewhat struggled on implementing the frontend. The integration of my code with LLMs also went well, and in the end, I'm able to submit a prompt, look at it, and think, "Yes! Perfect! That would be a great addition!" I'm proud on how I was able to integrate real AO3 tags with the prompt, not so many that the LLM gets confused, but not so few that the LLM is just making generic guesses without knowing anything about AO3 (that's the original problem! That it's hard to know how to tag without intimate knowledge of how AO3 works!)

## What mistakes did you make, and how would you avoid making them in the future?

I didn't pay close enough attention to what the LLM was doing. LLMs are great at sounding very confident in what they're saying, and I unfortunately ran into the trap of believing what it was doing without double and triple checking. This lead to me discovering last minute that due to a typo and underdetermined outputs, the AI was outputting garbage, and had to fix it in a panic. In the future, I am going to examine what the AI is doing exactly, and be far more scrutinous when examining my test cases, instead of seeing "PASSED", scrolling through the output once, and assuming it all went well.

## What skills did you acquire and which do you feel you still need to develop further?

I acquired some frontend coding knowledge, knowledge on how to code with AI (both in terms of utilizing the AI within my code and helping me code), knowledge of syncs, and knowledge on how to deploy an app. I think I have to research more about frontend coding, as I didn't play around too much with any bells and whistles when it came to design.

## How did you use the Context tool?

I used the Context tool as a starting base-- once I knew exactly what I wanted to do and the instructions on how to do it, I would have Context develop a starter implementation, then tweak it as time went on.

## How did you use an agentic coding tool?

After trying to bugfix myself, I would rely on an agentic coding tool to help me bugfix, as it would be able to see things my eyes would skim over, like typos causing the whole thing to fail.

## What conclusions would you draw about the appropriate role of LLMs in software development?

Of course, AI by itself won't replace programmers, however I do think it is an incredibly useful tool to use alongside coding, for work that is relatively simple and repetitive to implement, like developing tests after you've made a thorough test suite, and going through it fully afterwards to make sure it actually tests things.
