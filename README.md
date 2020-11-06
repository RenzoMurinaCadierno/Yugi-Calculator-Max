# Yugi Calculator MAX

A multi-purpose app to assist Yu-Gi-Oh! duelists, taken to the max!

- Up and running **_[here](https://ycm.netlify.app/)._**

  - [Guide in english](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DUVCinDalYwM%26list%3DPLJTpEATV0FvSJxulsI9mT-qwkAD_AVS6C%26fbclid%3DIwAR1WKxuc_ygY2AF5BnWVKjUSeiUPzA-g9djGux3QyoIT_TnkIUbIZRQzCcA&h=AT1vEnV8uGkiJC0msbCG7fAcdb1EvF9dcSGu7KbwrYrwcNLx1Ag-oa8s189HPSGxu8wY_s5DPTWDe8eEOsu3q9yD4bLkhq7y9ZrC1I8G8ITZoELL6DR1qU3Su0XRXtmuJWi9&__tn__=-UK-R&c[0]=AT1JDXF3NqmHAvSuYLaAwtlaPNFeSHZyHHQrdrolP06GZqx1q_-HDvjo8nwHIeS7GwrC8q1i6sJoEKrywpniMBZXJYEOtkzV64jTnTVGXYWLISWu5049qwecs-Hn9s91AlHum4pN1FegkQZXYCGdU3CXyFyVbxSc6RLe_ZU)
  - [Tutorial en español](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DFvzzoiYFFmc%26list%3DPLJTpEATV0FvQN4WdPzkj8c4tPbQoWqVZy%26fbclid%3DIwAR1afrv35-h73khTuaxcVrPWHimkEMvTsBdUHifu1ilTjGc50ZrBTg74Mkc&h=AT2o9DoiFUEERGB0PbxJ0Vq9-Rz9qAfjVkihAAARREXp04POLqx7EVCEupDUgY4SyDHzVELqoGyUy-wFUgnLQYBnwk91MzFxLHKNOp0sqfthDBribZL5ncqEFe5vvIBVBC7o&__tn__=-UK-R&c[0]=AT1JDXF3NqmHAvSuYLaAwtlaPNFeSHZyHHQrdrolP06GZqx1q_-HDvjo8nwHIeS7GwrC8q1i6sJoEKrywpniMBZXJYEOtkzV64jTnTVGXYWLISWu5049qwecs-Hn9s91AlHum4pN1FegkQZXYCGdU3CXyFyVbxSc6RLe_ZU)

## Overview

Finally, after months of working silently, I present you this massive ReactJS project on its first (alpha) release.

Yugi Calculator MAX (YCM) is an app made by a fan for fans. It includes some helpful utilities created to assist Yu-Gi-Oh! duelists in or off game:

- _Duel calculator_
- _Logging_
- _Card searching_ (with their prices in the market)
- _Deck building_ (with hand/draw testing capabilities)
- _Configuration menu_ (to customize the app)

Besides libraries mentioned in "Acknowledgments" section inside the app, YCM was completely built from scratch. Almost all hooks used here, as well as state management, component logic and styling, mediaqueries and the likes, were home-made.

I did set this one as a challange to practice everything I've learned so far, and to force myself to find solutions for any incoming problems I could face along the road. And boy there were plenty of them. I even had a bug I could not squish for three months. I named it "Fred" (R.I.P.), but that's a tale for another time.

This app is a modest gift to you all, that's why the code is here, use it as you please. It would be a dream to see people giving it a shot. Also, if you are a dev and want to work on it, just message me here or use my contact data in the app itself and I'd be more than eager to welcome you aboard. YCM is far away from perfect, so there are lots of topics yet to tackle (see "TODOs" subtitle below).

## How to use it

This is a web app, it is already uploaded and ready to use. Use the link published on top to go nuts.

However, **_keep in mind YCM was always intended to be used as a "native mobile app"_**. _Even though several devices are supported, I recommend you to download it as a PWA for a better experience._

If you are new to Progressive Web Applications (PWA), just note when loading the websites that offer them, the browser will offer you to download them to your device, like how you would do on Apple/Google store. If you choose to do so, an icon will be generated on your screen, which when tapped will open the site full-screen mode even while being offline.

Enough rambling, let's see what this little mess of a code can do.

## What can YCM do?

Fasten your seatbelts, we have lots to cover.

- **_Duel calculator_**

  - _Life points_

  Besides the basic ability to add and substract life points, you can also toggle logging on for them by tapping the switch there. If you choose to do so, each time life points are added or substracted, as well as when a duel restarts, "Logs" section will add an entry for it. You can check them whenever you want by moving to that section.

  - _Player names_

  Fully customizable. Double tap any player's name tag ("Player A" or "Player B" texts) and you will enter name-edit mode. Hitting "enter" or blurring out will change the name.

  - _Dice rolling and coins tossing_

  Tap either "coin" or "die" icon and you will toggle a modal screen (hereby called **SecondaryScreen**, or **SS** for short). You can have up to 6 coins or dice at the same time, and their actions can also be logged on command by a button click on their respective SSs.

  - _Token handling_

  "Token" icon will trigger a SS where you can add up to 6 tokens, change their images and count. Each token has its own individual image and count. Unlike life points, dice and coins, token actions cannot be logged.

  - _Timer_

  You will also notice a bar displaying "00:20:00", that's the timer. Tapping it triggers a SS where you can customize the time you want the duel to last (anywhere between 00:00:01 and 23:59:59), fire up the timer, pause, unpause or dead stop it.
  Logging is supported and will affect all other actions being logged too, as they will also state the time displayed in timer when they were performed (e.g.: log: "Player A -500 LP", timer: "00:15:30" means Player A lost 500 life points when timer was at 15 minutes and 30 seconds).

- **_Logging_**

  - _Logs_

  Logged actions from Duel Calculator will be displayed here, on the main screen.

  - _Filters_

  You can filter logs by tapping the "heart" (life points), "clock" (timer), "die" and "coin" icons. "ALL" option will show all logs, regardless of their type. Additionally, you can tap on "IG Time" to filter from oldest to newer logs, and vice-versa (basically reversing their order).

  - _Delete logs_

  The "trash" icon toggles a SS to clear all logs. **CAUTION!** This action cannot be reverted.

- **_Card searching_**

  First thing first, a GIGANTIC shout-out to [YGOPRODeck's API](https://db.ygoprodeck.com/api-guide/) for making everything database-related here possible. Card searching and deck building would not have even been considered without it. Tremendous deal for programmers and Yu-Gi-Oh! enthusiasts at the same time, like me.

  - _Search/Filter_

  Typing the name of a card (or a part of its name, like "Dark" for "Dark Magician"), and hitting "Search" button will call for the database to retrieve the searched card, or a list with every card whose name matches the searched criteria.
  If a list was returned, simply typing on it will also function as a filter by name on that loaded list. Meaning if "Dark Magician", "Dark Designator" and "Dark Magician Girl" were returned as selectable cards, typing "girl" will only leave "Dark Magician Girl" on screen as a card to click on to see details and prices.

  - _Card image details and prices_

  Once you successfully searched for a card (or selected one card in the list returned by the search), the screen will be cut in three: card image, card details and card prices.
  **Card image screen** contains a miniature of the card image that can be tapped to display the card on its full width.
  **Card description screen** has all card's data relevant to the duel itself (like its name, type, attribute, level, link markers, description, banlist status, alternate arts and so on).
  **Card prices screen** is formed by a selection of all [YuGiOh Card Prices](https://yugiohprices.com)'s averages for each set the card was printed in, as well as a selection of lowest prices available on several retailer sites.

- **_Deck Builder_**

  - _Current deck section_

  "Main", "Side", "Extra" and "Test" sections form this one.
  **The first three** will store cards you add from "Card Filter" list. Cards are represented by their names, and have four icons. The one with a **number** shows the current quantity of cards with that name (1, 2 or 3) in the section, the one with a **cross** deletes the card from the section, the one with the **arrow** moves the card from "Main" or "Extra" deck to "Side" deck (and vice-versa), and the one with **"i"** (info), will retrieve all data and prices of the card and automatically display it in "Card Search" page.
  **"Test"** section loads all cards currently in "Main" deck and, by tapping the icons there, it lets you draw 1 card, draw a hand (5 cards), shuffle the deck and reset to start testing again.

  - _Card filter_

  One app's mount, cards should have hopefully been retrieved from the database to be used here. If you see a "Cards loaded!" message on this section. You can use the provided filter bar to type for a card name (or part of its name) to make it show up on the list.
  Clicking on the card that appears once filtered will trigger two circles next to its name. The one with the **"i"** (info) loads the card in a similar fashion as the same icon stated above. The one with **+1** will add the card to the selected section, or its default section if it is not compatible with the current one (e.g. a Fusion Monster will be added to "Extra" deck if "Main" deck is loaded on screen).

  - _Deck name_

  As default, each deck is either named "Starting Deck" (if it is the default one), or "Deck" and a number for each one deck added if one already exists. Double tapping its name will trigger a field to edit said name. Hitting "enter" or tapping away will confirm changes.

  - _Deck edit menu_

  To the left of the deck's name you will find an icon with some cards in it. Tapping it toggles a SS where you can select any of your created decks to load on screen, as well as saving your progress in the current working deck, adding a new deck or deleting the selected one on the list.

- **_Configuration menu_**

  - _Life points limits_

  For each player, you can set their initial life points anywhere between 1 and 99999. They will start duels with that amount.

  - _Dice roll limits_

  Dice roll limits can be customized on ranges between 1 and 99. Probability will be equally distributed for each result, no matter the range you assign them.

  - _Log/SFX switches_

  Instead of manually turning "logging" action on for life points, dice rolls, coin tosses and timer actions, you can toggle them all from this screen by tapping on their icons.
  You can also turn sound effects on and off in the whole app by hitting the music note icon.

  - _Danger Zone_

  If you want to reset the app to its default state (like when you first downloaded it), you can do so here. This erases everything in the app, including stored decks, logs and set configurations. **CAUTION!** This action cannot be reverted!
  Additionally, if the filter list of cards failed to load in "Deck Builder", you can reload them here (that is, try to manually fetch them from database). **CAUTION!** This an expensive operation, you should not overuse it. Explanations are in the app itself.

## TODOs

If you are a developer and want to help make this project grow, there are many things on the shopping list. Contact me here or by any means stated in "Contact" section in YCM and I'll be honored to work together as a team. Of course, including you as a face here.

_Some ideas on what to do:_

- **Testing on what we have up to now**, that's the number one priority. I created and uploaded the app, but did not program any tests yet. Since it is in "alpha" state and not widespread (one can dream), I want it to be used and crashed by users to realize what is prone to fail from the word "go". This was not a test-driven development, so we might was well re-invent components if needed, and write tests on them now.
- **Code optimization**, in boatloads. There is too much to work to do on this topic alone. From code drying to nullify unnecesary re-renders. Speaking of re-renders, my biggest regret is not having embraced Redux when I had the chance, as I formerly thought the app would be just a calculator and that's it. But, one thing led to the other and here we are, sitting under an App.js wrapped around by 10 different Context Providers. If not migrating to Redux, optimizing re-renders caused by contexts would be a really nice idea.
- A very, VERY big deal would be to **find an API where card images can be pulled from with no limits and re-build CardListItem components using those as display in UI instead of strings**. Actually, the reason for which Deck Builder works with card names instead of images is because I did not want to overload YGOPRODeck's image database with multiple requests. I will try asking them for permission. If granted, this would be a massive step to tackle as it would make UI/UX much more attractive.
- Speaking of Deck Builder, a cool idea is to **make Card Items there draggable, and Card Filter list and Deck Sections, droppables**. This would create a good UX for users to drag-and-drop card items instead of clicking buttons.
- The app was initially intended to work as a PWA, so **navigating using "back" and "forward" native browser's buttons is wonky**. Swiping and using the app's navigation arrows work as intended, though.
- **Lots and lots of useEffect and useCallback warnings in console**, from dependencies that are not really needed. I suppose we could include them, but I honestly think the app might break, one way or another. Nevertheless, that's still something to correct, and of course, to test.
- **There are some CSS files across the app -as well as generic UI components- that really make your eyes bleed**. Their code is more than spaghetti, as they were my first files and I did not have a clear path to uniformly write them. You will hopefully see a significant difference on how the code was typed from file to file. That's my learning curve.
- **Mediaqueries are very simple, and in some components, really specific**. Generalizing them to appeal to all screens is a pending topic.
- Token components in "Calculator" only have their quantities and an image as a visual identifier. **It would be more functional if they also displayed editable ATK and/or DEF**. EditableInput UI component can be used for the task.
- Customization can give the user the possibility to **change primary/secondary colors from "Configs" page**. Another state in UIContext can be added, which holds those colors to pass to all components whose CSS files include primary/secondary variables. Then override those className styles with JS-set inline styles.
- **Some Toast's SFXs play when they are not supposed to** (e.g., when Toast is active and the component that renders it reloads, even though it was explicitly told not to play). This was an issue I did not investigate further since I consider it to be a minor bug. But that does not mean it cannot be tackled, of course.
- And more. Who knows how much there is to add and improve.

I am well aware of how messy the code is if you try to read and understand it by yourself. I did my best to comment what I could, but if there is anything you need to know of this app's flow please do not hesitate reaching me out. We can even Discord to work dynamically.

## What I learned from this project

YCM was built from scratch and took me months to reach its "alpha" state. Given that and how long this README is, you can pretty much work on the idea that it would be extremely hard and tedious to explain all situations I've encountered and how I dealt with them across the whole development's life span.

However, I have taken down some notes and will try to make a video explaining what I can.

## Shameless plug

As for my other projects, please feel free to go to [my GitHub page](https://github.com/RenzoMurinaCadierno) to check them out. I am still on my learning tracks, so you will see new projects frequently. I specialize in Python and Javascript, and whatever I upload is normally related to web, game and app development, or Python scripting for multiple purposes.

### Thank you for taking your time to check this project out!
