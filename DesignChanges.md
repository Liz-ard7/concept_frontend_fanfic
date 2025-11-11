# Design Changes

Note: When I did design changes, I did them by hand and didn't think to save them to ctx. Instead, I've copied the concepts from previous commits: the first version and the last version.

## Original spec from assignment 2

I fear I created this without the use of context, and didn't think to save it with context, so I've just copied and pasted from the backend.

### Categorizing

**concept** Categorizing [Fic]

**purpose** to categorize an item (i.e. a fanfiction or a tag) into specific categories (i.e. a fanfic will be categorized into a set of tags and a tag will be categorized into a specific category of tag (i.e. fandom, character, warning, rating, relationship, relationshipType, additional)). "Categorizing" can also *remove* tags if deemed necessary.

**principle** A user submits their fanfic and the tags the author has already added to the fanfic. It outputs a list of suggested tags (properly categorized) to add to the story and tells the user if any of their author tags should be removed.

**state**

&nbsp;&nbsp;&nbsp;&nbsp; a set of FicCategories with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; an Fic

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a suggestedTags Category

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a tagsToRemove Category

&nbsp;&nbsp;&nbsp;&nbsp; a Category with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a set of Type strings

&nbsp;&nbsp;&nbsp;&nbsp; a set of TagCategories with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Tag string

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Type string

**actions**

&nbsp;&nbsp;&nbsp;&nbsp; **keywordGenerator** (fic) : (suggestedTags: Category)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** using a LLM, the LLM will examine the fic's ficText's contents, and associates the top 20 most relevant tags (WITHOUT suggesting tags already included in the fic's authorTags) to the content in a suggestedTags Category to the Fic and (if there is not an FicCategory already associated with fic) creates a new FicCategory out of those and adds the FicCategory to the set of FicCategories, or (if there is an FicCategory associated with the fic) adds the suggestedTags to said ficCategory. Finally, it returns the suggestedTags.

&nbsp;&nbsp;&nbsp;&nbsp; **tagCategorization** (tag: String) : (type: String)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** using a LLM, the LLM will categorize a tag into one of these types: fandom, character, warning, rating, relationship, relationshipType, additionalTag. It associates the tag with this type string, and creates a TagCategory out of the tag and type, and adds the TagCategory to the set of TagCategories, and returns the type.

&nbsp;&nbsp;&nbsp;&nbsp; **tagCleaner** (fic) : (tagsToRemove: Category)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** using a LLM, the LLM will examine the fic's ficText's contents, then compare it to each authorTag in the foc's set of authorTags. If an authorTag seems inappropriate for the fic, it will add it to a Category of tags to remove. At the very end, if there is already an ficCategory associated with fic, it will add the tagsToRemove Category to the ficCategory. If not, it'll create a new ficCategory and associate the fic and tagsToRemovewith it, and add it to the set of ficCategories. Finally, it returns the tagsToRemove.

&nbsp;&nbsp;&nbsp;&nbsp; **viewFicCategory** (fic) : (ficCategory)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the fic to be associated with an ficCategory in the set of ficCategories

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** runs tagCategorization on each tag in the fic's suggestedTags and tagsToRemove to properly arrange the tags, associates the categories (still in their separate categories of suggestedTags and tagsToRemove) back to the ficCategory then returns the ficCategory.

&nbsp;&nbsp;&nbsp;&nbsp; **deleteFicCategory** (fic) : (ficCategory)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the fic to be associated with an ficCategory in the set of ficCategories

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** removes the ficCategory associated with the fic from the set of FicCategories.


&nbsp;&nbsp;&nbsp;&nbsp; **deleteFicCategories** (ficCats: set of ficCategories)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** all ficCategories to exist within the set of FicCategories.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** runs deleteFicCategory on all ficCategories in the set of ficCategories.


&nbsp;&nbsp;&nbsp;&nbsp; **viewTagCategory** (tag: String) : (tagCategory)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the tag to be associated with an tagCategory in the set of tagCategories

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** returns the tagCategory associated with the tag.

&nbsp;&nbsp;&nbsp;&nbsp; **deleteTagCategory** (tag: String) : (tagCategory)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the tag to be associated with an tagCategory in the set of tagCategories

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** removes the tagCategory associated with the tag from the set of TagCategories.

---

### Library

**concept** Library [User]

**purpose** to contain a user's fanfics (associated with a name, a text, and a set of authorTags) in an orderly list.

**principle** A user submits a fanfic by inputting its name, text, and set of authorTags into the website. Then, when the user views themselves, they see their new fanfic listed alongside all previous fanfics they've submitted.

**state**

&nbsp;&nbsp;&nbsp;&nbsp; a set of Users with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a set of Fics

&nbsp;&nbsp;&nbsp;&nbsp; an Fic with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Name String

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Text String

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a set of authorTags strings

**actions**

&nbsp;&nbsp;&nbsp;&nbsp; **addUser** (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the user to not exist in the set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** adds user to set of Users


&nbsp;&nbsp;&nbsp;&nbsp; **submitFic** (user, ficText: string, ficName: string, authorTags: set of Strings) : (fic)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the ficName to not exist within the set of the user's Fic's Names. user must exist in set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** create an Fic containing the fic's ficName as Name, ficText as Text, and authorTags as the set of authorTags. Then, add this fic to the user's set of Fics, and finally returns the fic.


&nbsp;&nbsp;&nbsp;&nbsp; **viewFic** (user, ficName: string): (fic)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the ficName to exist within the set of the user's Fic's Names. user must exist in set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** displays the fic's contents corresponding to the user's ficName from the user's set of Fics, then returns the fic.


&nbsp;&nbsp;&nbsp;&nbsp; **deleteFic** (user, ficName: string): (fic)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the ficName to exist within the set of the user's Fic's Names. user must exist in set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** removes the fic corresponding to the user's ficName from the user's set of Fics, then returns the fic.

&nbsp;&nbsp;&nbsp;&nbsp; **deleteFicsAndUser** (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** user must exist in set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** removes all fics from the set of user's Fics, then removes user from set of Users.

---

### UserAuthentication

**concept** UserAuthentication

**purpose** limit access to fanfictions and their stats to known users

**principle** after a user registers with a username and a password,
they can authenticate with that same username and password
and be treated each time as the same user

**state**

&nbsp;&nbsp;&nbsp;&nbsp; a set of Users with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a username

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a password

**actions**

&nbsp;&nbsp;&nbsp;&nbsp; **register** (username: String, password: String): (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the username does not exist

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effects** creates a new User with the username username and password password, adds it to the set of Users, then returns it

&nbsp;&nbsp;&nbsp;&nbsp; **authenticate** (username: String, password: String): (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** requires the username to exist in the set of Users and for said user to have a matching username and password

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effects** returns the User associated with the username and password

&nbsp;&nbsp;&nbsp;&nbsp; **deleteUser** (username: String, password: String): (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the username and the password must match for a user in the set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effects** finds the user that matches with the username and password removes the user from the set of Users and returns it


## Changes from 2 -> 3

1. I added reasons for tag suggestions as it's both a helpful debugging tool for prompt engineering (like when the AI removes a tag unfoundedly, I can see its thought process on doing so and adjust the prompt to avoid such a thing), and because it's helpful to the user on learning more about tagging, like if the user can't understand why to remove a tag and just ends up frusturated because of it.

2. In the actual implementation, I realized that combining keywordGenerator, tagCleaner, and tagCategorization would
probably be for the best, as both can be done at the same time and it is way simpler to do them at the same time than to do them separately and then have to combine them awkwardly. Similarly, I got rid of everything having to do with tags or tag cleaning/categorizing, or viewing tags, as those would be included with the main name of the tag during the keyword generation phase. For instance, previously if you submitted a story with Michael Distortion in it, it would suggest the tag "Michael Distortion", then separately see that Michael Distortion is a character, then classify the tag as a character, adding both as a tagCategory and a ficCategory. Now, instead, it would simply suggest "Michael Distortion (Character)" and add that into the ficCategory. Much simpler all around!


## Changes from 3 -> 4a

### General Design Changes

1. From feedback, I changed the concept design to be more general, not specifically about fanfiction, so that it may be reused later as it is more generalized.

---

### Categorization Design Changes

1. I got rid of the LLM classifying tags in separate functions and as a whole separate aspect of the function itself, as I realized it could all be simplified down into keywordGenerator. Furthermore, as my database contained tag types, I wouldn't need to train it separately either. Just asking the AI to suggest a tag with a type is good enough for it to do that on its own.

2. I added a new type called Tag which contains a name, a type, and a reason, for the LLM to implement in its implementation.

3. I realized that categorizeFic wasn't returning an ID, it was returning a composite object, so I slightly edited the concept, implementation, and test. Same for deleteFicCategories, so I made it return the count instead of a set.

4. I realized authorTags wasn't a primitive nor an ID, so instead I changed it to a string that is split into a list by newlines.

---

### Library Design Changes

1. From feedback to this, I saw my concept was far too "database"-like, and strove to add more capabilities to Library, such as date created and different versions of the same story.

2. After realizing certain things in Library don't return IDs, I made sure they returned IDs. For the actions which couldn't return IDs, I made them into queries instead.

3. I made it so that it only takes in primitives and IDs too, changing authorTags from a set of strings to just a string. That string will be parsed in Categorizing by splitting on newlines.

---

### UserAuthentication Design Changes

1. I did not change anything from UserAuthentication, except for the concept's purpose and principle, due to feedback from Assignment 2 reccommending I make it more generalized, and not so specific to my app, in order to make it more reusable.

## Changes from 4a -> 4b1

1. I realized many of my actions resembled queries rather than actions, such as viewers that return a set of someone's stories, so I reframed those as actions.
2. I changed deleteFicCategories to return a number of how many were deleted rather than a list of those deleted.

## Changes from 4b1 -> 4b2

### Changes to concepts

1. I made queries return arrays of objects, not just objects, in accordance to guidelines for queries.

### Changes to design

![Mort Garson](<my-concept-frontend/Screenshot 2025-10-27 175759.png>)

![Lemon Demon](<my-concept-frontend/Screenshot 2025-10-27 175947.png>)

![Deltarune, Doom, AO3, HGTTG](<my-concept-frontend/Screenshot 2025-10-27 180029.png>)

From the designs, I realized I liked a more sleek feeling to a website, much like Mort Garson's album covers and Lemon Demon's I Am Become Christmas, with lighter weight, cooler colors, and bubbly whites for futurism. However, I also wanted to pay homage to AO3, after all, that's where this idea was born from. AO3 has an incredibly simplistic design to convey its rather simple usage-- this is no high-tech website, this is a what-you-see-is-what-you-get kind of website meant for archival, nothing more, nothing less. Thus, I utilized a combination of cool colors and space-themed bubbles from Mort Garson and Lemon Demon alongside the simplistic fonts from AO3 to create a website that was futuristic, yet still lends its respect to its forebearers.

## Changes From 4b -> 4c

1. In making this, originally I wanted to include a list of the most commonly-used tags in all of AO3 in categorizeTags, so even if there was a fandom-specific tag used for specific situations, such as Jason Todd Returns Home to describe fics where Jason Todd is redeemed and goes back to Bruce Wayne's house, the AI would be able to recognize it. At first, this was 1 million tags that I got off of the official website itself. I quickly realized this was far, far too many tags, and whittled it down by deleting tags with less than 100 uses, which left 50,000 tags. 100 felt like a good number-- even in a large fandom, 100 uses of a tag can mark a popular trope. However, even then, it was far too many, and while testing the actions it would cut me off as I was exceeding 4 million tokens a minute, which caused me to remove the list of tags completely, with the promise I would eventually add them back. Now, for the final product, I ended up adding them back, however, I quickly realized the AI would get confused with the addition of so many tokens. It would forget what the original instructions were, and would suggest to remove tags it actually wanted to add. Not only that, it'd also take forever to get a response, to the point where I thought my code bugged out. Thus, I ended up removing even more tags, keeping only tags with above 500 uses, leaving me with 10,000 tags. This seems to be the sweet spot, however, as it drastically improves the suggestions, yet doesn't take too long for the AI to think about, nor does it confuse the AI.

2. I also ended up adding another query to the UserAuthentication concept, the _userExists query, as it would be helpful for users (and syncs) to see if a user exists before making a username. Sort of like "username is already taken, how about username4?", but without the actual suggestion.

3. I got rid of _findFicsWithDate as I realized it was an extremely unnecessary feature. If I put it in the library UI, a major section of the library would suddenly become dedicated solely to finding Fics with a certain date, which distracts from the main purpose of the page, which is to add Fics and view them. Moreover, finding fics with a certain date is wholely useless, and I cannot imagine it is a common-enough need that there would be a dedicated search bar for it making the UI far more clunky.


## Final Design!

### Categorizing

**concept** Categorizing [Fic]

**purpose** to categorize a text into specific categories (i.e. a story will be categorized into a set of tags). "Categorizing" can also *remove* tags provided by the author if deemed necessary.

**principle** A user submits their story and the tags the author has already added to the story. It outputs a list of suggested tags (properly categorized) to add to the story and tells the user if any of their author tags should be removed.

**state**

&nbsp;&nbsp;&nbsp;&nbsp; a set of FicCategories with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Fic

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a suggestedTags Category

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a tagsToRemove Category

&nbsp;&nbsp;&nbsp;&nbsp; a Category with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a set of Tags

&nbsp;&nbsp;&nbsp;&nbsp; a Tag with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Name string

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Type string

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Reason string

**actions**

&nbsp;&nbsp;&nbsp;&nbsp; **categorizeFic** (fic) : (fic)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** using an LLM, the LLM will examine the fic's ficText's contents, and associates the top 20 most relevant tags (WITHOUT suggesting tags already included in the fic's authorTags) (the tags having a name, type, and reason for why they are being suggested) to the content in a suggestedTags Category to the Fic and (if there is not an FicCategory already associated with fic) creates a new FicCategory out of those and adds the FicCategory to the set of FicCategories, or (if there is a FicCategory associated with the fic) adds the suggestedTags to said ficCategory. Finally, it returns the suggestedTags.
Type of tags includes: ArchiveWarning, fandom, character, relationship, freeform, rating, category. using an LLM, the LLM will examine the fic's ficText's contents, then compare it to each authorTag in the fic's set of authorTags. If an authorTag seems inappropriate for the fic, it will add it to a Category of tags to remove (including its name, type, and reason for removal). At the very end, if there is already a ficCategory associated with fic, it will add the tagsToRemove Category to the ficCategory. If not, it'll create a new ficCategory and associate the fic and tagsToRemovewith it, and add it to the set of ficCategories. Finally, it returns the tagsToRemove.


&nbsp;&nbsp;&nbsp;&nbsp; **deleteFicCategory** (fic) : (ficCategory)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the fic to be associated with a ficCategory in the set of ficCategories

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** removes the ficCategory associated with the fic from the set of FicCategories.


&nbsp;&nbsp;&nbsp;&nbsp; **deleteFicCategories** (deletedCount: number)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** all ficCategories to exist within the set of FicCategories.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** runs deleteFicCategory on all ficCategories in the set of ficCategories. Returns number of ficCats deleted


**queries**

&nbsp;&nbsp;&nbsp;&nbsp; **_viewFicCategory** (fic) : (ficCategory)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the fic to be associated with a ficCategory in the set of ficCategories

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** returns the ficCategory.

### Library

**concept** Library [User]

**purpose** to contain a user's story (associated with a name, a text, and a set of authorTags) in an orderly list.

**principle** A user submits a story by inputting its name, body text, and set of authorTags into the website. Then, when the user views themselves, they see their new story listed alongside all previous stories they've submitted.

**state**

&nbsp;&nbsp;&nbsp;&nbsp; a set of Users with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a set of Versions with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Title String

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a set of Fics

&nbsp;&nbsp;&nbsp;&nbsp; a Fic with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Name String

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Text String

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; an authorTags string

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a Date

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a versionNumber Number

&nbsp;&nbsp;&nbsp;&nbsp; a Date with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a day Number

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a month Number

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a year Number

**actions**

&nbsp;&nbsp;&nbsp;&nbsp; **addUser** (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the user to not exist in the set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** adds user to set of Users, associates user with empty set of Versions with an empty set of Fics.


&nbsp;&nbsp;&nbsp;&nbsp; **submitNewFic** (user, ficText: string, ficName: string, authorTags: String, date) : (fic)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the ficName to not exist within the set of the user's Versions' Title. user must exist in set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** create a Fic containing the fic's ficName as Name, ficText as Text, date as date, versionNumber as 0, and authorTags as the set of authorTags. Create a new Version with ficName as the Title, add the Fic to the new version's set of Fics. Finally, add the new version to the user's set of Versions, and finally return the fic.


&nbsp;&nbsp;&nbsp;&nbsp; **submitNewVersionOfFanfic** (user, ficText: string, authorTags: string, version, date, ficName: string) : (version)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** user must exist in set of Users, version must exist within the user's set of Versions

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** create a Fic containing the fic's ficName as Name, ficText as Text, date as date, versionNumber as the length of the set of Fics within the version + 1, and authorTags as the set of authorTags. Then, add the Fic to the version within the user's set of Versions. Finally, return the Version.


&nbsp;&nbsp;&nbsp;&nbsp; **deleteFic** (user, ficName: string, versionNumber: Number): (fic)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the ficName to exist within the set of the user's Fic's Names. user must exist in set of Users, versionNumber must exist within the range from 0 to the length of the set of Fics in version.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** removes the fic corresponding to the user's ficName and versionNumber from the user's set of Versions, then returns the fic.


&nbsp;&nbsp;&nbsp;&nbsp; **deleteFicsAndUser** (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** user must exist in set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** removes all versions from the set of user's Versions, then removes user from set of Users.


&nbsp;&nbsp;&nbsp;&nbsp; **deleteVersion** (user, ficTitle: string): (version)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the ficTitle to exist within the set of the user's Versions' Titles. user must exist in set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** removes the version associated with ficTitle as the title from the user's set of Versions, then returns the version.


**queries**

&nbsp;&nbsp;&nbsp;&nbsp; **_viewFic** (user, ficName: string, versionNumber: Number): (fic)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the ficName to exist within the set of the user's Versions' Title. user must exist in set of Users, versionNumber must exist within the range from 0 to the length of the set of Fics in version.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** displays the fic's contents corresponding to the user's Version's ficName as Title and versionNumber from the user's Version's set of Fics, then returns the fic.


&nbsp;&nbsp;&nbsp;&nbsp; **_getVersion** (user, versionTitle: string): (version)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** user must exist in set of Users, versionTitle must exist within the user's set of Versions' Titles.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effect** returns the user's version associated with the versionTitle as title.

### UserAuthentication

**concept** UserAuthentication

**purpose** limit access to stories to known users

**principle** after a user registers with a username and a password,
they can authenticate with that same username and password
and be treated each time as the same user

**state**

&nbsp;&nbsp;&nbsp;&nbsp; a set of Users with

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a username

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a password

**actions**

&nbsp;&nbsp;&nbsp;&nbsp; **register** (username: String, password: String): (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the username does not exist

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effects** creates a new User with the username username and password password, adds it to the set of Users, then returns it

&nbsp;&nbsp;&nbsp;&nbsp; **authenticate** (username: String, password: String): (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** requires the username to exist in the set of Users and for said user to have a matching username and password

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effects** returns the User associated with the username and password

&nbsp;&nbsp;&nbsp;&nbsp; **deleteUser** (username: String, password: String): (user)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **requires** the username and the password must match for a user in the set of Users

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effects** finds the user that matches with the username and password removes the user from the set of Users and returns it

**queries**

&nbsp;&nbsp;&nbsp;&nbsp; **_userExists** (user): (userExists: boolean)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **effects** returns true if a user exists that matches that user
